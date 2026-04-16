# VizoTranslator 📱

> AI-Powered Translation App for Android

---

## 💝 Why I Built This

My dad needed fast translations for his daily work. No time to copy-paste into GPT or wait around.

So I built **VizoTranslator** - one tap, instant translation. No subscriptions. No waiting. Just open and translate.

**Made for my dad. 🇮🇳**

---

## 📥 Download

### Android App (Latest Version)

📱 **[Download APK - Click Here](https://github.com/vizolabs/VizoTranslator/releases/download/v1.0.0/vizotranslator-android.apk)**

| Version | Size   | Date       |
| ------- | ------ | ---------- |
| v1.0.0  | ~25 MB | April 2026 |

**Note:** This app is only available for **Android**. No iOS or Web version.

---

## ✨ Features

- 🌐 **50+ Languages** - Translate between major world languages
- 🤖 **AI-Powered** - Powered by Claude AI for accurate translations
- ⚡ **Fast & Simple** - No complicated settings, just translate
- 📜 **Translation History** - Access your recent translations
- 🔊 **Text-to-Speech** - Listen to translations
- 📋 **Copy to Clipboard** - Easy sharing
- 🔄 **Swap Languages** - Quick language switching
- 📱 **Works Offline** - View history without internet

---

## 🚀 Getting Started

### Installation

1. Download the APK from the link above
2. Open the downloaded file
3. If prompted, enable "Install from unknown sources" in Settings
4. Tap "Install"
5. Open VizoTranslator and start translating!

### Usage

1. **Select Languages** - Tap the top buttons to choose source and target languages
2. **Enter Text** - Type or paste text in the input field
3. **Translate** - Tap the "Translate" button
4. **Listen/Copy** - Use the buttons to hear or copy the translation

---

## 📱 Supported Languages

English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi, Dutch, Polish, Turkish, Vietnamese, Thai, Indonesian, Malay, and more!

---

## 🔧 Technical Details

- **Platform**: Android (Native)
- **Framework**: React Native + Expo
- **AI**: Claude AI (Anthropic)
- **Language**: TypeScript

---

## ⚠️ Important Notes

- **Android Only** - This app is not available for iOS or web browsers
- **Internet Required** - Translation requires internet connection (except viewing history)
- **API Key Required** - For self-hosted version, you need a VizoTranslator API key

---

## 📂 Project Structure

```
VizoTranslator/
├── android-app/           # React Native app
│   ├── App.tsx          # Main app code
│   ├── app.json         # Expo configuration
│   ├── package.json     # Dependencies
│   ├── eas.json         # Build configuration
│   └── README.md        # App documentation
├── CONTRIBUTING.md      # Contribution guidelines
└── LICENSE              # MIT License
```

---

## 🛠️ Build from Source

```bash
# Clone repository
git clone https://github.com/vizolabs/VizoTranslator.git
cd VizoTranslator/android-app

# Install dependencies
npm install

# Start development
npm start

# Build APK
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

---

## 💡 Future Plans

- 📷 Camera translation (scan text and translate)
- 🎤 Voice input (speak instead of typing)
- 📖 Offline translation pack
- 🌐 More languages

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📧 Support

- **Email**: vizolabsindia@gmail.com
- **Issues**: [GitHub Issues](https://github.com/vizolabs/VizoTranslator/issues)

---

## 📜 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

<p align="center">
  Made with ❤️ for my dad<br>
  <a href="https://github.com/vizolabs">VizoLabs</a>
</p>
