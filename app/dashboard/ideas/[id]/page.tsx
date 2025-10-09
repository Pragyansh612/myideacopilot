"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, Edit2, Trash2, Save, X, Plus, Loader2, 
  CheckCircle2, Circle, MoreVertical, Calendar, Target,
  TrendingUp, Zap, Users, ExternalLink
} from "lucide-react"
import Link from "next/link"
import { 
  IdeaAPI, PhaseAPI, FeatureAPI, CompetitorAPI,
  type IdeaDetail, type Phase, type Feature, type IdeaUpdate 
} from "@/lib/api/idea"

export default function IdeaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ideaId = params.id as string

  const [ideaDetail, setIdeaDetail] = useState<IdeaDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Edit form states
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  // Phase/Feature creation states
  const [showNewPhase, setShowNewPhase] = useState(false)
  const [newPhaseName, setNewPhaseName] = useState("")
  const [newPhaseDescription, setNewPhaseDescription] = useState("")

  const [showNewFeature, setShowNewFeature] = useState<string | null>(null)
  const [newFeatureTitle, setNewFeatureTitle] = useState("")
  const [newFeatureDescription, setNewFeatureDescription] = useState("")

  // Competitor research
  const [competitorUrls, setCompetitorUrls] = useState("")
  const [isScrapingCompetitors, setIsScrapingCompetitors] = useState(false)
  const [competitorData, setCompetitorData] = useState<any>(null)

  useEffect(() => {
    loadIdeaDetail()
  }, [ideaId])

  const loadIdeaDetail = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const detail = await IdeaAPI.getIdea(ideaId)
      setIdeaDetail(detail)
      setEditTitle(detail.idea.title)
      setEditDescription(detail.idea.description || "")

      // Load competitor research
      try {
        const competitors = await CompetitorAPI.getCompetitorResearch(ideaId)
        setCompetitorData(competitors)
      } catch (err) {
        console.log("No competitor data yet")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load idea")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true)
      const updateData: IdeaUpdate = {
        title: editTitle,
        description: editDescription,
      }
      await IdeaAPI.updateIdea(ideaId, updateData)
      await loadIdeaDetail()
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update idea")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteIdea = async () => {
    if (!confirm("Are you sure you want to delete this idea? This action cannot be undone.")) {
      return
    }

    try {
      await IdeaAPI.deleteIdea(ideaId)
      router.push("/dashboard/ideas")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete idea")
    }
  }

  const handleCreatePhase = async () => {
    if (!newPhaseName.trim()) return

    try {
      await PhaseAPI.createPhase(ideaId, {
        name: newPhaseName,
        description: newPhaseDescription || undefined,
        order_index: ideaDetail?.phases.length || 0,
      })
      setNewPhaseName("")
      setNewPhaseDescription("")
      setShowNewPhase(false)
      await loadIdeaDetail()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create phase")
    }
  }

  const handleTogglePhaseComplete = async (phase: Phase) => {
    try {
      await PhaseAPI.updatePhase(phase.id, {
        is_completed: !phase.is_completed,
      })
      await loadIdeaDetail()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update phase")
    }
  }

  const handleCreateFeature = async (phaseId?: string) => {
    if (!newFeatureTitle.trim()) return

    try {
      if (phaseId) {
        await FeatureAPI.createFeatureForPhase(phaseId, {
          title: newFeatureTitle,
          description: newFeatureDescription || undefined,
        })
      } else {
        await FeatureAPI.createFeatureForIdea(ideaId, {
          title: newFeatureTitle,
          description: newFeatureDescription || undefined,
        })
      }
      setNewFeatureTitle("")
      setNewFeatureDescription("")
      setShowNewFeature(null)
      await loadIdeaDetail()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create feature")
    }
  }

  const handleToggleFeatureComplete = async (feature: Feature) => {
    try {
      await FeatureAPI.updateFeature(feature.id, {
        is_completed: !feature.is_completed,
      })
      await loadIdeaDetail()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update feature")
    }
  }

  const handleScrapeCompetitors = async () => {
    const urls = competitorUrls.split('\n').filter(url => url.trim())
    if (urls.length === 0) return

    try {
      setIsScrapingCompetitors(true)
      const result = await CompetitorAPI.scrapeCompetitors({
        idea_id: ideaId,
        urls,
        analyze: true,
      })
      setCompetitorData(result)
      setCompetitorUrls("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scrape competitors")
    } finally {
      setIsScrapingCompetitors(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
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

  const { idea, phases, features } = ideaDetail
  const totalFeatures = features.length
  const completedFeatures = features.filter(f => f.is_completed).length
  const progress = totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 0

  return (
    <>
      <PageHeader 
        title={isEditing ? "Edit Idea" : idea.title} 
        description={!isEditing && idea.description ? idea.description : undefined}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/ideas">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDeleteIdea} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving} className="gradient-primary">
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <Card className="glass-strong">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-lg font-medium glass"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={6}
                  className="glass resize-none"
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        {!isEditing && (
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
                    <p className="text-2xl font-bold capitalize">{idea.status.replace('_', ' ')}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tags */}
        {!isEditing && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="phases" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="phases">Phases & Features</TabsTrigger>
            <TabsTrigger value="competitors">Competitor Research</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Phases Tab */}
          <TabsContent value="phases" className="space-y-4">
            {/* Create Phase Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Development Phases</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewPhase(true)}
                className="hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Phase
              </Button>
            </div>

            {/* New Phase Form */}
            {showNewPhase && (
              <Card className="glass border-primary/20">
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder="Phase name..."
                    value={newPhaseName}
                    onChange={(e) => setNewPhaseName(e.target.value)}
                    className="glass"
                  />
                  <Textarea
                    placeholder="Phase description (optional)..."
                    value={newPhaseDescription}
                    onChange={(e) => setNewPhaseDescription(e.target.value)}
                    rows={2}
                    className="glass resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreatePhase} disabled={!newPhaseName.trim()}>
                      Create Phase
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowNewPhase(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phases List */}
            {phases.length === 0 && !showNewPhase ? (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No phases yet</h3>
                  <p className="text-muted-foreground mb-4">Break down your idea into manageable phases</p>
                  <Button onClick={() => setShowNewPhase(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Phase
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {phases.map((phase) => {
                  const phaseFeatures = features.filter(f => f.phase_id === phase.id)
                  const completedCount = phaseFeatures.filter(f => f.is_completed).length

                  return (
                    <Card key={phase.id} className="glass">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => handleTogglePhaseComplete(phase)}
                              className="mt-1"
                            >
                              {phase.is_completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                            </button>
                            <div className="flex-1">
                              <CardTitle className={phase.is_completed ? "line-through text-muted-foreground" : ""}>
                                {phase.name}
                              </CardTitle>
                              {phase.description && (
                                <CardDescription className="mt-1">{phase.description}</CardDescription>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{completedCount} / {phaseFeatures.length} features completed</span>
                                {phase.due_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(phase.due_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {/* Features for this phase */}
                        {phaseFeatures.map((feature) => (
                          <div key={feature.id} className="flex items-start gap-3 p-3 rounded-lg glass-strong">
                            <button
                              onClick={() => handleToggleFeatureComplete(feature)}
                              className="mt-0.5"
                            >
                              {feature.is_completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${feature.is_completed ? "line-through text-muted-foreground" : ""}`}>
                                {feature.title}
                              </p>
                              {feature.description && (
                                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {feature.priority}
                            </Badge>
                          </div>
                        ))}

                        {/* Add Feature to Phase */}
                        {showNewFeature === phase.id ? (
                          <div className="space-y-2 p-3 rounded-lg glass-strong">
                            <Input
                              placeholder="Feature title..."
                              value={newFeatureTitle}
                              onChange={(e) => setNewFeatureTitle(e.target.value)}
                              className="glass text-sm"
                            />
                            <Textarea
                              placeholder="Feature description (optional)..."
                              value={newFeatureDescription}
                              onChange={(e) => setNewFeatureDescription(e.target.value)}
                              rows={2}
                              className="glass resize-none text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleCreateFeature(phase.id)} disabled={!newFeatureTitle.trim()}>
                                Add Feature
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setShowNewFeature(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNewFeature(phase.id)}
                            className="w-full justify-start text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add feature to this phase
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Standalone Features (not in any phase) */}
            {features.filter(f => !f.phase_id).length > 0 && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle>General Features</CardTitle>
                  <CardDescription>Features not assigned to a specific phase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {features
                    .filter(f => !f.phase_id)
                    .map((feature) => (
                      <div key={feature.id} className="flex items-start gap-3 p-3 rounded-lg glass-strong">
                        <button
                          onClick={() => handleToggleFeatureComplete(feature)}
                          className="mt-0.5"
                        >
                          {feature.is_completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${feature.is_completed ? "line-through text-muted-foreground" : ""}`}>
                            {feature.title}
                          </p>
                          {feature.description && (
                            <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {feature.priority}
                        </Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Competitors Tab */}
<TabsContent value="competitors" className="space-y-4">
  <Card className="glass">
    <CardHeader>
      <CardTitle>Competitor Research</CardTitle>
      <CardDescription>Analyze competitor websites to understand the market</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Competitor URLs (one per line)</label>
        <Textarea
          placeholder="https://competitor1.com&#10;https://competitor2.com&#10;https://competitor3.com"
          value={competitorUrls}
          onChange={(e) => setCompetitorUrls(e.target.value)}
          rows={5}
          className="glass resize-none"
          disabled={isScrapingCompetitors}
        />
      </div>
      <Button
        onClick={handleScrapeCompetitors}
        disabled={isScrapingCompetitors || !competitorUrls.trim()}
        className="gradient-primary"
      >
        {isScrapingCompetitors ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Users className="w-4 h-4 mr-2" />
            Analyze Competitors
          </>
        )}
      </Button>
    </CardContent>
  </Card>

  {/* Competitor Results */}
  {competitorData && competitorData.research && competitorData.research.length > 0 && (
    <div className="space-y-4">
      {competitorData.research.map((competitor: any, index: number) => (
        <Card key={index} className="glass">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle>{competitor.competitor_name || `Competitor ${index + 1}`}</CardTitle>
                {competitor.competitor_url && (
                  <a
                    href={competitor.competitor_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                  >
                    {competitor.competitor_url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {competitor.confidence_score && (
                <Badge variant="secondary" className="ml-2 flex-shrink-0">
                  {(competitor.confidence_score * 100).toFixed(0)}% confidence
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {competitor.description && (
              <p className="text-sm text-muted-foreground">{competitor.description}</p>
            )}

            {competitor.strengths && competitor.strengths.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-green-500">Strengths</h4>
                <ul className="space-y-1">
                  {competitor.strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {competitor.weaknesses && competitor.weaknesses.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-500">Weaknesses</h4>
                <ul className="space-y-1">
                  {competitor.weaknesses.map((weakness: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {competitor.differentiation_opportunities && competitor.differentiation_opportunities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-primary">Differentiation Opportunities</h4>
                <ul className="space-y-1">
                  {competitor.differentiation_opportunities.map((opp: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {competitor.market_position && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Market Position</h4>
                <p className="text-sm text-muted-foreground">{competitor.market_position}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )}
</TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Idea Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Effort Required</span>
                      <span className="text-sm font-bold">{idea.effort_score || "Not rated"}</span>
                    </div>
                    {idea.effort_score && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2"
                          style={{ width: `${(idea.effort_score / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Potential Impact</span>
                      <span className="text-sm font-bold">{idea.impact_score || "Not rated"}</span>
                    </div>
                    {idea.impact_score && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 rounded-full h-2"
                          style={{ width: `${(idea.impact_score / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Your Interest</span>
                      <span className="text-sm font-bold">{idea.interest_score || "Not rated"}</span>
                    </div>
                    {idea.interest_score && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-500 rounded-full h-2"
                          style={{ width: `${(idea.interest_score / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {idea.overall_score && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Overall Score</span>
                      <span className="text-3xl font-bold text-primary">{idea.overall_score.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created</span>
                    <p className="font-medium">{new Date(idea.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated</span>
                    <p className="font-medium">{new Date(idea.updated_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capture Type</span>
                    <p className="font-medium capitalize">{idea.capture_type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Privacy</span>
                    <p className="font-medium">{idea.is_private ? "Private" : "Public"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}