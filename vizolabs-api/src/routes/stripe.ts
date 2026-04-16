import Stripe from 'stripe'
import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { SupabaseClient } from '@supabase/supabase-js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
const supabase = new SupabaseClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    requests: 100,
    chars: 5000,
    stripePriceId: null,
  },
  starter: {
    name: 'Starter',
    price: 9.99,
    requests: 1000,
    chars: 50000,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
  },
  pro: {
    name: 'Pro',
    price: 29.99,
    requests: 10000,
    chars: 500000,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  enterprise: {
    name: 'Enterprise',
    price: 99.99,
    requests: -1,
    chars: -1,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
  },
}

router.get('/plans', (req: Request, res: Response) => {
  res.json({
    plans: PLANS,
    currency: 'usd',
  })
})

router.get('/subscription', authMiddleware, async (req: Request, res: Response) => {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', req.user!.id)
    .eq('status', 'active')
    .single()

  const { data: usageLogs } = await supabase
    .from('usage_logs')
    .select('id')
    .eq('user_id', req.user!.id)
    .gte('created_at', subscription?.current_period_start || new Date().toISOString())

  const plan = PLANS[subscription?.plan as keyof typeof PLANS] || PLANS.free

  res.json({
    subscription: subscription || { plan: 'free' },
    usage: {
      requests: usageLogs?.length || 0,
      characters: 0,
      plan_limits: plan,
    },
  })
})

router.post('/subscribe', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { plan } = req.body

    if (!['free', 'starter', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' })
    }

    if (plan === 'free') {
      await supabase.from('subscriptions').upsert(
        {
          user_id: req.user!.id,
          plan: 'free',
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { onConflict: 'user_id' }
      )

      return res.json({ subscription: { plan: 'free', status: 'active' } })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: PLANS[plan as keyof typeof PLANS].stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      customer_email: req.user!.email,
      metadata: {
        user_id: req.user!.id,
        plan,
      },
    })

    res.json({ checkout_url: session.url })
  } catch (error) {
    console.error('Subscription error:', error)
    res.status(500).json({ error: 'Failed to create subscription' })
  }
})

router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).send('Webhook Error')
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan

      if (userId && plan) {
        const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

        await supabase.from('subscriptions').upsert(
          {
            user_id: userId,
            plan,
            status: 'active',
            stripe_subscription_id: session.subscription,
            stripe_customer_id: session.customer,
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
          },
          { onConflict: 'user_id' }
        )
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const status = subscription.status === 'active' ? 'active' : 'past_due'

      await supabase
        .from('subscriptions')
        .update({
          status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  res.json({ received: true })
})

router.post('/cancel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', req.user!.id)
      .eq('status', 'active')
      .single()

    if (!subscription?.stripe_subscription_id) {
      return res.status(400).json({ error: 'No active subscription' })
    }

    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('user_id', req.user!.id)

    res.json({ message: 'Subscription will be cancelled at period end' })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
})

router.get('/invoices', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false })

    res.json({ invoices: invoices || [] })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' })
  }
})

router.post('/customer-portal', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', req.user!.id)
      .single()

    if (!subscription?.stripe_customer_id) {
      return res.status(400).json({ error: 'No billing account found' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    })

    res.json({ portal_url: session.url })
  } catch (error) {
    console.error('Customer portal error:', error)
    res.status(500).json({ error: 'Failed to create portal session' })
  }
})

export { router as stripeRouter, PLANS }
