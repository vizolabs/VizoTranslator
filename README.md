# VizoTranslator

> AI-powered translation tool by VizoLabs

## 📥 Download

### Android App (Available Now!)

📱 **Download APK**: [v1.0.0 - Click to Download](https://github.com/vizolabs/VizoTranslator/releases/download/v1.0.0/vizotranslator-android.apk)

| Platform   | Status           | Download                                                                                                       |
| ---------- | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| 🤖 Android | ✅ **Available** | [Download APK](https://github.com/vizolabs/VizoTranslator/releases/download/v1.0.0/vizotranslator-android.apk) |
| 🌐 Web App | ✅ Available     | [Launch Web App](https://vizotranslator.com)                                                                   |

> ⚠️ **iOS is NOT supported** - VizoTranslator is available for Android and Web only.

---

## Features

- **AI-Powered Translation** - Advanced neural machine translation powered by Claude AI
- **Multi-Language Support** - Translate between 50+ languages
- **Real-time Translation** - Fast and accurate translations
- **Text-to-Speech** - Listen to translations
- **Translation History** - Access past translations
- **Offline History** - View saved translations offline
- **API Access** - RESTful API for developers
- **Browser Extension** - Translate on Chrome

## Android App Features

- 🌐 50+ Languages
- 🤖 AI-Powered (Claude)
- 🔊 Text-to-Speech
- 📋 Copy to Clipboard
- 📜 Translation History
- 🔄 Language Swap
- 📱 Works Offline (History)

## Tech Stack

- **Backend**: Supabase, Node.js, Express
- **AI**: Anthropic Claude API, OpenAI, Google Gemini
- **Web**: Next.js, Tailwind CSS
- **Mobile**: React Native, Expo
- **Extensions**: Chrome, Firefox, VS Code
- **SDK**: JavaScript/TypeScript

## Quick Start

### 🌐 Web App

🚀 **Try online**: [https://vizotranslator.com](https://vizotranslator.com)

### 📱 Android App

📥 **Download APK**: [v1.0.0](https://github.com/vizolabs/VizoTranslator/releases/download/v1.0.0/vizotranslator-android.apk)

### 💻 Self-Hosted

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

### 🐳 Docker

```bash
docker-compose up -d
```

## Project Structure

```
VizoTranslator/
├── vizolabs-api/        # Express.js REST API
├── vizolabs-web/        # Next.js Web Application
├── android-app/         # Android Mobile App (React Native/Expo)
├── vizolabs-sdk/        # JavaScript SDK
├── supabase/           # Database migrations & schema
├── extensions/          # Browser extensions
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
- [Android App Guide](https://github.com/vizolabs/VizoTranslator/blob/main/android-app/README.md)
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

## Authors

**VixuxOG** - [GitHub](https://github.com/VixuxOG)

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/VixuxOG">VixuxOG</a> and <a href="https://github.com/vizolabs">VizoLabs</a>
</p>
