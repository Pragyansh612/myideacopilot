"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Package, X, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { AutoDetectionAPI } from "@/lib/api/idea"

export function AutoDetectionBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Check if user has dismissed the banner before
  useEffect(() => {
    const dismissed = localStorage.getItem('auto-detection-banner-dismissed')
    if (dismissed === 'true') {
      setIsDismissed(true)
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('auto-detection-banner-dismissed', 'true')
    setIsVisible(false)
    setIsDismissed(true)
  }

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true)
      await AutoDetectionAPI.analyzeAllIdeas()
      // Redirect to build plan page
      window.location.href = '/dashboard/build-plan'
    } catch (err) {
      console.error('Analysis failed:', err)
      setIsAnalyzing(false)
    }
  }

  if (!isVisible || isDismissed) return null

  return (
    <Card className="glass border-primary/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
      
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 flex-1">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
              <Package className="w-6 h-6 text-primary relative z-10" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-base mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Optimize Your Build Strategy with AI
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Let AI analyze your ideas to discover reusable components and create an optimized build plan. 
                  Build common components once and reuse them across multiple projects to save time and effort.
                </p>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  <span>Identify common patterns</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Package className="w-3.5 h-3.5 text-primary" />
                  <span>Build reusable components</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>AI-powered insights</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button 
                  size="sm" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="gradient-primary hover:glow-primary transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Analyze Now
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  asChild
                  className="hover:border-primary/50 transition-all duration-300"
                >
                  <Link href="/dashboard/build-plan">
                    View Build Plan
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Dismiss button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="flex-shrink-0 hover:bg-background/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}