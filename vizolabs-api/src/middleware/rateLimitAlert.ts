import { Request, Response, NextFunction } from 'express'
import { SupabaseClient } from '@supabase/supabase-js'

const supabase = new SupabaseClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

interface RateLimitConfig {
  windowMs: number
  max: number
  message: string
  alertThreshold: number
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  free: {
    windowMs: 60000,
    max: 100,
    message: 'Rate limit exceeded. Upgrade for more requests.',
    alertThreshold: 80,
  },
  starter: { windowMs: 60000, max: 1000, message: 'Rate limit exceeded.', alertThreshold: 800 },
  pro: { windowMs: 60000, max: 10000, message: 'Rate limit exceeded.', alertThreshold: 8000 },
  enterprise: {
    windowMs: 60000,
    max: -1,
    message: 'Enterprise limit reached.',
    alertThreshold: -1,
  },
}

interface UserRateLimit {
  requests: number[]
  alerts: { threshold: number; alerted: boolean }[]
}

const userRateLimits = new Map<string, UserRateLimit>()

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id
  if (!userId) {
    return next()
  }

  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    const plan = subscription?.plan || 'free'
    const config = rateLimitConfigs[plan] || rateLimitConfigs.free

    if (config.max === -1) {
      return next()
    }

    if (!userRateLimits.has(userId)) {
      userRateLimits.set(userId, { requests: [], alerts: [] })
    }

    const userLimit = userRateLimits.get(userId)!
    const now = Date.now()
    const windowStart = now - config.windowMs

    userLimit.requests = userLimit.requests.filter((t) => t > windowStart)
    userLimit.requests.push(now)

    const usagePercent = (userLimit.requests.length / config.max) * 100

    if (
      usagePercent >= config.alertThreshold &&
      !userLimit.alerts.find((a) => a.threshold === config.alertThreshold)?.alerted
    ) {
      await sendRateLimitAlert(userId, plan, usagePercent, userLimit.requests.length, config.max)

      const alert = userLimit.alerts.find((a) => a.threshold === config.alertThreshold)
      if (alert) {
        alert.alerted = true
      } else {
        userLimit.alerts.push({ threshold: config.alertThreshold, alerted: true })
      }
    }

    if (userLimit.requests.length > config.max) {
      return res.status(429).json({
        error: config.message,
        retry_after: Math.ceil(config.windowMs / 1000),
        current_usage: userLimit.requests.length,
        limit: config.max,
        plan,
      })
    }

    res.setHeader('X-RateLimit-Limit', config.max)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.max - userLimit.requests.length))
    res.setHeader('X-RateLimit-Reset', Math.ceil((windowStart + config.windowMs) / 1000))

    next()
  } catch (error) {
    console.error('Rate limit middleware error:', error)
    next()
  }
}

async function sendRateLimitAlert(
  userId: string,
  plan: string,
  usagePercent: number,
  currentUsage: number,
  limit: number
): Promise<void> {
  console.warn(
    `[ALERT] User ${userId} at ${usagePercent.toFixed(1)}% rate limit usage (${currentUsage}/${limit})`
  )

  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: 'rate_limit_warning',
      resource_type: 'user',
      new_value: {
        plan,
        usage_percent: usagePercent,
        current_usage: currentUsage,
        limit,
        timestamp: new Date().toISOString(),
      },
    })

    if (process.env.SLACK_WEBHOOK_URL && usagePercent >= 90) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 VizoTranslator Rate Limit Alert`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*User:* ${userId}\n*Plan:* ${plan}\n*Usage:* ${usagePercent.toFixed(1)}% (${currentUsage}/${limit})\n*Status:* Near limit!`,
              },
            },
          ],
        }),
      })
    }

    if (process.env.SENTRY_DSN && usagePercent >= 95) {
      console.error('Sentry:', {
        userId,
        plan,
        usagePercent,
        currentUsage,
        limit,
      })
    }
  } catch (error) {
    console.error('Failed to send rate limit alert:', error)
  }
}

export function getRateLimitStatus(
  userId: string,
  plan: string = 'free'
): {
  current: number
  limit: number
  remaining: number
  percent: number
} {
  const config = rateLimitConfigs[plan] || rateLimitConfigs.free
  const userLimit = userRateLimits.get(userId)

  if (!userLimit) {
    return { current: 0, limit: config.max, remaining: config.max, percent: 0 }
  }

  const now = Date.now()
  const windowStart = now - config.windowMs
  const currentRequests = userLimit.requests.filter((t) => t > windowStart).length

  return {
    current: currentRequests,
    limit: config.max,
    remaining: Math.max(0, config.max - currentRequests),
    percent: config.max > 0 ? (currentRequests / config.max) * 100 : 0,
  }
}

setInterval(() => {
  const now = Date.now()
  const windowMs = 60000

  for (const [userId, userLimit] of userRateLimits.entries()) {
    const validRequests = userLimit.requests.filter((t) => now - t < windowMs)
    if (validRequests.length === 0) {
      userRateLimits.delete(userId)
    } else {
      userLimit.requests = validRequests
      userLimit.alerts = userLimit.alerts.filter((a) => {
        const config = rateLimitConfigs.free
        const usage = validRequests.length / config.max
        return usage >= a.threshold / 100
      })
    }
  }
}, 60000)
