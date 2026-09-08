// ============================================================
// Voice Service — Web Speech API (STT + TTS)
// Gracefully degrades if not supported
// ============================================================

export const isSpeechSupported = {
  recognition: typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  synthesis: typeof window !== 'undefined' && 'speechSynthesis' in window,
}

// ── Text-to-Speech ─────────────────────────────────────────
export function speak(text: string, lang = 'en-IN', rate = 0.85, pitch = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSupported.synthesis) {
      resolve()
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 1

    // Try to use a natural voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))
    ) || voices.find((v) => v.lang.startsWith('en'))
    
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onend = () => resolve()
    utterance.onerror = (e) => {
      // Don't reject on 'interrupted' error - it's expected
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
    this.recognition.lang = options.lang || 'en-IN'
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
