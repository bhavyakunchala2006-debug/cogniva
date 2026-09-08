// ============================================================
// App.tsx — Main routing + providers
// ============================================================

import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { OfflineProvider } from '@/contexts/OfflineContext'
import { PageLoader } from '@/components/common/LoadingSpinner'
import type { UserRole } from '@/types/user.types'

// ── Lazy page imports ────────────────────────────────────────
// Auth
import { SplashPage }        from '@/pages/auth/SplashPage'
import { LoginPage }         from '@/pages/auth/LoginPage'
import { RegisterPage }      from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'

// Elderly
import { ElderlyLayout }     from '@/components/elderly/ElderlyLayout'
import { ElderlyDashboard }  from '@/pages/elderly/ElderlyDashboard'
import { GamesPage }         from '@/pages/elderly/GamesPage'

// Caregiver
import { CaregiverLayout }   from '@/components/caregiver/CaregiverLayout'
import { CaregiverDashboard } from '@/pages/caregiver/CaregiverDashboard'
import { PatientsPage, PatientDetailPage } from '@/pages/caregiver/PatientsPage'
import { AlertsPage }        from '@/pages/caregiver/AlertsPage'
import { ReportsPage }       from '@/pages/caregiver/ReportsPage'

// Health Worker
import { HealthWorkerLayout }   from '@/components/healthWorker/HealthWorkerLayout'
import { HealthWorkerDashboard, HWPatientsPage } from '@/pages/healthWorker/HealthWorkerDashboard'

// Lazy-loaded game pages
const MemoryMatchGame        = lazy(() => import('@/features/cognitiveGames/MemoryMatch/MemoryMatchGame').then(m => ({ default: m.MemoryMatchGame })))
const RememberObjectsGame    = lazy(() => import('@/features/cognitiveGames/RememberObjects/RememberObjectsGame').then(m => ({ default: m.RememberObjectsGame })).catch(() => ({ default: () => <div className="p-8 text-center text-muted-foreground">Loading game...</div> })))
const AttentionGame          = lazy(() => import('@/features/cognitiveGames/AttentionGame/AttentionGame').then(m => ({ default: m.AttentionGame })).catch(() => ({ default: () => <div className="p-8 text-center text-muted-foreground">Loading game...</div> })))
const SequenceMemoryGame     = lazy(() => import('@/features/cognitiveGames/SequenceMemory/SequenceMemoryGame').then(m => ({ default: m.SequenceMemoryGame })).catch(() => ({ default: () => <div className="p-8 text-center text-muted-foreground">Loading game...</div> })))
const OrientationGame        = lazy(() => import('@/features/cognitiveGames/OrientationGame/OrientationGame').then(m => ({ default: m.OrientationGame })).catch(() => ({ default: () => <div className="p-8 text-center text-muted-foreground">Loading game...</div> })))
const LanguageGame           = lazy(() => import('@/features/cognitiveGames/LanguageGame/LanguageGame').then(m => ({ default: m.LanguageGame })).catch(() => ({ default: () => <div className="p-8 text-center text-muted-foreground">Loading game...</div> })))
const FocusExercise          = lazy(() => import('@/features/computerVision/FocusExercise').then(m => ({ default: m.FocusExercise })).catch(() => ({ default: () => <div className="p-8 text-center text-muted-foreground">Loading...</div> })))
const RemindersPage          = lazy(() => import('@/pages/elderly/RemindersPage').then(m => ({ default: m.RemindersPage })).catch(() => ({ default: () => <div className="p-8 text-center text-muted-foreground">Loading...</div> })))
const VoicePage              = lazy(() => import('@/pages/elderly/VoicePage').then(m => ({ default: m.VoicePage })).catch(() => ({ default: () => <div className="p-8 text-center text-muted-foreground">Loading...</div> })))
const ProfilePage            = lazy(() => import('@/pages/elderly/ProfilePage').then(m => ({ default: m.ProfilePage })).catch(() => ({ default: () => <div className="p-8 text-center text-muted-foreground">Loading...</div> })))

// ── Route guard ──────────────────────────────────────────────
interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole: UserRole
}

function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth()
  if (loading) return <PageLoader message="Checking your session..." />
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== allowedRole) {
    // Redirect to correct dashboard
    const roleRoutes: Record<UserRole, string> = {
      elderly: '/elderly',
      caregiver: '/caregiver',
      healthWorker: '/health-worker',
      admin: '/caregiver',
    }
    return <Navigate to={roleRoutes[currentUser.role] || '/login'} replace />
  }
  return <>{children}</>
}

// ── Game Router — dispatches by gameType param ────────────────
function GameRouter() {
  const { gameType } = useParams<{ gameType: string }>()

  const GAME_MAP: Record<string, React.ComponentType> = {
    memoryMatch:      () => <MemoryMatchGame />,
    rememberObjects:  () => <Suspense fallback={<PageLoader message="Loading game..." />}><RememberObjectsGame /></Suspense>,
    attentionGame:    () => <Suspense fallback={<PageLoader message="Loading game..." />}><AttentionGame /></Suspense>,
    sequenceMemory:   () => <Suspense fallback={<PageLoader message="Loading game..." />}><SequenceMemoryGame /></Suspense>,
    orientationGame:  () => <Suspense fallback={<PageLoader message="Loading game..." />}><OrientationGame /></Suspense>,
    languageGame:     () => <Suspense fallback={<PageLoader message="Loading game..." />}><LanguageGame /></Suspense>,
    focusExercise:    () => <Suspense fallback={<PageLoader message="Loading exercise..." />}><FocusExercise /></Suspense>,
  }

  const Component = gameType ? GAME_MAP[gameType] : null
  if (!Component) return (
    <div className="px-4 py-8 text-center">
      <p className="text-2xl mb-4">🎮</p>
      <p className="text-muted-foreground text-lg">Game not found. Please select from the games list.</p>
    </div>
  )
  return <Component />
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Splash */}
              <Route path="/" element={<SplashPage />} />

              {/* Auth */}
              <Route path="/login"          element={<LoginPage />} />
              <Route path="/register"       element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Elderly */}
              <Route path="/elderly" element={
                <ProtectedRoute allowedRole="elderly">
                  <ElderlyLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ElderlyDashboard />} />
                <Route path="games" element={<GamesPage />} />
                <Route path="games/:gameType" element={<GameRouter />} />
                <Route path="reminders" element={
                  <Suspense fallback={<PageLoader />}><RemindersPage /></Suspense>
                } />
                <Route path="voice" element={
                  <Suspense fallback={<PageLoader />}><VoicePage /></Suspense>
                } />
                <Route path="profile" element={
                  <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>
                } />
              </Route>

              {/* Caregiver */}
              <Route path="/caregiver" element={
                <ProtectedRoute allowedRole="caregiver">
                  <CaregiverLayout />
                </ProtectedRoute>
              }>
                <Route index   element={<CaregiverDashboard />} />
                <Route path="patients" element={<PatientsPage />} />
                <Route path="patients/:profileId" element={<PatientDetailPage />} />
                <Route path="alerts"   element={<AlertsPage />} />
                <Route path="reports"  element={<ReportsPage />} />
              </Route>

              {/* Health Worker */}
              <Route path="/health-worker" element={
                <ProtectedRoute allowedRole="healthWorker">
                  <HealthWorkerLayout />
                </ProtectedRoute>
              }>
                <Route index           element={<HealthWorkerDashboard />} />
                <Route path="patients" element={<HWPatientsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </OfflineProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
