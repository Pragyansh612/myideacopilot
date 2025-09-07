import { AchievementBadge } from "@/components/achievement-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Lightbulb, Target, Zap, Crown, Sparkles, Award } from "lucide-react"

const achievements = [
  {
    id: "first-idea",
    icon: Lightbulb,
    title: "First Spark",
    description: "Created your first idea",
    isUnlocked: true,
    rarity: "common" as const,
  },
  {
    id: "idea-collector",
    icon: Target,
    title: "Idea Collector",
    description: "Capture 10 ideas",
    isUnlocked: false,
    progress: 7,
    maxProgress: 10,
    rarity: "rare" as const,
  },
  {
    id: "creative-streak",
    icon: Zap,
    title: "Creative Streak",
    description: "Create ideas for 7 consecutive days",
    isUnlocked: false,
    progress: 3,
    maxProgress: 7,
    rarity: "epic" as const,
  },
  {
    id: "ai-collaborator",
    icon: Sparkles,
    title: "AI Collaborator",
    description: "Have 5 conversations with AI Copilot",
    isUnlocked: false,
    progress: 2,
    maxProgress: 5,
    rarity: "rare" as const,
  },
  {
    id: "category-master",
    icon: Crown,
    title: "Category Master",
    description: "Create ideas in 5 different categories",
    isUnlocked: false,
    progress: 3,
    maxProgress: 5,
    rarity: "epic" as const,
  },
  {
    id: "innovation-legend",
    icon: Award,
    title: "Innovation Legend",
    description: "Reach 100 total ideas",
    isUnlocked: false,
    progress: 24,
    maxProgress: 100,
    rarity: "legendary" as const,
  },
]

interface AchievementsSectionProps {
  showAll?: boolean
}

export function AchievementsSection({ showAll = false }: AchievementsSectionProps) {
  const displayedAchievements = showAll ? achievements : achievements.slice(0, 3)
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length
  const totalCount = achievements.length

  return (
    <Card className="glass">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Trophy className="w-4 h-4 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Achievements</CardTitle>
              <p className="text-sm text-muted-foreground">
                {unlockedCount}/{totalCount} unlocked
              </p>
            </div>
          </div>

          {!showAll && (
            <Button variant="ghost" size="sm" className="text-xs">
              View All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-3">
          {displayedAchievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              isUnlocked={achievement.isUnlocked}
              progress={achievement.progress}
              maxProgress={achievement.maxProgress}
              rarity={achievement.rarity}
            />
          ))}
        </div>

        {!showAll && achievements.length > 3 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              {achievements.length - 3} more achievements to discover
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
