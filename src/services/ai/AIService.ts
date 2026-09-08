// ============================================================
// AI Service — Secure Gemini integration via Firebase Functions
// In demo mode: uses predefined responses
// ============================================================

// Predefined fallback responses (offline / demo mode)
const FALLBACK_RESPONSES: Record<string, string> = {
  greeting: "Hello! I'm Cogniva, your memory helper. I'm here to support you today. How are you feeling?",
  instructions: "No problem! Let me explain it again. Look at the cards carefully, then try to remember where each picture is. Take your time!",
  encouragement: "You're doing wonderfully! Every small step counts. I'm proud of you for trying.",
  help: "I'm here to help you. You can ask me to repeat instructions, tell you about your reminders, or just chat. What do you need?",
  reminder: "It's time for your activity. Remember, these exercises help keep your mind active and strong!",
  confused: "That's perfectly fine! Let's go slowly. I'll explain everything step by step. There's no rush.",
  default: "I understand. I'm here to help you. Is there anything specific you'd like to know or do?",
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

// Detect intent from user message
function detectIntent(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('understand') || lower.includes('explain') || lower.includes('how')) return 'instructions'
  if (lower.includes('help') || lower.includes('assist') || lower.includes('support')) return 'help'
  if (lower.includes('remind') || lower.includes('medicine') || lower.includes('water')) return 'reminder'
  if (lower.includes('confus') || lower.includes("don't know") || lower.includes('what')) return 'confused'
  if (lower.includes('good') || lower.includes('hello') || lower.includes('hi') || lower.includes('morning')) return 'greeting'
  return 'default'
}

class AIService {
  private isOnline(): boolean {
    return navigator.onLine
  }

  // Main chat method
  async chat(message: string, _history: AIMessage[] = []): Promise<string> {
    // Try Gemini via Firebase Functions if online
    if (this.isOnline() && import.meta.env.VITE_FUNCTIONS_URL) {
      try {
        const response = await fetch(`${import.meta.env.VITE_FUNCTIONS_URL}/geminiChat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history: _history }),
        })
        if (response.ok) {
          const data = await response.json()
          return data.response
        }
      } catch {
        // Fall through to local fallback
      }
    }

    // Offline / demo fallback
    await new Promise((r) => setTimeout(r, 600)) // simulate processing
    const intent = detectIntent(message)
    return FALLBACK_RESPONSES[intent] || FALLBACK_RESPONSES.default
  }

  // Generate a cognitive insight
  async generateInsight(data: {
    gameType: string
    weeklyAccuracies: number[]
    trend: 'improving' | 'stable' | 'declining'
  }): Promise<string> {
    const { gameType, weeklyAccuracies, trend } = data
    
    // Deterministic insight (no cloud needed)
    const gameLabel = gameType === 'memoryMatch' ? 'Memory' : 
                      gameType === 'attentionGame' ? 'Attention' : 'Recognition'
    
    if (weeklyAccuracies.length < 2) {
      return `${gameLabel} activity data is being collected. Keep playing to see your progress!`
    }

    const first = weeklyAccuracies[0]
    const last = weeklyAccuracies[weeklyAccuracies.length - 1]
    const change = last - first

    if (trend === 'improving' && change > 10) {
      return `${gameLabel} activity performance has improved from ${first}% to ${last}% over the last ${weeklyAccuracies.length} weeks. Excellent cognitive engagement!`
    } else if (trend === 'improving') {
      return `${gameLabel} activity shows steady improvement. Performance has increased from ${first}% to ${last}%.`
    } else if (trend === 'stable') {
      return `${gameLabel} activity performance is stable at around ${last}%. Consistent practice helps maintain cognitive engagement.`
    } else {
      return `${gameLabel} activity performance has decreased slightly. Consider shorter sessions or easier difficulty. Contact your caregiver if you have concerns.`
    }
  }

  // Personalize game content suggestion
  async getPersonalizedSuggestion(interests: string[], state: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 300))
    const interest = interests[Math.floor(Math.random() * interests.length)] || 'nature'
    const stateContent = state === 'Assam' ? 'Assamese' : state === 'Manipur' ? 'Manipuri' : 'Northeast Indian'
    return `Today's activities include ${stateContent} cultural content about ${interest}. Have fun!`
  }
}

export const aiService = new AIService()
