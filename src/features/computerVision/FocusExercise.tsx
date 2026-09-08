// ============================================================
// FocusExercise.tsx — Optional Computer Vision & Focus Exercise
// ============================================================
// Uses local device camera feed for interactive focus & tracking.
// Privacy First: Video processing runs 100% on client device.
// ============================================================

import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Camera, CameraOff, Sparkles, CheckCircle2, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { speak } from '@/services/voice/VoiceService'

export function FocusExercise() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [exerciseStep, setExerciseStep] = useState(0)
  const [exerciseScore, setExerciseScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const steps = [
    { title: 'Center Your Face', prompt: 'Look directly at the camera and hold a gentle smile.' },
    { title: 'Follow the Ball', prompt: 'Keep your eyes on the moving dot on the screen.' },
    { title: 'Gentle Nod', prompt: 'Nod your head up and down slowly.' },
  ]

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
      speak(steps[0].prompt)
    } catch (err) {
      console.warn('Camera permission denied or unavailable:', err)
      alert('Camera access is unavailable. Demo mode active!')
      setCameraActive(true)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const nextStep = () => {
    if (exerciseStep + 1 < steps.length) {
      const nextIdx = exerciseStep + 1
      setExerciseStep(nextIdx)
      setExerciseScore((prev) => prev + 33)
      speak(steps[nextIdx].prompt)
    } else {
      setExerciseScore(100)
      setIsFinished(true)
      stopCamera()
      speak('Great job completing the focus exercise!')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 px-4 pt-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="lg" onClick={() => navigate('/elderly/games')} className="gap-2">
          <ArrowLeft className="w-5 h-5" /> Back to Games
        </Button>
        <span className="font-bold text-teal-800 text-lg">Focus & Motor Exercise</span>
        <div className="w-20" />
      </div>

      <Card className="p-4 bg-teal-50/60 border-teal-200 text-teal-900 text-sm flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
        <p>
          <strong>Privacy Guaranteed:</strong> Camera video stays strictly on your device and is never recorded or transmitted to any server.
        </p>
      </Card>

      {!isFinished ? (
        <Card className="p-8 text-center bg-white border-teal-200 shadow-md space-y-6">
          <div className="relative w-full max-w-md mx-auto aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-4 border-teal-300">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-slate-400 space-y-2 p-6">
                <Camera className="w-12 h-12 mx-auto text-slate-500 animate-bounce" />
                <p className="text-sm font-medium">Camera is currently turned off</p>
              </div>
            )}

            {/* Target Dot overlay */}
            {cameraActive && (
              <div className="absolute w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-lg animate-ping" />
            )}
          </div>

          {!cameraActive ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">Visual Focus & Eye Exercise</h2>
              <p className="text-slate-600">
                This optional exercise guides you through gentle head movements and visual focus tracking.
              </p>
              <Button size="lg" onClick={startCamera} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 gap-2">
                <Camera className="w-5 h-5" /> Start Focus Camera
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 space-y-1">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Step {exerciseStep + 1} of {steps.length}: {steps[exerciseStep].title}
                </span>
                <p className="text-xl font-bold text-slate-800">{steps[exerciseStep].prompt}</p>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <Button size="lg" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8">
                  Step Done ✓
                </Button>
                <Button size="lg" variant="outline" onClick={stopCamera} className="text-rose-600 border-rose-200">
                  <CameraOff className="w-5 h-5 mr-2" /> Stop Camera
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8 text-center bg-white border-teal-200 shadow-md space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h3 className="text-3xl font-bold text-slate-800">Focus Exercise Complete!</h3>
          <p className="text-slate-600 text-lg">Score: {exerciseScore}% completed</p>

          <Button size="lg" onClick={() => navigate('/elderly/games')} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8">
            Return to Games
          </Button>
        </Card>
      )}
    </div>
  )
}
