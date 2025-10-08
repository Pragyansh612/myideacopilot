"use client"

import { useState, useEffect, useRef } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mic, Square, Save, Trash2, ArrowLeft, Volume2, Clock, Zap, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

type RecordingState = "idle" | "recording" | "processing" | "completed"

export default function VoiceCapturePage() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcribedText, setTranscribedText] = useState("")
  const [title, setTitle] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  // Simulated transcription text that appears gradually
  const fullTranscription =
    "I just had this amazing idea for a mobile app that could help people track their daily habits and goals. It would use AI to provide personalized recommendations and insights based on user behavior patterns. The interface should be clean and minimalist, with beautiful data visualizations that make progress feel rewarding. Maybe we could also add social features where friends can encourage each other and share achievements."

  useEffect(() => {
    if (recordingState === "recording") {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [recordingState])

  // Simulate real-time transcription
  useEffect(() => {
    if (recordingState === "recording" && recordingTime > 2) {
      const wordsPerSecond = 2
      const currentWordCount = Math.min(
        Math.floor((recordingTime - 2) * wordsPerSecond),
        fullTranscription.split(" ").length,
      )
      const currentText = fullTranscription.split(" ").slice(0, currentWordCount).join(" ")
      setTranscribedText(currentText)
    }
  }, [recordingTime, recordingState])

  const handleStartRecording = () => {
    setRecordingState("recording")
    setRecordingTime(0)
    setTranscribedText("")
  }

  const handleStopRecording = () => {
    setRecordingState("processing")

    // Simulate processing time
    setTimeout(() => {
      setRecordingState("completed")
      setTranscribedText(fullTranscription)
      // Auto-generate title from first few words
      const firstWords = fullTranscription.split(" ").slice(0, 6).join(" ")
      setTitle(firstWords + "...")
    }, 2000)
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSaving(false)
    // Reset to idle state
    setRecordingState("idle")
    setRecordingTime(0)
    setTranscribedText("")
    setTitle("")
  }

  const handleDiscard = () => {
    setRecordingState("idle")
    setRecordingTime(0)
    setTranscribedText("")
    setTitle("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getRecordingButtonContent = () => {
    switch (recordingState) {
      case "idle":
        return {
          icon: Mic,
          text: "Start Recording",
          action: handleStartRecording,
          className:
            "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0",
        }
      case "recording":
        return {
          icon: Square,
          text: "Stop Recording",
          action: handleStopRecording,
          className:
            "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0",
        }
      case "processing":
        return {
          icon: Volume2,
          text: "Processing...",
          action: () => {},
          className: "bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0 cursor-not-allowed",
        }
      case "completed":
        return {
          icon: CheckCircle,
          text: "Recording Complete",
          action: () => {},
          className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 cursor-not-allowed",
        }
    }
  }

  const buttonContent = getRecordingButtonContent()
  const IconComponent = buttonContent.icon

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/capture">
            <Button variant="ghost" size="sm" className="glass-button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <PageHeader title="Voice Capture" description="Record your thoughts and ideas" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recording Interface */}
          <div className="space-y-6">
            {/* Main Recording Button */}
            <Card className="glass-card border-white/10 p-12 text-center">
              <div className="space-y-6">
                {/* Recording Button */}
                <div className="relative">
                  <Button
                    onClick={buttonContent.action}
                    disabled={recordingState === "processing"}
                    className={`w-32 h-32 rounded-full text-lg font-medium transition-all duration-300 ${buttonContent.className} ${
                      recordingState === "recording" ? "animate-pulse" : ""
                    }`}
                  >
                    <IconComponent className="h-12 w-12" />
                  </Button>

                  {/* Recording Animation Ring */}
                  {recordingState === "recording" && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-400/30 animate-ping" />
                  )}
                </div>

                {/* Status Text */}
                <div className="space-y-2">
                  <p className="text-lg font-medium">{buttonContent.text}</p>
                  {recordingState === "recording" && (
                    <div className="flex items-center justify-center gap-2 text-red-400">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
                    </div>
                  )}
                  {recordingState === "processing" && (
                    <div className="flex items-center justify-center gap-2 text-blue-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400/30 border-t-blue-400" />
                      <span className="text-sm">Converting speech to text...</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Recording Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Duration", value: formatTime(recordingTime), icon: Clock },
                { label: "Quality", value: recordingState === "recording" ? "Good" : "—", icon: Volume2 },
                {
                  label: "Words",
                  value: transcribedText
                    .split(" ")
                    .filter((w) => w)
                    .length.toString(),
                  icon: Zap,
                },
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <Card key={index} className="glass-card border-white/10 p-4 text-center">
                    <IconComponent className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-blue-400">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Transcription Area */}
          <div className="space-y-6">
            {/* Live Transcription */}
            <Card className="glass-card border-white/10 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Live Transcription</h3>
                  {recordingState === "recording" && (
                    <Badge variant="secondary" className="glass-badge bg-red-500/20 text-red-400 border-red-400/30">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2" />
                      Recording
                    </Badge>
                  )}
                  {recordingState === "completed" && (
                    <Badge
                      variant="secondary"
                      className="glass-badge bg-green-500/20 text-green-400 border-green-400/30"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>

                <div className="min-h-[200px] p-4 rounded-lg bg-black/20 border border-white/10">
                  {transcribedText ? (
                    <p className="text-sm leading-relaxed">
                      {transcribedText}
                      {recordingState === "recording" && (
                        <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse" />
                      )}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">
                      {recordingState === "idle"
                        ? "Start recording to see your speech transcribed in real-time..."
                        : recordingState === "processing"
                          ? "Processing your recording..."
                          : "Your transcribed text will appear here..."}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Title and Actions */}
            {recordingState === "completed" && (
              <Card className="glass-card border-white/10 p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Idea Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a title for your idea..."
                      className="glass-input border-white/10 focus:border-blue-400/50 focus:ring-blue-400/20"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      disabled={!title.trim() || isSaving}
                      className="glass-button bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0 flex-1"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Idea
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleDiscard}
                      variant="outline"
                      className="glass-button border-white/20 hover:border-red-400/50 hover:text-red-400 bg-transparent"
                      disabled={isSaving}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Discard
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Tips */}
        <Card className="glass-card border-white/10 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-400">Recording Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Speak clearly and at a normal pace for best transcription accuracy</li>
                <li>• Find a quiet environment to minimize background noise</li>
                <li>• You can edit the transcribed text before saving your idea</li>
                <li>• Recordings are processed locally and not stored on our servers</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
