"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error while loading this content. Please try again.",
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[300px] p-8">
      <Card className="glass-strong max-w-md w-full text-center border-destructive/20">
        <CardContent className="p-8 space-y-6">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto glass rounded-full flex items-center justify-center bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-destructive">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>

          {/* Retry Button */}
          {showRetry && (
            <div className="pt-2">
              <Button
                onClick={onRetry}
                variant="outline"
                className="border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
