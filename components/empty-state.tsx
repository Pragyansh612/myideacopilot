"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  illustration?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  illustration,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className="glass-strong max-w-md w-full text-center">
        <CardContent className="p-8 space-y-6">
          {/* Illustration */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto glass rounded-full flex items-center justify-center text-4xl glow-primary">
              {illustration || "💭"}
            </div>
            <Icon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary/20" />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>

          {/* Action */}
          {(actionLabel && actionHref) || onAction ? (
            <div className="pt-2">
              {actionHref ? (
                <Button asChild className="gradient-primary hover:glow-primary">
                  <Link href={actionHref}>{actionLabel}</Link>
                </Button>
              ) : (
                <Button onClick={onAction} className="gradient-primary hover:glow-primary">
                  {actionLabel}
                </Button>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
