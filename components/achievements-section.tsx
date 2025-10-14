"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Lock } from "lucide-react"
import { AchievementAPI, AchievementResponse } from "@/lib/api/achievement"

export function AchievementsSection() {
  const [achievements, setAchievements] = useState<AchievementResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      const data = await AchievementAPI.getUserAchievements()
      console.log('Achievements data:', data) // Debug log
      setAchievements(data.slice(0, 3)) // Show only first 3
    } catch (err) {
      console.error('Error fetching achievements:', err)
      setError(err instanceof Error ? err.message : 'Failed to load achievements')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="glass h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
              <Skeleton className="w-8 h-8 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (achievements.length === 0) {
    return (
      <Card className="glass h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <Lock className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Start creating ideas to unlock achievements!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
          >
            <div className="text-2xl flex-shrink-0">{achievement.icon || '🏆'}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">
                {achievement.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {achievement.description}
              </p>
              <Badge variant="secondary" className="mt-2 text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
                +{achievement.xp_awarded} XP
              </Badge>
            </div>
          </div>
        ))}
        
        <div className="pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            {achievements.length === 1 ? '1 achievement unlocked!' : `${achievements.length} achievements unlocked!`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Keep going to unlock more! 🎯
          </p>
        </div>
      </CardContent>
    </Card>
  )
}