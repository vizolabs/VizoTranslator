# VizoTranslator

> AI-powered translation tool by VizoLabs

## Features

- **AI-Powered Translation** - Advanced neural machine translation powered by Claude AI
- **Multi-Language Support** - Translate between 50+ languages
- **Real-time Translation** - Fast and accurate translations in milliseconds
- **Batch Translation** - Translate multiple texts at once
- **API Access** - RESTful API for seamless integration
- **Translation Memory** - Learn and reuse past translations
- **Team Collaboration** - Work together with shared glossaries
- **Browser Extension** - Translate anywhere on the web

## Tech Stack

- **Backend**: Supabase, Node.js, Express
- **AI**: Anthropic Claude API, OpenAI
- **Web**: Next.js, Tailwind CSS
- **Extensions**: Chrome Extension
- **SDK**: JavaScript/TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/vizolabs/VizoTranslator.git
cd VizoTranslator

# Install dependencies
npm install

# Configure environment variables
cp vizolabs-api/.env.example vizolabs-api/.env

# Start the development server
npm run dev
```

### Environment Variables

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Project Structure

```
VizoTranslator/
├── vizolabs-api/        # Express.js REST API
├── vizolabs-web/        # Next.js Web Application
├── vizolabs-sdk/        # JavaScript SDK
├── supabase/           # Database migrations & schema
├── extensions/         # Browser extensions
└── docs/              # Documentation
```

## Usage

### Web App

1. Open `vizolabs-web`
2. Select source and target languages
3. Enter text to translate
4. Get instant AI-powered translation

### API

```bash
curl -X POST http://localhost:3000/api/v1/translate/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"text": "Hello", "source": "en", "target": "es"}'
```

### SDK

```javascript
import { VizoTranslator } from '@vizolabs/sdk'

const client = new VizoTranslator('your-api-key')
const result = await client.translate({
  text: 'Hello',
  source: 'en',
  target: 'es',
})
```

## Documentation

Full documentation available in the `docs/` directory.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: https://github.com/vizolabs/VizoTranslator/issues
- **Email**: vizolabsindia@gmail.com

## Authors

**VixuxOG** - [GitHub](https://github.com/VixuxOG)

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/VixuxOG">VixuxOG</a> and <a href="https://github.com/vizolabs">VizoLabs</a>
</p>
