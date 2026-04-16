import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Clipboard,
  Vibration,
  SafeAreaView,
} from 'react-native'
import * as Speech from 'expo-speech'
import * as ClipboardModule from 'expo-clipboard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
]

export default function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('es')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<
    Array<{ input: string; output: string; from: string; to: string }>
  >([])
  const [showHistory, setShowHistory] = useState(false)
  const [detectedLang, setDetectedLang] = useState('')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('translationHistory')
      if (saved) setHistory(JSON.parse(saved))
    } catch (e) {
      console.log('Error loading history:', e)
    }
  }

  const saveHistory = async (newHistory: typeof history) => {
    try {
      await AsyncStorage.setItem('translationHistory', JSON.stringify(newHistory))
    } catch (e) {
      console.log('Error saving history:', e)
    }
  }

  const translate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to translate')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        'https://api.vizotranslator.com/api/v1/translate/translate',
        {
          text: inputText,
          source: sourceLang,
          target: targetLang,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer YOUR_API_KEY',
          },
        }
      )

      const result = response.data.translation
      setOutputText(result)
      Vibration.vibrate(50)

      const newHistory = [
        { input: inputText, output: result, from: sourceLang, to: targetLang },
        ...history.slice(0, 49),
      ]
      setHistory(newHistory)
      saveHistory(newHistory)
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert('API Key Required', 'Please configure your API key to use translation.')
      } else {
        Alert.alert('Error', 'Translation failed. Please try again.')
      }
      setOutputText('Error: Could not translate. Check your API connection.')
    } finally {
      setLoading(false)
    }
  }

  const swapLanguages = () => {
    if (sourceLang === 'auto') {
      Alert.alert('Info', 'Cannot swap when source is Auto Detect')
      return
    }
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setInputText(outputText)
    setOutputText(inputText)
  }

  const copyToClipboard = async () => {
    if (outputText) {
      await ClipboardModule.setStringAsync(outputText)
      Vibration.vibrate(50)
      Alert.alert('Copied!', 'Translation copied to clipboard')
    }
  }

  const speakText = (text: string, lang: string) => {
    const langCode = lang === 'auto' ? 'en' : lang
    Speech.speak(text, { language: langCode })
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
  }

  const selectLanguage = (type: 'source' | 'target') => {
    const languages = LANGUAGES.map((l) => l.name)
    Alert.alert(`Select ${type === 'source' ? 'Source' : 'Target'} Language`, undefined, [
      ...languages.map((lang, index) => ({
        text: lang,
        onPress: () => {
          const code = LANGUAGES[index].code
          if (type === 'source') setSourceLang(code)
          else setTargetLang(code)
        },
      })),
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  const getLanguageName = (code: string) => {
    const lang = LANGUAGES.find((l) => l.code === code)
    return lang ? `${lang.flag} ${lang.name}` : code
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌐 VizoTranslator</Text>
          <Text style={styles.headerSubtitle}>AI-Powered Translation</Text>
        </View>

        {/* Language Selector */}
        <View style={styles.langSelector}>
          <TouchableOpacity style={styles.langButton} onPress={() => selectLanguage('source')}>
            <Text style={styles.langText}>{getLanguageName(sourceLang)}</Text>
            <Text style={styles.langHint}>Tap to change</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <Text style={styles.swapIcon}>⇄</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.langButton} onPress={() => selectLanguage('target')}>
            <Text style={styles.langText}>{getLanguageName(targetLang)}</Text>
            <Text style={styles.langHint}>Tap to change</Text>
          </TouchableOpacity>
        </View>

        {/* Translation Area */}
        <ScrollView style={styles.translationArea}>
          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter text to translate..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={inputText}
              onChangeText={setInputText}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={clearAll}>
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => speakText(inputText, sourceLang)}
              >
                <Text style={styles.actionIcon}>🔊</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Translate Button */}
          <TouchableOpacity
            style={[styles.translateBtn, loading && styles.translateBtnDisabled]}
            onPress={translate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.translateBtnText}>Translate</Text>
            )}
          </TouchableOpacity>

          {/* Output */}
          <View style={styles.outputContainer}>
            <Text style={styles.outputLabel}>Translation:</Text>
            <Text style={styles.output}>{outputText || 'Translation will appear here...'}</Text>
            <View style={styles.outputActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={copyToClipboard}>
                <Text style={styles.actionIcon}>📋</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => speakText(outputText, targetLang)}
              >
                <Text style={styles.actionIcon}>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  if (outputText) {
                    setInputText(outputText)
                    setOutputText('')
                  }
                }}
              >
                <Text style={styles.actionIcon}>🔄</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* History Toggle */}
        <TouchableOpacity style={styles.historyToggle} onPress={() => setShowHistory(!showHistory)}>
          <Text style={styles.historyToggleText}>
            {showHistory ? 'Hide History' : 'Show History'} ({history.length})
          </Text>
        </TouchableOpacity>

        {/* History Panel */}
        {showHistory && (
          <View style={styles.historyPanel}>
            <Text style={styles.historyTitle}>Recent Translations</Text>
            <ScrollView style={styles.historyList}>
              {history.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyItem}
                  onPress={() => {
                    setInputText(item.input)
                    setOutputText(item.output)
                    setSourceLang(item.from)
                    setTargetLang(item.to)
                    setShowHistory(false)
                  }}
                >
                  <Text style={styles.historyInput} numberOfLines={1}>
                    {item.input}
                  </Text>
                  <Text style={styles.historyOutput} numberOfLines={1}>
                    {item.output}
                  </Text>
                  <Text style={styles.historyLangs}>
                    {getLanguageName(item.from)} → {getLanguageName(item.to)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by Claude AI • {LANGUAGES.length - 1}+ Languages
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0F2FE',
    marginTop: 4,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  langButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  langText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  langHint: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  swapIcon: {
    fontSize: 20,
    color: 'white',
  },
  translationArea: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 18,
    minHeight: 120,
    textAlignVertical: 'top',
    color: '#1F2937',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  actionIcon: {
    fontSize: 18,
  },
  translateBtn: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  translateBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  translateBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  outputContainer: {
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    minHeight: 120,
  },
  outputLabel: {
    fontSize: 12,
    color: '#0369A1',
    marginBottom: 8,
  },
  output: {
    fontSize: 18,
    color: '#0C4A6E',
    minHeight: 80,
  },
  outputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#BAE6FD',
    paddingTop: 12,
  },
  historyToggle: {
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  historyToggleText: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  historyPanel: {
    maxHeight: 200,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    padding: 12,
    paddingBottom: 8,
  },
  historyList: {
    maxHeight: 160,
  },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  historyInput: {
    fontSize: 14,
    color: '#1F2937',
  },
  historyOutput: {
    fontSize: 14,
    color: '#0EA5E9',
    marginTop: 4,
  },
  historyLangs: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
})
