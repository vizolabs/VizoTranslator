import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import GoogleGenerativeAI from '@google/generative-ai'
import { SupabaseClient } from '@supabase/supabase-js'
import type { TranslationRequest, TranslationResponse } from '../types/index.js'

export type AIProvider = 'anthropic' | 'openai' | 'google'

export class AIServiceManager {
  private anthropic: Anthropic
  private openai: OpenAI
  private google: GoogleGenerativeAI | null = null
  private supabase: SupabaseClient

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    })

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })

    if (process.env.GOOGLE_API_KEY) {
      this.google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    }

    this.supabase = new SupabaseClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    )
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const providers: AIProvider[] = ['anthropic', 'openai']
    if (this.google) providers.push('google')

    const preferredProvider = (request.provider as AIProvider) || 'anthropic'

    const orderedProviders = [
      preferredProvider,
      ...providers.filter((p) => p !== preferredProvider),
    ]

    let lastError: Error | null = null

    for (const provider of orderedProviders) {
      try {
        const result = await this.translateWithProvider(provider, request)
        await this.recordProviderUsage(provider, request, result)
        return result
      } catch (error) {
        console.error(`Provider ${provider} failed:`, error)
        lastError = error as Error
        await this.alertProviderFailure(provider, error as Error)
      }
    }

    throw lastError || new Error('All translation providers failed')
  }

  private async translateWithProvider(
    provider: AIProvider,
    request: TranslationRequest
  ): Promise<TranslationResponse> {
    const { text, source, target, context, industry, tone } = request

    const glossaryTerms = await this.getGlossaryTerms(source, target)
    const prompt = this.buildPrompt(text, source, target, context, industry, tone, glossaryTerms)

    switch (provider) {
      case 'anthropic':
        return this.translateWithAnthropic(text, source, target, prompt)
      case 'openai':
        return this.translateWithOpenAI(text, source, target, prompt)
      case 'google':
        return this.translateWithGoogle(text, source, target)
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  private async translateWithAnthropic(
    text: string,
    source: string,
    target: string,
    prompt: string
  ): Promise<TranslationResponse> {
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const translation = response.content[0].type === 'text' ? response.content[0].text : ''
    const tokens = response.usage.input_tokens + response.usage.output_tokens

    return {
      translation,
      source,
      target,
      confidence: 0.95,
      provider: 'anthropic',
      tokens,
    }
  }

  private async translateWithOpenAI(
    text: string,
    source: string,
    target: string,
    prompt: string
  ): Promise<TranslationResponse> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
    })

    const translation = response.choices[0].message.content || ''
    const tokens = response.usage.total_tokens

    return {
      translation,
      source,
      target,
      confidence: 0.93,
      provider: 'openai',
      tokens,
    }
  }

  private async translateWithGoogle(
    text: string,
    source: string,
    target: string
  ): Promise<TranslationResponse> {
    if (!this.google) {
      throw new Error('Google AI not configured')
    }

    const model = this.google.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(
      `Translate the following text from ${source} to ${target}. Only respond with the translation:\n\n${text}`
    )

    const response = await result.response
    const translation = response.text()

    return {
      translation,
      source,
      target,
      confidence: 0.9,
      provider: 'google',
    }
  }

  private buildPrompt(
    text: string,
    source: string,
    target: string,
    context?: string,
    industry?: string,
    tone?: string,
    glossary?: { source_term: string; target_term: string }[]
  ): string {
    let prompt = `Translate the following text from ${source} to ${target}.`

    if (context) prompt += `\n\nContext: ${context}`
    if (industry) prompt += `\n\nIndustry: ${industry}`
    if (tone) prompt += `\n\nTone: ${tone}`

    if (glossary && glossary.length > 0) {
      prompt += '\n\nGlossary terms to use:\n'
      glossary.forEach((g) => (prompt += `- "${g.source_term}" → "${g.target_term}"\n`))
    }

    prompt += `\n\nText to translate:\n${text}\n\nProvide only the translation.`
    return prompt
  }

  private async getGlossaryTerms(
    source: string,
    target: string
  ): Promise<{ source_term: string; target_term: string }[]> {
    try {
      const { data } = await this.supabase
        .from('glossary_terms')
        .select('source_term, target_term')
        .eq('source_lang', source)
        .eq('target_lang', target)
        .limit(50)
      return data || []
    } catch {
      return []
    }
  }

  private async recordProviderUsage(
    provider: AIProvider,
    request: TranslationRequest,
    response: TranslationResponse
  ): Promise<void> {
    try {
      await this.supabase.from('usage_logs').insert({
        endpoint: '/translate',
        method: 'POST',
        response_code: 200,
        tokens_used: response.tokens,
        characters_translated: request.text.length,
      })
    } catch (error) {
      console.error('Failed to record usage:', error)
    }
  }

  private async alertProviderFailure(provider: AIProvider, error: Error): Promise<void> {
    console.error(`[ALERT] Provider ${provider} failed:`, error.message)

    try {
      await this.supabase.from('audit_logs').insert({
        action: 'provider_failure',
        resource_type: 'ai_provider',
        new_value: { provider, error: error.message, timestamp: new Date().toISOString() },
      })

      if (process.env.SLACK_WEBHOOK_URL) {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `⚠️ VizoTranslator AI Provider Alert`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Provider:* ${provider}\n*Error:* ${error.message}\n*Time:* ${new Date().toISOString()}`,
                },
              },
            ],
          }),
        })
      }
    } catch (alertError) {
      console.error('Failed to send alert:', alertError)
    }
  }

  async checkProviderHealth(): Promise<Record<AIProvider, boolean>> {
    const health: Record<AIProvider, boolean> = {
      anthropic: false,
      openai: false,
      google: false,
    }

    try {
      await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }],
      })
      health.anthropic = true
    } catch {}

    try {
      await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'test' }],
      })
      health.openai = true
    } catch {}

    if (this.google) {
      try {
        const model = this.google.getGenerativeModel({ model: 'gemini-pro' })
        await model.generateContent('test')
        health.google = true
      } catch {}
    }

    return health
  }
}

export const aiServiceManager = new AIServiceManager()
