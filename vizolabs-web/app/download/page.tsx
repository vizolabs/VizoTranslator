'use client'

import { useState } from 'react'
import { Smartphone, Download, Monitor, Globe, ArrowRight } from 'lucide-react'

export default function DownloadPage() {
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('')

  const platforms = [
    {
      id: 'android',
      name: 'Android',
      icon: '🤖',
      version: 'v1.0.0',
      size: '24.5 MB',
      requirements: 'Android 8.0+',
      releaseDate: '2026-04-16',
      features: ['Offline translation', 'Camera translation', 'Widget support', 'Dark mode'],
      apkUrl: '/downloads/vizotranslator-android.apk',
      badge: 'Recommended',
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: '🍎',
      version: 'v1.0.0',
      size: 'Coming Soon',
      requirements: 'iOS 14.0+',
      releaseDate: 'Q2 2026',
      features: ['App Clip support', 'Widget support', 'Siri integration', 'Dark mode'],
      apkUrl: null,
      badge: 'Coming Soon',
    },
    {
      id: 'windows',
      name: 'Windows',
      icon: '🪟',
      version: 'v1.0.0',
      size: 'Coming Soon',
      requirements: 'Windows 10+',
      releaseDate: 'Q2 2026',
      features: ['Desktop widget', 'System tray', 'Keyboard shortcuts', 'Dark mode'],
      apkUrl: null,
      badge: 'Coming Soon',
    },
    {
      id: 'macos',
      name: 'macOS',
      icon: '💻',
      version: 'v1.0.0',
      size: 'Coming Soon',
      requirements: 'macOS 12+',
      releaseDate: 'Q2 2026',
      features: ['Menu bar app', 'Keyboard shortcuts', 'Apple Silicon optimized', 'Dark mode'],
      apkUrl: null,
      badge: 'Coming Soon',
    },
  ]

  const handleDownload = (platform: (typeof platforms)[0]) => {
    if (platform.apkUrl) {
      window.open(platform.apkUrl, '_blank')
    } else {
      setSelectedPlatform(platform.name)
      setShowDownloadModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <span className="text-xl font-bold">VizoTranslator</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Home
              </a>
              <a href="/download" className="text-primary-600 font-medium">
                Download
              </a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Pricing
              </a>
              <a href="/login" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Login
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 mb-6">
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">Mobile & Desktop Apps</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Translate Anywhere, <span className="text-primary-600">Anywhere</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Download VizoTranslator for your device. Work offline, translate in real-time, and sync
            across all your devices.
          </p>
        </div>
      </section>

      {/* Download Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                  platform.badge === 'Recommended' ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {platform.badge && (
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                      platform.badge === 'Recommended'
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {platform.badge}
                  </div>
                )}

                <div className="p-6">
                  <div className="text-5xl mb-4">{platform.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {platform.requirements}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {platform.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="text-primary-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>Version: {platform.version}</span>
                    <span>{platform.size}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(platform)}
                    disabled={!platform.apkUrl}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                      platform.apkUrl
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    {platform.apkUrl ? 'Download APK' : 'Coming Soon'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            App Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                50+ Languages
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Translate between any of our 50+ supported languages with AI-powered accuracy.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cross-Platform Sync
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start on your phone, continue on desktop. Your translations sync in real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Offline Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Download language packs and translate even without internet connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedPlatform} App Coming Soon!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're working hard to bring VizoTranslator to {selectedPlatform}. Join our waitlist
                to get notified when it's available!
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  Join Waitlist
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="mt-4 text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <span className="font-semibold text-gray-900 dark:text-white">VizoTranslator</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <a href="/about" className="hover:text-primary-600">
                About
              </a>
              <a href="/docs" className="hover:text-primary-600">
                Documentation
              </a>
              <a href="/privacy" className="hover:text-primary-600">
                Privacy
              </a>
              <a href="mailto:vizolabsindia@gmail.com" className="hover:text-primary-600">
                Contact
              </a>
            </div>
            <div className="text-sm text-gray-500">© 2026 VizoLabs. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
