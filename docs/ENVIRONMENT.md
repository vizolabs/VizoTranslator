# Environment Variables

Complete list of environment variables for VizoTranslator.

## API Server (`vizolabs-api`)

### Required

| Variable               | Description                         | Example                     |
| ---------------------- | ----------------------------------- | --------------------------- |
| `SUPABASE_URL`         | Your Supabase project URL           | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY`    | Supabase anonymous key (public)     | `eyJhbGciOiJIUzI1NiIs...`   |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (private) | `eyJhbGciOiJIUzI1NiIs...`   |
| `ANTHROPIC_API_KEY`    | Anthropic API key for Claude        | `sk-ant-api03-xxxxx`        |
| `JWT_SECRET`           | Secret for JWT token signing        | `your-super-secret-key`     |

### Optional

| Variable                     | Description                         | Default       |
| ---------------------------- | ----------------------------------- | ------------- |
| `OPENAI_API_KEY`             | OpenAI API key (fallback)           | -             |
| `GOOGLE_API_KEY`             | Google AI API key (fallback)        | -             |
| `STRIPE_SECRET_KEY`          | Stripe secret key                   | -             |
| `STRIPE_WEBHOOK_SECRET`      | Stripe webhook signing secret       | -             |
| `STRIPE_STARTER_PRICE_ID`    | Stripe price ID for Starter plan    | -             |
| `STRIPE_PRO_PRICE_ID`        | Stripe price ID for Pro plan        | -             |
| `STRIPE_ENTERPRISE_PRICE_ID` | Stripe price ID for Enterprise plan | -             |
| `SLACK_WEBHOOK_URL`          | Slack webhook for alerts            | -             |
| `SENTRY_DSN`                 | Sentry DSN for error tracking       | -             |
| `PORT`                       | Server port                         | `3000`        |
| `NODE_ENV`                   | Environment                         | `development` |
| `CORS_ORIGIN`                | CORS allowed origins                | `*`           |
| `RATE_LIMIT`                 | Requests per minute                 | `100`         |

### Example `.env` file

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# AI Providers
ANTHROPIC_API_KEY=sk-ant-api03-your-key
OPENAI_API_KEY=sk-your-openai-key
GOOGLE_API_KEY=your-google-key

# Security
JWT_SECRET=your-very-long-secret-key-at-least-32-chars

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_STARTER_PRICE_ID=price_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxxxx

# Alerts (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Server
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://vizotranslator.com
```

## Web App (`vizolabs-web`)

### Required

| Variable                        | Description            | Example                          |
| ------------------------------- | ---------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase URL           | `https://xxxxx.supabase.co`      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIs...`        |
| `NEXT_PUBLIC_API_URL`           | API server URL         | `https://api.vizotranslator.com` |

### Example `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Production `.env.production`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://api.vizotranslator.com
```

## Getting Your API Keys

### Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing
3. Go to Settings → API
4. Copy the URL, anon key, and service role key

### Anthropic (Claude)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Navigate to API Keys
3. Create a new API key
4. Copy and store securely

### OpenAI (Backup)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys
3. Create a new secret key
4. Copy and store securely

### Stripe (Payments)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Get your API keys from Developers → API keys
3. Create webhook endpoint for `https://your-api.com/api/v1/billing/webhook`
4. Create products and prices in Stripe Dashboard

## Security Notes

- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate API keys periodically
- Store secrets in environment variables, not in code
- Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) for production
