"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network, Sparkles } from "lucide-react"
import { PhasesTab } from "./phases-tab"
import { RelatedIdeasTab } from "./related-ideas-tab"
import { AISuggestionsTab } from "./ai-suggestions-tab"
import { CompetitorTab } from "./competitor-tab"
import { DetailsTab } from "./details-tab"
import {
  AIAPI, RelatedIdeaAPI, IdeaAPI, CompetitorAPI,
  type IdeaDetail, type AISuggestion, type RelatedIdeaWithDetails,
  type RecommendationItem, type Idea
} from "@/lib/api/idea"

interface IdeaDetailTabsProps {
  ideaId: string
  ideaDetail: IdeaDetail
  onUpdate: () => void
  onError: (error: string) => void
}

export function IdeaDetailTabs({ ideaId, ideaDetail, onUpdate, onError }: IdeaDetailTabsProps) {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [relatedIdeas, setRelatedIdeas] = useState<RelatedIdeaWithDetails[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [allIdeas, setAllIdeas] = useState<Idea[]>([])
  const [competitorData, setCompetitorData] = useState<any>(null)

  useEffect(() => {
    loadAllData()
  }, [ideaId])

  const loadAllData = async () => {
    await Promise.all([
      loadAISuggestions(),
      loadRelatedIdeas(),
      loadAllIdeas(),
      loadCompetitorData()
    ])
  }

  const loadAISuggestions = async () => {
    try {
      const suggestions = await AIAPI.getSuggestions(ideaId)
      setAiSuggestions(suggestions)
    } catch (err) {
      // Silent fail
    }
  }

  const loadRelatedIdeas = async () => {
    try {
      const related = await RelatedIdeaAPI.getRelatedIdeas(ideaId)
      setRelatedIdeas(related)
    } catch (err) {
      // Silent fail
    }
  }

  const loadAllIdeas = async () => {
    try {
      const result = await IdeaAPI.getIdeas({ limit: 100 })
      setAllIdeas(result.ideas.filter(idea => idea.id !== ideaId))
    } catch (err) {
      // Silent fail
    }
  }

  const loadCompetitorData = async () => {
    try {
      const competitors = await CompetitorAPI.getCompetitorResearch(ideaId)
      setCompetitorData(competitors)
    } catch (err) {
      // Silent fail
    }
  }

  const loadRecommendations = async () => {
    try {
      setIsLoadingRecommendations(true)
      const result = await RelatedIdeaAPI.getRecommendations(ideaId, 10, false)
      setRecommendations(result.recommendations)
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to load recommendations")
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const handleUpdate = () => {
    onUpdate()
    loadAllData()
  }

  return (
    <Tabs defaultValue="phases" className="space-y-6">
      <TabsList className="glass">
        <TabsTrigger value="phases">Phases & Features</TabsTrigger>
        <TabsTrigger value="related">
          <Network className="w-4 h-4 mr-2" />
          Related Ideas
        </TabsTrigger>
        <TabsTrigger value="ai">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Suggestions
        </TabsTrigger>
        <TabsTrigger value="competitors">Competitor Research</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <TabsContent value="phases">
        <PhasesTab
          ideaId={ideaId}
          phases={ideaDetail.phases}
          features={ideaDetail.features}
          onUpdate={handleUpdate}
          onError={onError}
        />
      </TabsContent>

      <TabsContent value="related">
        <RelatedIdeasTab
          ideaId={ideaId}
          relatedIdeas={relatedIdeas}
          recommendations={recommendations}
          isLoadingRecommendations={isLoadingRecommendations}
          allIdeas={allIdeas}
          onLoadRecommendations={loadRecommendations}
          onUpdate={() => {
            loadRelatedIdeas()
            loadRecommendations()
          }}
          onError={onError}
        />
      </TabsContent>

      <TabsContent value="ai">
        <AISuggestionsTab
          ideaId={ideaId}
          aiSuggestions={aiSuggestions}
          onUpdate={loadAISuggestions}
          onError={onError}
        />
      </TabsContent>

      <TabsContent value="competitors">
        <CompetitorTab
          ideaId={ideaId}
          competitorData={competitorData}
          onUpdate={loadCompetitorData}
          onError={onError}
        />
      </TabsContent>

      <TabsContent value="details">
        <DetailsTab idea={ideaDetail.idea} />
      </TabsContent>
    </Tabs>
  )
}