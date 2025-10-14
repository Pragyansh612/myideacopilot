"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Zap, CheckCircle2 } from "lucide-react"
import type { Idea, Feature } from "@/lib/api/idea"

interface IdeaDetailOverviewProps {
  idea: Idea
  features: Feature[]
}

export function IdeaDetailOverview({ idea, features }: IdeaDetailOverviewProps) {
  const totalFeatures = features.length
  const completedFeatures = features.filter(f => f.is_completed).length
  const progress = totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Description */}
      {idea.description && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">About this idea</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {idea.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">{progress.toFixed(0)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <p className="text-2xl font-bold capitalize">{idea.priority}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{idea.overall_score?.toFixed(1) || "N/A"}</p>
              </div>
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold capitalize">{idea.status?.replace('_', ' ') || 'N/A'}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {idea.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}