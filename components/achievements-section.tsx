"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock, Loader2 } from "lucide-react"
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
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
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
          <p className="text-sm text-muted-foreground">{error}</p>
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
            className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
          >
            <div className="text-2xl">{achievement.definition?.icon || '🏆'}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">
                {achievement.definition?.name || achievement.achievement_code}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {achievement.definition?.description || 'Achievement unlocked!'}
              </p>
              <Badge variant="secondary" className="mt-2 text-xs">
                +{achievement.definition?.xp_reward || 0} XP
              </Badge>
            </div>
          </div>
        ))}
        
        {achievements.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-center text-muted-foreground">
              Keep going to unlock more! 🎯
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}