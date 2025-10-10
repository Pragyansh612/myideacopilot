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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft, Edit2, Trash2, Save, X, Plus, Loader2,
  CheckCircle2, Circle, MoreVertical, Calendar, Target,
  TrendingUp, Zap, Users, ExternalLink, Sparkles, Brain,
  Lightbulb, TrendingDown
} from "lucide-react"
import Link from "next/link"
import {
  IdeaAPI, PhaseAPI, FeatureAPI, CompetitorAPI, AIAPI,
  type IdeaDetail, type Phase, type Feature, type IdeaUpdate,
  type AISuggestion, type SuggestionTypeEnum
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

  // AI Suggestions states
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [selectedSuggestionType, setSelectedSuggestionType] = useState<SuggestionTypeEnum>("features")
  const [aiContext, setAiContext] = useState("")
  const [showAIForm, setShowAIForm] = useState(false)

  // Competitor research
  const [competitorUrls, setCompetitorUrls] = useState("")
  const [isScrapingCompetitors, setIsScrapingCompetitors] = useState(false)
  const [competitorData, setCompetitorData] = useState<any>(null)

  useEffect(() => {
    loadIdeaDetail()
    loadAISuggestions()
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

  const loadAISuggestions = async () => {
    try {
      const suggestions = await AIAPI.getSuggestions(ideaId)
      setAiSuggestions(suggestions)
    } catch (err) {
      console.log("No AI suggestions yet")
    }
  }

  const handleGenerateAISuggestions = async () => {
    try {
      setIsGeneratingAI(true)
      setError(null)
      
      const suggestion = await AIAPI.generateSuggestions({
        idea_id: ideaId,
        suggestion_type: selectedSuggestionType,
        context: aiContext || undefined,
      })
      
      await loadAISuggestions()
      setShowAIForm(false)
      setAiContext("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate AI suggestions")
    } finally {
      setIsGeneratingAI(false)
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

  const { idea, phases = [], features = [] } = ideaDetail
  const totalFeatures = features.length
  const completedFeatures = features.filter(f => f.is_completed).length
  const progress = totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 0

  // Group suggestions by type
  const suggestionsByType = aiSuggestions.reduce((acc, suggestion) => {
    const type = suggestion.suggestion_type
    if (!acc[type]) acc[type] = []
    acc[type].push(suggestion)
    return acc
  }, {} as Record<string, AISuggestion[]>)

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
                    <p className="text-2xl font-bold capitalize">{idea.status?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tags */}
        {!isEditing && idea.tags && idea.tags.length > 0 && (
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
            <TabsTrigger value="ai">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Suggestions
            </TabsTrigger>
            <TabsTrigger value="competitors">Competitor Research</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Phases Tab - Keep existing code */}
          <TabsContent value="phases" className="space-y-4">
            {/* Your existing phases code here */}
          </TabsContent>

          {/* AI Suggestions Tab */}
          <TabsContent value="ai" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">AI-Powered Suggestions</h3>
                <p className="text-sm text-muted-foreground">Get intelligent insights to improve your idea</p>
              </div>
              <Button
                onClick={() => setShowAIForm(!showAIForm)}
                className="gradient-primary"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate Suggestions
              </Button>
            </div>

            {/* AI Generation Form */}
            {showAIForm && (
              <Card className="glass border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Suggestion Type</label>
                    <Select
                      value={selectedSuggestionType}
                      onValueChange={(value) => setSelectedSuggestionType(value as SuggestionTypeEnum)}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="features">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Feature Suggestions
                          </div>
                        </SelectItem>
                        <SelectItem value="improvements">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Improvements
                          </div>
                        </SelectItem>
                        <SelectItem value="marketing">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Marketing Strategy
                          </div>
                        </SelectItem>
                        <SelectItem value="validation">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Market Validation
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Context (Optional)</label>
                    <Textarea
                      placeholder="Provide any additional context to help AI generate better suggestions..."
                      value={aiContext}
                      onChange={(e) => setAiContext(e.target.value)}
                      rows={3}
                      className="glass resize-none"
                      disabled={isGeneratingAI}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerateAISuggestions}
                      disabled={isGeneratingAI}
                      className="gradient-primary"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAIForm(false)}
                      disabled={isGeneratingAI}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Display Suggestions */}
{aiSuggestions.length === 0 && !showAIForm ? (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No AI suggestions yet</h3>
                  <p className="text-muted-foreground mb-4">Generate intelligent suggestions to enhance your idea</p>
                  <Button onClick={() => setShowAIForm(true)} className="gradient-primary">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {Object.entries(suggestionsByType).map(([type, suggestions]) => (
                  <Card key={type} className="glass">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {type === 'features' && <Lightbulb className="w-5 h-5 text-primary" />}
                        {type === 'improvements' && <TrendingUp className="w-5 h-5 text-primary" />}
                        {type === 'marketing' && <Target className="w-5 h-5 text-primary" />}
                        {type === 'validation' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        <CardTitle className="capitalize">{type}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {suggestions.map((suggestion) => {
                        // Parse the content field if it's a string
                        let content = suggestion.content
                        if (typeof content === 'string') {
                          try {
                            content = JSON.parse(content)
                          } catch (e) {
                            console.error('Error parsing suggestion content:', e)
                          }
                        }

                        // Handle different content structures
                        const isArray = Array.isArray(content)
                        const items = isArray ? content : (content?.raw_response ? [{ description: content.raw_response }] : [])

                        return (
                          <div key={suggestion.id} className="space-y-3">
                            <div className="flex items-start justify-between mb-3">
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.confidence_score 
                                  ? `${(suggestion.confidence_score * 100).toFixed(0)}% confidence`
                                  : 'AI Generated'
                                }
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(suggestion.created_at).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Display structured suggestions */}
                            {items.length > 0 ? (
                              <div className="space-y-3">
                                {items.map((item: any, idx: number) => (
                                  <div key={idx} className="p-4 rounded-lg glass-strong border border-border/50">
                                    {item.title && (
                                      <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold text-sm">{item.title}</h4>
                                        {item.priority && (
                                          <Badge 
                                            variant={
                                              item.priority === 'high' ? 'default' : 
                                              item.priority === 'medium' ? 'secondary' : 
                                              'outline'
                                            }
                                            className="text-xs"
                                          >
                                            {item.priority}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                    {item.description && (
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {item.description}
                                      </p>
                                    )}
                                    {(item.estimated_effort || item.effort) && (
                                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                        {item.estimated_effort && (
                                          <span>Effort: {item.estimated_effort}/10</span>
                                        )}
                                        {item.effort && (
                                          <span>Effort: {item.effort}</span>
                                        )}
                                        {item.impact && (
                                          <span>Impact: {item.impact}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 rounded-lg glass-strong">
                                <p className="text-sm text-muted-foreground">
                                  No structured suggestions available
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
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