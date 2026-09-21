// ============================================================
// Voice Service — Web Speech API (STT + TTS)
// Dynamically synced with active i18n language setting
// ============================================================

import i18n from 'i18next'

export const isSpeechSupported = {
  recognition:
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  synthesis: typeof window !== 'undefined' && 'speechSynthesis' in window,
}

// ── Language Locale Mapper ──────────────────────────────────
export function getVoiceLocale(appLang?: string): string {
  const currentLang = appLang || i18n.language || 'en'
  const localeMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    as: 'as-IN',
    mni: 'mni-IN',
  }
  return localeMap[currentLang] || 'en-IN'
}

export function setSpeechLocale(langCode: string): string {
  i18n.changeLanguage(langCode)
  return getVoiceLocale(langCode)
}

// ── Text-to-Speech ─────────────────────────────────────────
export function speak(
  text: string,
  lang?: string,
  rate = 0.85,
  pitch = 1
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSupported.synthesis) {
      resolve()
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const targetLocale = lang || getVoiceLocale()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = targetLocale
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 1

    // Select natural voice matching locale or language prefix fallback
    const voices = window.speechSynthesis.getVoices()
    const langPrefix = targetLocale.split('-')[0]
    const preferredVoice =
      voices.find((v) => v.lang === targetLocale) ||
      voices.find((v) => v.lang.startsWith(langPrefix)) ||
      voices.find((v) => v.lang.startsWith('hi')) ||
      voices.find((v) => v.lang.startsWith('en'))

    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onend = () => resolve()
    utterance.onerror = (e) => {
      // Don't reject on 'interrupted' error - it's expected behavior on new speak calls
      if (e.error === 'interrupted') resolve()
      else reject(e)
    }

    window.speechSynthesis.speak(utterance)
  })
}

export function stopSpeaking(): void {
  if (isSpeechSupported.synthesis) {
    window.speechSynthesis.cancel()
  }
}

// ── Speech-to-Text ─────────────────────────────────────────
export interface STTOptions {
  lang?: string
  continuous?: boolean
  onResult: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onEnd?: () => void
}

export class SpeechRecognitionService {
  private recognition: any = null
  private isListening = false

  start(options: STTOptions): boolean {
    if (!isSpeechSupported.recognition) {
      options.onError?.('Speech recognition not supported on this device')
      return false
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    this.recognition = new SpeechRecognition()
    this.recognition.lang = options.lang || getVoiceLocale()
    this.recognition.continuous = options.continuous ?? false
    this.recognition.interimResults = true
    this.recognition.maxAlternatives = 1

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcript = result[0].transcript
      const isFinal = result.isFinal
      options.onResult(transcript, isFinal)
    }

    this.recognition.onerror = (event: any) => {
      options.onError?.(event.error)
      this.isListening = false
    }

    this.recognition.onend = () => {
      this.isListening = false
      options.onEnd?.()
    }

    this.recognition.start()
    this.isListening = true
    return true
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  get listening(): boolean {
    return this.isListening
  }
}

export const speechRecognition = new SpeechRecognitionService()
