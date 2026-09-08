// ============================================================
// Game Selection Page
// ============================================================

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { ChevronRight, Brain, Eye, List, Zap, Image, MessageSquare, Compass, Camera } from 'lucide-react'

interface GameEntry {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  duration: string
  difficulty: string
}

const GAMES: GameEntry[] = [
  {
    id: 'memoryMatch',
    name: 'Memory Match',
    description: 'Match pairs of cards from your memory',
    icon: <Brain className="w-8 h-8" />,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    duration: '5 min',
    difficulty: 'Medium',
  },
  {
    id: 'rememberObjects',
    name: 'Remember Objects',
    description: 'Remember familiar objects then recall them',
    icon: <Eye className="w-8 h-8" />,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    duration: '4 min',
    difficulty: 'Easy',
  },
  {
    id: 'sequenceMemory',
    name: 'Sequence Memory',
    description: 'Repeat the sequence shown to you',
    icon: <List className="w-8 h-8" />,
    color: 'text-accent-600',
    bgColor: 'bg-accent/15',
    duration: '5 min',
    difficulty: 'Medium',
  },
  {
    id: 'attentionGame',
    name: 'Attention Game',
    description: 'Find the target among many objects',
    icon: <Zap className="w-8 h-8" />,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    duration: '4 min',
    difficulty: 'Medium',
  },
  {
    id: 'orientationGame',
    name: 'Orientation Game',
    description: 'Questions about day, time and place',
    icon: <Compass className="w-8 h-8" />,
    color: 'text-highlight-500',
    bgColor: 'bg-highlight/10',
    duration: '3 min',
    difficulty: 'Easy',
  },
  {
    id: 'languageGame',
    name: 'Language Game',
    description: 'Name the object shown to you',
    icon: <MessageSquare className="w-8 h-8" />,
    color: 'text-accent-600',
    bgColor: 'bg-accent/15',
    duration: '3 min',
    difficulty: 'Easy',
  },
  {
    id: 'focusExercise',
    name: 'Focus & Camera Exercise',
    description: 'Eye tracking and head movement exercise',
    icon: <Camera className="w-8 h-8" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    duration: '3 min',
    difficulty: 'Easy',
  },
]

export function GamesPage() {
  const navigate = useNavigate()

  return (
    <div className="px-4 py-5 max-w-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Brain Games 🧠</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Choose an activity to exercise your mind
        </p>
      </div>

      {/* Today's recommended */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 mb-6 border border-primary/20">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">⭐ Recommended for Today</p>
        <p className="text-foreground font-semibold text-lg">Memory Match — Level 2</p>
        <p className="text-muted-foreground text-sm">Based on your recent performance</p>
      </div>

      {/* Game list */}
      <div className="space-y-3">
        {GAMES.map((game) => (
          <Card
            key={game.id}
            clickable
            padding="md"
            onClick={() => navigate(`/elderly/games/${game.id}`)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${game.bgColor} ${game.color} flex items-center justify-center shrink-0`}>
                {game.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-foreground">{game.name}</h3>
                <p className="text-muted-foreground text-base mt-0.5 line-clamp-1">{game.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-sm text-muted-foreground">⏱ {game.duration}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="badge-info text-xs">{game.difficulty}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      <div className="h-4" />
    </div>
  )
}
