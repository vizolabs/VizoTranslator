# VizoTranslator Deployment Guide

Complete guide to deploy VizoTranslator to production.

## Quick Deploy Options

### Option 1: Vercel + Railway (Recommended)

**Frontend (Vercel)**

```bash
cd vizolabs-web
vercel
```

**API (Railway)**

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Deploy
cd vizolabs-api
railway init
railway up
```

### Option 2: Docker (Self-hosted)

```bash
# Clone repository
git clone https://github.com/vizolabs/VizoTranslator.git
cd VizoTranslator

# Set up environment
cp vizolabs-api/.env.example .env
nano .env  # Fill in your values

# Deploy with Docker Compose
docker-compose up -d
```

### Option 3: Manual Server

**Server Requirements**

- Ubuntu 20.04+ / Debian 11+
- Node.js 20+
- PostgreSQL 14+ (if not using Supabase)
- Nginx
- SSL certificate

**Steps**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Clone and setup
git clone https://github.com/vizolabs/VizoTranslator.git
cd VizoTranslator
npm install

# Build API
cd vizolabs-api
npm install
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/vizotranslator
```

**Nginx Config**

```nginx
server {
    listen 80;
    server_name api.vizotranslator.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name vizotranslator.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Setup

### Option 1: Supabase (Recommended)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Run migration from `supabase/migrations/001_initial_schema.sql`

### Option 2: Self-hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE vizotranslator;
CREATE USER vizouser WITH ENCRYPTED PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE vizotranslator TO vizouser;

# Run migrations
psql -h localhost -U vizouser -d vizotranslator -f supabase/migrations/001_initial_schema.sql
```

## Environment Configuration

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Configure Stripe keys
- [ ] Set up Anthropic API key
- [ ] Configure CORS with your domain
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry)
- [ ] Configure Slack alerts

## SSL Certificate

```bash
# Using Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d vizotranslator.com -d api.vizotranslator.com

# Auto-renew
sudo certbot renew --dry-run
```

## Monitoring Setup

### Health Check Endpoint

```bash
curl https://api.vizotranslator.com/health
```

### Prometheus Metrics (optional)

Add `/metrics` endpoint for Prometheus scraping.

## CI/CD Pipeline

The repository includes GitHub Actions workflows for:

- Linting and testing on every push
- Auto-deployment to staging on `develop` branch
- Auto-deployment to production on `main` branch

### Required Secrets

In GitHub repository Settings → Secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `ANTHROPIC_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `STRIPE_SECRET_KEY`

## Troubleshooting

### API not starting

```bash
# Check logs
docker-compose logs api

# Verify environment
echo $SUPABASE_URL
echo $ANTHROPIC_API_KEY
```

### Database connection issues

```bash
# Test connection
psql $SUPABASE_URL -U postgres
```

### Build errors

```bash
cd vizolabs-api
npm cache clean --force
rm -rf node_modules
npm install
```

## Support

- Email: vizolabsindia@gmail.com
- Issues: https://github.com/vizolabs/VizoTranslator/issues
