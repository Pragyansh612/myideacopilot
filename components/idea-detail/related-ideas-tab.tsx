"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Save, Sparkles, Loader2, CheckCircle2, Network, GitBranch, X, ArrowRight, Lightbulb, Trash2 } from "lucide-react"
import Link from "next/link"
import { RelatedIdeaAPI, type RelatedIdeaWithDetails, type Idea, type RelationTypeEnum, type RecommendationItem } from "@/lib/api/idea"
import { LinkIcon } from "lucide-react"

interface RelatedIdeasTabProps {
  ideaId: string
  relatedIdeas: RelatedIdeaWithDetails[]
  recommendations: RecommendationItem[]
  isLoadingRecommendations: boolean
  allIdeas: Idea[]
  onLoadRecommendations: () => void
  onUpdate: () => void
  onError: (error: string) => void
}

export function RelatedIdeasTab({
  ideaId,
  relatedIdeas,
  recommendations,
  isLoadingRecommendations,
  allIdeas,
  onLoadRecommendations,
  onUpdate,
  onError
}: RelatedIdeasTabProps) {
  const [showAddRelation, setShowAddRelation] = useState(false)
  const [selectedTargetIdea, setSelectedTargetIdea] = useState("")
  const [selectedRelationType, setSelectedRelationType] = useState<RelationTypeEnum>("related")

  const handleCreateRelation = async () => {
    if (!selectedTargetIdea) return

    try {
      await RelatedIdeaAPI.createRelation({
        source_idea_id: ideaId,
        target_idea_id: selectedTargetIdea,
        relation_type: selectedRelationType,
        is_ai_suggested: false,
      })
      setShowAddRelation(false)
      setSelectedTargetIdea("")
      setSelectedRelationType("related")
      onUpdate()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create relation")
    }
  }

  const handleDeleteRelation = async (relationId: string) => {
    try {
      await RelatedIdeaAPI.deleteRelation(relationId)
      onUpdate()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete relation")
    }
  }

  const handleCreateRecommendedRelation = async (targetIdeaId: string, relationType: RelationTypeEnum) => {
    try {
      await RelatedIdeaAPI.createRelation({
        source_idea_id: ideaId,
        target_idea_id: targetIdeaId,
        relation_type: relationType,
        is_ai_suggested: true,
      })
      onUpdate()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create relation")
    }
  }

  const getRelationIcon = (relationType: string) => {
    switch (relationType) {
      case 'depends_on': return <GitBranch className="w-5 h-5 text-orange-500" />
      case 'blocks': return <X className="w-5 h-5 text-red-500" />
      case 'similar': return <LinkIcon className="w-5 h-5 text-blue-500" />
      case 'inspired_by': return <Lightbulb className="w-5 h-5 text-yellow-500" />
      default: return <ArrowRight className="w-5 h-5 text-primary" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Related Ideas</h3>
          <p className="text-sm text-muted-foreground">Connect ideas to discover patterns and opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onLoadRecommendations}
            disabled={isLoadingRecommendations}
            className="transition-all duration-300"
          >
            {isLoadingRecommendations ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Get AI Suggestions
          </Button>
          <Dialog open={showAddRelation} onOpenChange={setShowAddRelation}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Relation
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader>
                <DialogTitle>Add Related Idea</DialogTitle>
                <DialogDescription>
                  Connect this idea with another one to track relationships
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Idea</label>
                  <Select value={selectedTargetIdea} onValueChange={setSelectedTargetIdea}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Choose an idea..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allIdeas.map((idea) => (
                        <SelectItem key={idea.id} value={idea.id}>
                          {idea.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Relationship Type</label>
                  <Select value={selectedRelationType} onValueChange={(v) => setSelectedRelationType(v as RelationTypeEnum)}>
                    <SelectTrigger className="glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="related">Related</SelectItem>
                      <SelectItem value="depends_on">Depends On</SelectItem>
                      <SelectItem value="blocks">Blocks</SelectItem>
                      <SelectItem value="similar">Similar</SelectItem>
                      <SelectItem value="inspired_by">Inspired By</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateRelation} className="gradient-primary" disabled={!selectedTargetIdea}>
                    <Save className="w-4 h-4 mr-2" />
                    Create Relation
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddRelation(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {relatedIdeas.filter(r => r.is_ai_suggested).length > 0 && (
        <Card className="glass border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Auto-Detected Relationships</CardTitle>
            </div>
            <CardDescription>
              These connections were automatically discovered by analyzing your ideas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>
                ✨ {relatedIdeas.filter(r => r.is_ai_suggested).length} relationship
                {relatedIdeas.filter(r => r.is_ai_suggested).length !== 1 ? 's' : ''} automatically detected
              </p>
              <p className="mt-2">
                These connections help you identify common components and optimize your build strategy.
                Check the <strong>Build Plan</strong> tab for detailed recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Relations */}
      {relatedIdeas.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Connected Ideas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedIdeas.filter(related => related?.idea?.id).map((related) => (
              <div
                key={related.id}
                className="flex items-start gap-3 p-4 rounded-lg glass-strong border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex-shrink-0 mt-1">
                  {getRelationIcon(related.relation_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Link
                        href={`/dashboard/ideas/${related.idea.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {related.idea.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {related.idea.description || "No description"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRelation(related.id)}
                      className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {related.relation_type.replace('_', ' ')}
                    </Badge>
                    {related.is_ai_suggested && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Suggested
                      </Badge>
                    )}
                    {related.confidence_score && (
                      <Badge variant="secondary" className="text-xs">
                        {(related.confidence_score * 100).toFixed(0)}% match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="glass border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">AI Recommendations</CardTitle>
            </div>
            <CardDescription>
              Ideas that might be related based on semantic similarity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.idea.id}
                className="flex items-start gap-3 p-4 rounded-lg glass-strong border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link
                      href={`/dashboard/ideas/${rec.idea.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {rec.idea.title}
                    </Link>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {(rec.similarity_score * 100).toFixed(0)}% match
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {rec.idea.description || "No description"}
                  </p>
                  {!rec.is_already_connected && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateRecommendedRelation(rec.idea.id, rec.recommended_relation_type)}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Connect as {rec.recommended_relation_type.replace('_', ' ')}
                    </Button>
                  )}
                  {rec.is_already_connected && (
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Already connected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {relatedIdeas.length === 0 && recommendations.length === 0 && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Network className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No related ideas yet</h3>
            <p className="text-muted-foreground mb-4">
              Connect this idea with others to track dependencies and discover patterns
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setShowAddRelation(true)} className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Relation
              </Button>
              <Button variant="outline" onClick={onLoadRecommendations} disabled={isLoadingRecommendations}>
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Suggestions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Graph Button */}
      {relatedIdeas.length > 0 && (
        <Button
          variant="outline"
          asChild
          className="w-full"
        >
          <Link href={`/dashboard/ideas/network?center=${ideaId}`}>
            <Network className="w-4 h-4 mr-2" />
            View in Network Graph
          </Link>
        </Button>
      )}
    </div>
  )
}