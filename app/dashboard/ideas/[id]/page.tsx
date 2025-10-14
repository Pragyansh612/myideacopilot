"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { IdeaAPI, type IdeaDetail } from "@/lib/api/idea"
import { IdeaDetailHeader } from "@/components/idea-detail/idea-detail-header"
import { IdeaDetailOverview } from "@/components/idea-detail/idea-detail-overview"
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
      <div className="p-6">
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

      <div className="p-4 md:p-6 space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <IdeaDetailOverview idea={ideaDetail.idea} features={ideaDetail.features} />

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