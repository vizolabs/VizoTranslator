# VizoTranslator Android App

## Overview

VizoTranslator Android App is a native mobile application built with React Native and Expo, providing AI-powered translation on-the-go.

## Features

- 🌐 **50+ Languages** - Translate between major world languages
- 🤖 **AI-Powered** - Powered by Claude AI for accurate translations
- 🔊 **Text-to-Speech** - Listen to translations
- 📋 **Copy to Clipboard** - Easy sharing
- 📜 **Translation History** - Access past translations
- 🔄 **Swap Languages** - Quick language switching
- 📱 **Offline Support** - View history offline

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State**: React hooks + AsyncStorage
- **API Client**: Axios
- **Speech**: Expo Speech
- **Storage**: AsyncStorage

## Project Structure

```
android-app/
├── App.tsx              # Main app component
├── app.json            # Expo configuration
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── eas.json           # EAS Build config
└── assets/            # App icons and images
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio (for emulator)
- EAS CLI (for building APK)

## Installation

### 1. Install Dependencies

```bash
cd android-app
npm install
```

### 2. Configure API

Edit `App.tsx` and replace `YOUR_API_KEY` with your VizoTranslator API key:

```typescript
headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
}
```

Or configure via environment variables in production.

### 3. Start Development

```bash
# Start Expo
npm start

# Run on Android (requires emulator or device)
npm run android
```

## Building APK

### Option 1: Local Build (without EAS)

```bash
# Install Expo globally if not already
npm install -g expo-cli

# Generate android directory
npx expo prebuild --platform android

# Build debug APK
cd android
./gradlew assembleDebug

# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

### Option 2: EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for Android (Preview)
eas build -p android --profile preview

# Build for Android (Production)
eas build -p android --profile production
```

### Option 3: Local with EAS

```bash
# Build locally
eas build --platform android --local
```

## APK Output Location

| Build Type | Location                                                |
| ---------- | ------------------------------------------------------- |
| Debug      | `android/app/build/outputs/apk/debug/app-debug.apk`     |
| Release    | `android/app/build/outputs/apk/release/app-release.apk` |
| EAS Cloud  | Download link from Expo                                 |

## App Configuration

### Changing API URL

Edit `App.tsx`:

```typescript
const response = await axios.post(
  'https://your-api-domain.com/api/v1/translate/translate'
  // ...
)
```

### Adding Languages

Edit the `LANGUAGES` array in `App.tsx`:

```typescript
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  // Add more...
]
```

### App Icon

Replace files in `assets/` folder:

- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen
- `adaptive-icon.png` - Adaptive icon

## Permissions

The app requests these permissions:

- `INTERNET` - For API calls
- `CAMERA` - For text scanning (future feature)
- `RECORD_AUDIO` - For voice input (future feature)

## Building for Release

### 1. Generate Keystore

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing

Add to `android/app/build.gradle`:

```gradle
android {
  ...
  signingConfigs {
    release {
      storeFile file('my-release-key.keystore')
      storePassword 'your-keystore-password'
      keyAlias 'my-key-alias'
      keyPassword 'your-key-password'
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
    }
  }
}
```

### 3. Build Release APK

```bash
cd android
./gradlew assembleRelease
```

## Troubleshooting

### Metro Bundler Issues

```bash
npx react-native start --reset-cache
```

### Clean Build

```bash
rm -rf android
npx expo prebuild --platform android
cd android && ./gradlew clean
```

### Java Version Issues

Expo requires Java 17. Set JAVA_HOME:

```bash
export JAVA_HOME=/path/to/java17
```

## Support

- **Email**: vizolabsindia@gmail.com
- **Issues**: https://github.com/vizolabs/VizoTranslator/issues

## License

MIT License - See LICENSE file in root directory
