import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from 'dotenv'
import { rateLimit } from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yaml'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { translateRouter } from './routes/translate.js'
import { authRouter } from './routes/auth.js'
import { projectRouter } from './routes/projects.js'
import { userRouter } from './routes/users.js'
import { glossaryRouter } from './routes/glossary.js'
import { memoryRouter } from './routes/memory.js'
import { apiRouter } from './routes/api.js'
import { webhookRouter } from './routes/webhooks.js'
import { billingRouter } from './routes/billing.js'
import { stripeRouter } from './routes/stripe.js'
import { errorHandler } from './middleware/errorHandler.js'
import { aiServiceManager } from './services/aiManager.js'

config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT || '100'),
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

app.get('/health', async (req, res) => {
  const providers = await aiServiceManager.checkProviderHealth()
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    providers: {
      anthropic: providers.anthropic,
      openai: providers.openai,
      google: providers.google,
    },
  })
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const openApiPath = path.join(__dirname, 'routes', 'openapi.yaml')
if (fs.existsSync(openApiPath)) {
  const openapiFile = fs.readFileSync(openApiPath, 'utf8')
  const openapiDoc = yaml.parse(openapiFile)
  app.use(
    '/api/v1/docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiDoc, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'VizoTranslator API Docs',
    })
  )
}

app.use('/api/v1/translate', translateRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/glossaries', glossaryRouter)
app.use('/api/v1/memory', memoryRouter)
app.use('/api/v1', apiRouter)
app.use('/api/v1/webhooks', webhookRouter)
app.use('/api/v1/billing', billingRouter)
app.use('/api/v1/stripe', stripeRouter)

app.get('/', (req, res) => {
  res.json({
    name: 'VizoTranslator API',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    health: '/health',
  })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 VizoTranslator API Running                   ║
║                                                   ║
║   📚 API Docs: http://localhost:${PORT}/api/v1/docs  ║
║   ❤️  Health:    http://localhost:${PORT}/health     ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `)
})

export default app
