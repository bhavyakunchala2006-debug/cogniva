// ============================================================
// VoicePage.tsx — Cogniva Voice Companion Screen
// Real-Time Dynamic AI Context, Multilingual i18n & Action Intent Navigation
// ============================================================

import React, { useState, useEffect, useRef } from 'react'
import { SpeechRecognitionService, speak } from '@/services/voice/VoiceService'
import { aiService, AIMessage } from '@/services/ai/AIService'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DEMO_ELDERLY_PROFILE, DEMO_REMINDERS } from '@/data/demoData'
import { Mic, MicOff, Volume2, RotateCcw, Clock, Sparkles, Send, ArrowLeft, Bot, User, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  isOffline?: boolean
}

export function VoicePage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { currentUser } = useAuth()

  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [textInput, setTextInput] = useState('')

  const speechRef = useRef<SpeechRecognitionService | null>(null)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  // Initialize initial greeting in selected language
  useEffect(() => {
    const greetingText = t('voice.listeningPrompt', { defaultValue: "Namaste! I am Cogniva, your voice companion. Tap the big microphone button to speak with me." })
    setMessages([
      {
        id: '1',
        sender: 'assistant',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }, [i18n.language, t])

  useEffect(() => {
    speechRef.current = new SpeechRecognitionService()
  }, [])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  const handleSpeechResult = async (userText: string) => {
    if (!userText.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsProcessing(true)

    try {
      // Build conversation history for session-level memory
      const history: AIMessage[] = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }))

      // Prepare real-time context
      const currentContext = aiService.buildDefaultContext(
        {
          name: currentUser?.displayName || DEMO_ELDERLY_PROFILE.name,
          role: 'elderly',
          state: DEMO_ELDERLY_PROFILE.state,
          preferredLanguage: i18n.language,
        },
        DEMO_REMINDERS.map((r) => ({
          id: r.reminderId,
          title: r.title,
          time: r.time,
          status: r.active ? 'pending' : 'confirmed',
          instructions: r.instructions,
        })),

        i18n.language
      )

      // Call AI Service (Gemini Cloud Function if online, smart fallback if offline)
      const aiResponse = await aiService.chat(userText, history, currentContext)

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOffline: aiResponse.isOfflineFallback,
      }

      setMessages((prev) => [...prev, botMsg])

      // Speak response in selected active language
      speak(aiResponse.text)

      // Handle structured navigation intent (allowlist protected)
      if (aiResponse.intent === 'NAVIGATE' && aiResponse.route) {
        setTimeout(() => {
          navigate(aiResponse.route!)
        }, 1800)
      }
    } catch (err) {
      console.error('Error handling AI response:', err)
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: t('voice.fallbackMsg', { defaultValue: 'I heard you! Today is a bright day. Remember to take your scheduled medicines and drink a glass of warm water.' }),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOffline: true,
      }
      setMessages((prev) => [...prev, fallbackMsg])
      speak(fallbackMsg.text)
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleListen = () => {
    if (isListening) {
      speechRef.current?.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      setTranscript('')
      speechRef.current?.start({
        onResult: (text: string) => {
          setTranscript(text)
          setIsListening(false)
          handleSpeechResult(text)
        },
        onError: (err: string) => {
          console.warn('Speech recognition error:', err)
          setIsListening(false)
        },
        onEnd: () => {
          setIsListening(false)
        },
      })
    }
  }

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!textInput.trim()) return
    const txt = textInput
    setTextInput('')
    handleSpeechResult(txt)
  }

  const handleQuickAction = (text: string) => {
    handleSpeechResult(text)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/elderly')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> {t('common.back', { defaultValue: 'Back' })}
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-amber-500" />
            {t('voice.title', { defaultValue: 'Talk to Cogniva' })}
          </h1>
          <p className="text-slate-600 text-sm">
            {t('voice.subtitle', { defaultValue: 'Your AI voice companion for help, reminders, and navigation' })}
          </p>
        </div>
        <div className="w-20" />
      </div>

      {/* Main Microphone Interaction Card */}
      <Card className="p-8 text-center bg-gradient-to-b from-teal-50 to-white border-2 border-teal-200 shadow-md">
        <p className="text-lg font-medium text-slate-700 mb-6">
          {isListening
            ? t('voice.listening', { defaultValue: 'Listening... Speak clearly now' })
            : isProcessing
            ? t('voice.thinking', { defaultValue: 'Cogniva is thinking...' })
            : t('voice.tapPrompt', { defaultValue: 'Tap the big button and talk to me' })}
        </p>

        <div className="flex justify-center my-4">
          <button
            onClick={toggleListen}
            disabled={isProcessing}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-xl ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200'
                : isProcessing
                ? 'bg-amber-400 text-white animate-bounce'
                : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105'
            }`}
            aria-label="Tap to speak with Cogniva"
          >
            {isListening ? (
              <MicOff className="w-16 h-16" />
            ) : (
              <Mic className="w-16 h-16" />
            )}
          </button>
        </div>

        {transcript && (
          <p className="text-teal-800 bg-teal-100/80 p-3 rounded-lg max-w-md mx-auto text-lg font-medium mt-4">
            "{transcript}"
          </p>
        )}
      </Card>

      {/* Quick Action Suggestion Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="h-14 text-base font-semibold border-teal-300 text-teal-800 bg-teal-50 hover:bg-teal-100 flex items-center justify-center gap-2"
          onClick={() => handleQuickAction('What time is it and what should I do now?')}
        >
          <Clock className="w-5 h-5 text-teal-600" />
          {t('voice.quickTime', { defaultValue: 'What time is it?' })}
        </Button>
        <Button
          variant="outline"
          className="h-14 text-base font-semibold border-teal-300 text-teal-800 bg-teal-50 hover:bg-teal-100 flex items-center justify-center gap-2"
          onClick={() => handleQuickAction('Open my reminders and medicine schedule')}
        >
          <RotateCcw className="w-5 h-5 text-teal-600" />
          {t('voice.quickReminders', { defaultValue: 'Open Reminders' })}
        </Button>
        <Button
          variant="outline"
          className="h-14 text-base font-semibold border-teal-300 text-teal-800 bg-teal-50 hover:bg-teal-100 flex items-center justify-center gap-2"
          onClick={() => handleQuickAction('Open my cognitive games')}
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          {t('voice.quickGames', { defaultValue: 'Play Games' })}
        </Button>
      </div>

      {/* Conversation Log Card */}
      <Card className="p-4 border-slate-200 bg-white shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800 text-lg border-b pb-2 flex items-center gap-2">
          <Bot className="w-5 h-5 text-teal-600" />
          {t('voice.historyTitle', { defaultValue: 'Conversation History' })}
        </h2>

        <div className="space-y-4 max-h-96 overflow-y-auto p-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 font-bold ${
                  msg.sender === 'user' ? 'bg-amber-500' : 'bg-teal-600'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-lg ${
                  msg.sender === 'user'
                    ? 'bg-amber-50 text-slate-800 rounded-tr-none border border-amber-200'
                    : 'bg-teal-50 text-slate-800 rounded-tl-none border border-teal-200'
                }`}
              >
                <div className="flex justify-between items-baseline gap-4 mb-1">
                  <span className="font-semibold text-xs text-slate-500 flex items-center gap-1">
                    {msg.sender === 'user' ? t('common.you', { defaultValue: 'You' }) : 'Cogniva AI'}
                    {msg.isOffline && (
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3 text-slate-500" /> Offline Mode
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-slate-400">{msg.timestamp}</span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>

                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => speak(msg.text)}
                    className="mt-2 text-teal-700 hover:text-teal-900 text-sm font-semibold flex items-center gap-1 bg-teal-100/60 px-2 py-1 rounded"
                  >
                    <Volume2 className="w-4 h-4" /> {t('voice.listenAgain', { defaultValue: 'Listen again' })}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-100 text-slate-500 p-3 rounded-2xl text-sm italic animate-pulse">
                {t('voice.typing', { defaultValue: 'Cogniva is thinking...' })}
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Text Input Fallback */}
        <form onSubmit={handleSendText} className="flex gap-2 pt-2 border-t">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t('voice.inputPlaceholder', { defaultValue: 'Or type a message here...' })}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-base"
          />
          <Button type="submit" size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-6">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </Card>
    </div>
  )
}
