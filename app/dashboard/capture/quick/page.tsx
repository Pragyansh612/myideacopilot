"use client"

import { useState, useRef, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Expand, Zap, Clock, ArrowLeft, Sparkles, Command, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function QuickCapturePage() {
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Auto-focus title field on mount
  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        handleSave()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault()
        handleExpand()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [title, note])

  const handleSave = async () => {
    if (!title.trim()) {
      titleRef.current?.focus()
      return
    }

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsSaving(false)
    setShowSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setTitle("")
      setNote("")
      setShowSuccess(false)
      titleRef.current?.focus()
    }, 1500)
  }

  const handleExpand = () => {
    // Store current data in sessionStorage for the full editor
    if (title || note) {
      sessionStorage.setItem("quickCaptureData", JSON.stringify({ title, note }))
    }
    router.push("/ideas/new")
  }

  const suggestedTags = ["idea", "quick-thought", "inspiration", "todo", "project"]

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/capture">
            <Button variant="ghost" size="sm" className="glass-button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <PageHeader title="Quick Capture" description="Jot down your idea instantly" />
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <Card className="glass-card border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-center gap-3 text-green-400">
              <div className="p-2 rounded-full bg-green-500/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-medium">Idea saved successfully!</span>
            </div>
          </Card>
        )}

        {/* Quick Capture Form */}
        <Card className="glass-card border-white/10 p-8">
          <div className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">What's your idea?</label>
              <Input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your idea title..."
                className="glass-input text-lg h-12 border-white/10 focus:border-blue-400/50 focus:ring-blue-400/20"
                disabled={isSaving}
              />
            </div>

            {/* Note Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Quick notes (optional)</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any quick thoughts or details..."
                className="glass-input min-h-[120px] border-white/10 focus:border-blue-400/50 focus:ring-blue-400/20 resize-none"
                disabled={isSaving}
              />
            </div>

            {/* Suggested Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Quick tags</label>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="glass-badge cursor-pointer hover:bg-blue-500/20 hover:border-blue-400/30 transition-colors"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={!title.trim() || isSaving}
                className="glass-button bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0 flex-1 h-12"
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
                onClick={handleExpand}
                variant="outline"
                className="glass-button border-white/20 hover:border-blue-400/50 flex-1 h-12 bg-transparent"
                disabled={isSaving}
              >
                <Expand className="h-4 w-4 mr-2" />
                Expand to Full Editor
              </Button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground border-t border-white/10">
              <div className="flex items-center gap-1">
                <Command className="h-3 w-3" />
                <span>+ Enter to save</span>
              </div>
              <div className="flex items-center gap-1">
                <Command className="h-3 w-3" />
                <span>+ E to expand</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Today", value: "3", icon: Clock },
            { label: "This Week", value: "12", icon: Zap },
            { label: "Total", value: "247", icon: Sparkles },
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
    </AppLayout>
  )
}
