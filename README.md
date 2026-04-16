# VizoTranslator

> AI-powered translation tool by VizoLabs

## 📥 Download

### Mobile App (Android)

[![Download APK](https://img.shields.io/badge/Download-APK-32CD32?style=for-the-badge&logo=android)](https://github.com/vizolabs/VizoTranslator/releases/latest/download/vizotranslator-android.apk)
[![Latest Release](https://img.shields.io/github/v/release/vizolabs/VizoTranslator?style=for-the-badge)](https://github.com/vizolabs/VizoTranslator/releases/latest)

| Platform   | Status        | Download                                                                                                       |
| ---------- | ------------- | -------------------------------------------------------------------------------------------------------------- |
| 🤖 Android | **Available** | [Download APK](https://github.com/vizolabs/VizoTranslator/releases/latest/download/vizotranslator-android.apk) |
| 🍎 iOS     | Coming Soon   | [Join Waitlist](https://github.com/vizolabs/VizoTranslator/releases)                                           |
| 🪟 Windows | Coming Soon   | [Join Waitlist](https://github.com/vizolabs/VizoTranslator/releases)                                           |
| 💻 macOS   | Coming Soon   | [Join Waitlist](https://github.com/vizolabs/VizoTranslator/releases)                                           |

---

## Features

- **AI-Powered Translation** - Advanced neural machine translation powered by Claude AI
- **Multi-Language Support** - Translate between 50+ languages
- **Real-time Translation** - Fast and accurate translations in milliseconds
- **Batch Translation** - Translate multiple texts at once
- **API Access** - RESTful API for seamless integration
- **Translation Memory** - Learn and reuse past translations
- **Team Collaboration** - Work together with shared glossaries
- **Browser Extension** - Translate anywhere on the web
- **Mobile App** - Translate on the go with offline support

## Tech Stack

- **Backend**: Supabase, Node.js, Express
- **AI**: Anthropic Claude API, OpenAI, Google Gemini
- **Web**: Next.js, Tailwind CSS
- **Mobile**: React Native
- **Extensions**: Chrome, Firefox, VS Code
- **SDK**: JavaScript/TypeScript

## Quick Start

### Web App

🚀 **Try it now**: [https://vizotranslator.com](https://vizotranslator.com)

### Mobile App

📱 **Download Android APK**: [v1.0.0 (24.5 MB)](https://github.com/vizolabs/VizoTranslator/releases/latest/download/vizotranslator-android.apk)

### Self-Hosted

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

### Docker

```bash
# Pull and run with Docker
docker-compose up -d
```

## Project Structure

```
VizoTranslator/
├── vizolabs-api/        # Express.js REST API
├── vizolabs-web/        # Next.js Web Application
├── vizolabs-sdk/        # JavaScript SDK
├── supabase/           # Database migrations & schema
├── extensions/          # Browser extensions (Chrome, Firefox, VS Code)
└── docs/              # Documentation
```

## API Usage

```bash
curl -X POST https://api.vizotranslator.com/api/v1/translate/translate \
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

- [API Documentation](https://github.com/vizolabs/VizoTranslator/blob/main/vizolabs-api/src/routes/openapi.yaml)
- [Deployment Guide](https://github.com/vizolabs/VizoTranslator/blob/main/docs/DEPLOYMENT.md)
- [Environment Variables](https://github.com/vizolabs/VizoTranslator/blob/main/docs/ENVIRONMENT.md)

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

## Releases

📦 **Latest Release**: [v1.0.0](https://github.com/vizolabs/VizoTranslator/releases/latest)

## Authors

**VixuxOG** - [GitHub](https://github.com/VixuxOG)

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/VixuxOG">VixuxOG</a> and <a href="https://github.com/vizolabs">VizoLabs</a>
</p>
