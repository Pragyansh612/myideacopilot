"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { IdeaAPI, type IdeaDetail } from "@/lib/api/idea"
import { IdeaDetailHeader } from "@/components/idea-detail/idea-detail-header"
import { IdeaDetailTabs } from "@/components/idea-detail/idea-detail-tabs"
import { IdeaDetailSkeleton } from "@/components/idea-detail/idea-detail-skeleton"

export default function IdeaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ideaId = params.id as string

  const [ideaDetail, setIdeaDetail] = useState<IdeaDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadIdeaDetail()
  }, [ideaId])

  const loadIdeaDetail = async () => {
    try {
      setIsLoading(true)
      const result = await IdeaAPI.getIdea(ideaId)

      const detail: IdeaDetail = {
        idea: result.idea.idea,
        phases: result.idea.phases || [],
        features: result.idea.features || []
      }

      setIdeaDetail(detail)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load idea")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await IdeaAPI.deleteIdea(ideaId)
      router.push("/dashboard/ideas")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete idea")
    }
  }

  if (isLoading) {
    return <IdeaDetailSkeleton />
  }

  if (error && !ideaDetail) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (!ideaDetail) return null

  return (
    <>
      <IdeaDetailHeader
        idea={ideaDetail.idea}
        onUpdate={loadIdeaDetail}
        onDelete={handleDelete}
        onError={setError}
      />

      <div className="border-b border-border/50">
        <div className="p-4 md:p-6">
          <IdeaOverviewCompact idea={ideaDetail.idea} features={ideaDetail.features} />
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <IdeaDetailTabs
          ideaId={ideaId}
          ideaDetail={ideaDetail}
          onUpdate={loadIdeaDetail}
          onError={setError}
        />
      </div>
    </>
  )
}

// Compact overview component
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { Idea, Feature } from "@/lib/api/idea"

interface IdeaOverviewCompactProps {
  idea: Idea
  features: Feature[]
}

function IdeaOverviewCompact({ idea, features }: IdeaOverviewCompactProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const completedFeatures = features.filter(f => f.is_completed).length
  const progressPercentage = features.length === 0 ? 0 : Math.round((completedFeatures / features.length) * 100)
  const shouldTruncate = idea.description && idea.description.length > 300

  return (
    <div className="space-y-4">
      {/* Description */}
      <div>
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
          About this idea
        </h3>
        <p className={`text-sm leading-relaxed text-foreground ${!isExpanded && shouldTruncate ? 'line-clamp-4' : ''}`}>
          {idea.description || "No description provided"}
        </p>
        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary h-auto p-0 mt-2 font-medium"
          >
            {isExpanded ? "Read less" : "Read more"}
          </Button>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {/* Progress */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Progress</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Priority</p>
          <Badge
            variant={idea.priority === 'high' ? 'default' : idea.priority === 'medium' ? 'secondary' : 'outline'}
            className="text-xs w-fit capitalize"
          >
            {idea.priority}
          </Badge>
        </div>

        {/* Score */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Score</p>
          <p className="text-sm font-bold">{idea.overall_score?.toFixed(1) || '—'}</p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Status</p>
          <Badge variant="outline" className="text-xs w-fit capitalize font-medium">
            {idea.status}
          </Badge>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Features</p>
          <p className="text-sm font-bold">{completedFeatures}/{features.length}</p>
        </div>

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Tags</p>
            <div className="flex gap-1 flex-wrap">
              {idea.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium">
                  {tag}
                </Badge>
              ))}
              {idea.tags.length > 2 && (
                <Badge variant="outline" className="text-xs font-medium">
                  +{idea.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}