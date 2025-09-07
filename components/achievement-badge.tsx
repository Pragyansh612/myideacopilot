import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementBadgeProps {
  icon: LucideIcon
  title: string
  description: string
  isUnlocked: boolean
  progress?: number
  maxProgress?: number
  rarity?: "common" | "rare" | "epic" | "legendary"
  className?: string
}

export function AchievementBadge({
  icon: Icon,
  title,
  description,
  isUnlocked,
  progress = 0,
  maxProgress = 1,
  rarity = "common",
  className,
}: AchievementBadgeProps) {
  const rarityStyles = {
    common: "border-primary/20 bg-primary/5",
    rare: "border-secondary/20 bg-secondary/5",
    epic: "border-accent/20 bg-accent/5",
    legendary: "border-yellow-500/20 bg-yellow-500/5 glow-accent",
  }

  const iconStyles = {
    common: "text-primary bg-primary/10",
    rare: "text-secondary bg-secondary/10",
    epic: "text-accent bg-accent/10",
    legendary: "text-yellow-500 bg-yellow-500/10",
  }

  const progressPercentage = maxProgress > 1 ? (progress / maxProgress) * 100 : isUnlocked ? 100 : 0

  return (
    <Card className={cn("glass transition-all duration-300 hover:glass-strong", rarityStyles[rarity], className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", iconStyles[rarity])}
          >
            <Icon className={cn("w-5 h-5", isUnlocked ? "" : "opacity-50")} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={cn("font-medium text-sm", isUnlocked ? "" : "text-muted-foreground")}>{title}</h4>
              {rarity !== "common" && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                  {rarity}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-2">{description}</p>

            {maxProgress > 1 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {progress}/{maxProgress}
                  </span>
                  <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-1.5">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      rarity === "common"
                        ? "bg-primary"
                        : rarity === "rare"
                          ? "bg-secondary"
                          : rarity === "epic"
                            ? "bg-accent"
                            : "bg-yellow-500",
                    )}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
