"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network, Sparkles, Package } from "lucide-react"
import { PhasesTab } from "./phases-tab"
import { RelatedIdeasTab } from "./related-ideas-tab"
import { AISuggestionsTab } from "./ai-suggestions-tab"
import { CompetitorTab } from "./competitor-tab"
import { DetailsTab } from "./details-tab"
import { BuildPlanTab } from "./build-plan-tab"
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
    <Tabs defaultValue="phases" className="space-y-4">
      <TabsList className="glass w-full">
        <TabsTrigger value="phases" className="flex-1">
          Phases
        </TabsTrigger>
        <TabsTrigger value="build-plan" className="flex-1 gap-1">
          <Package className="w-4 h-4" />
          <span className="hidden sm:inline">Build Plan</span>
        </TabsTrigger>
        <TabsTrigger value="related" className="flex-1 gap-1">
          <Network className="w-4 h-4" />
          <span className="hidden sm:inline">Related</span>
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex-1 gap-1">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI</span>
        </TabsTrigger>
        <TabsTrigger value="competitors" className="flex-1 hidden sm:inline-flex">
          Competitors
        </TabsTrigger>
        <TabsTrigger value="details" className="flex-1 hidden sm:inline-flex">
          Details
        </TabsTrigger>
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

      <TabsContent value="build-plan">
        <BuildPlanTab
          ideaId={ideaId}
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