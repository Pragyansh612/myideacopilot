"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Sparkles, Loader2, Lightbulb, TrendingUp, Target, CheckCircle2, Plus, Zap } from "lucide-react"
import { AIAPI, type AISuggestion, type SuggestionTypeEnum, FeatureAPI, PhaseAPI } from "@/lib/api/idea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AISuggestionsTabProps {
  ideaId: string
  aiSuggestions: AISuggestion[]
  onUpdate: () => void
  onError: (error: string) => void
}

export function AISuggestionsTab({ ideaId, aiSuggestions, onUpdate, onError }: AISuggestionsTabProps) {
  const [showAIForm, setShowAIForm] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [selectedSuggestionType, setSelectedSuggestionType] = useState<SuggestionTypeEnum>("features")
  const [aiContext, setAiContext] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const [lastGeneratedTime, setLastGeneratedTime] = useState<Date | null>(null)

  const handleGenerateAISuggestions = async () => {
    try {
      setIsGeneratingAI(true)

      await AIAPI.generateSuggestions({
        idea_id: ideaId,
        suggestion_type: selectedSuggestionType,
        context: aiContext || undefined,
      })

      onUpdate()
      setShowAIForm(false)
      setAiContext("")
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to generate AI suggestions")
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleCreateFeature = async () => {
    if (!createFormData.title.trim()) {
      onError("Feature title is required")
      return
    }

    try {
      await FeatureAPI.createFeatureForIdea(ideaId, {
        title: createFormData.title,
        description: createFormData.description,
        priority: createFormData.priority,
      })

      onUpdate()
      setShowCreateDialog(false)
      setCreateFormData({ title: "", description: "", priority: "medium" })
      setSelectedSuggestion(null)
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create feature")
    }
  }

  const handleCreatePhase = async () => {
    if (!createFormData.title.trim()) {
      onError("Phase name is required")
      return
    }

    try {
      await PhaseAPI.createPhase(ideaId, {
        name: createFormData.title,
        description: createFormData.description,
        order_index: 0,
      })

      onUpdate()
      setShowCreateDialog(false)
      setCreateFormData({ title: "", description: "", priority: "medium" })
      setSelectedSuggestion(null)
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create phase")
    }
  }

  const openCreateDialog = (suggestion: any, item: any, itemType: "feature" | "phase") => {
    setSelectedSuggestion({ ...suggestion, itemType })
    setCreateFormData({
      title: item.title || item.name || "",
      description: item.description || "",
      priority: item.priority || "medium",
    })
    setShowCreateDialog(true)
  }

  // Group suggestions by type
  const suggestionsByType = aiSuggestions.reduce((acc, suggestion) => {
    const type = suggestion.suggestion_type
    if (!acc[type]) acc[type] = []
    acc[type].push(suggestion)
    return acc
  }, {} as Record<string, AISuggestion[]>)

  const isCreateableType = (type: string) => ["features", "phases"].includes(type)

  // Get first few suggestions per type (limit to 5 per type)
  const displayedSuggestionsByType = Object.entries(suggestionsByType).reduce((acc, [type, suggestions]) => {
    acc[type] = suggestions.slice(0, 1) // Show only latest suggestion group per type
    return acc
  }, {} as Record<string, AISuggestion[]>)

  return (
    <div className="space-y-4">
      {/* Header */}
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
                  <SelectItem value="features">Feature Suggestions</SelectItem>
                  <SelectItem value="phases">Phase Suggestions</SelectItem>
                  <SelectItem value="improvements">Improvements</SelectItem>
                  <SelectItem value="marketing">Marketing Strategy</SelectItem>
                  <SelectItem value="validation">Market Validation</SelectItem>
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
        <Tabs defaultValue={Object.keys(displayedSuggestionsByType)[0]} className="space-y-4">
          <TabsList className="glass">
            {Object.entries(displayedSuggestionsByType).map(([type]) => (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type === 'features' && <Lightbulb className="w-4 h-4 mr-2" />}
                {type === 'phases' && <Zap className="w-4 h-4 mr-2" />}
                {type === 'improvements' && <TrendingUp className="w-4 h-4 mr-2" />}
                {type === 'marketing' && <Target className="w-4 h-4 mr-2" />}
                {type === 'validation' && <CheckCircle2 className="w-4 h-4 mr-2" />}
                {type}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(displayedSuggestionsByType).map(([type, suggestions]) => (
            <TabsContent key={type} value={type} className="space-y-3">
              {suggestions.map((suggestion) => {
                let content = suggestion.content
                if (typeof content === 'string') {
                  try {
                    content = JSON.parse(content)
                  } catch (e) {
                    console.error('Error parsing suggestion content:', e)
                  }
                }

                const isArray = Array.isArray(content)
                const items = isArray ? content : (content?.raw_response ? [{ description: content.raw_response }] : [])

                return (
                  <div key={suggestion.id} className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.confidence_score
                          ? `${(suggestion.confidence_score * 100).toFixed(0)}% confidence`
                          : 'AI Generated'
                        }
                      </Badge>
                      <span>
                        {new Date(suggestion.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {items.length > 0 ? (
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {items.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-lg glass-strong border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer" onClick={() => openCreateDialog(suggestion, item, type === 'features' ? 'feature' : 'phase')}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                  {item.title || item.name}
                                </h4>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-3">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-start gap-2 flex-shrink-0 mt-1">
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
                                {isCreateableType(type) && (
                                  <Button
                                    size="sm"
                                    className="gradient-primary h-7 w-7 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openCreateDialog(suggestion, item, type === 'features' ? 'feature' : 'phase')
                                    }}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>

                            {(item.estimated_effort || item.effort || item.impact) && (
                              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border/30 mt-3 pt-3">
                                {item.estimated_effort && <span>Effort: {item.estimated_effort}/10</span>}
                                {item.effort && <span>Effort: {item.effort}</span>}
                                {item.impact && <span>Impact: {item.impact}</span>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg glass-strong text-center">
                        <p className="text-sm text-muted-foreground">No structured suggestions available</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Create Feature/Phase Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="glass max-w-md">
          <DialogHeader>
            <DialogTitle>
              Create {selectedSuggestion?.itemType === 'feature' ? 'Feature' : 'Phase'}
            </DialogTitle>
            <DialogDescription>
              {selectedSuggestion?.itemType === 'feature'
                ? 'Create a new feature from this AI suggestion'
                : 'Create a new phase from this AI suggestion'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 max-h-32 overflow-y-auto">
              <p className="text-sm font-medium line-clamp-2">{selectedSuggestion?.title}</p>
              {selectedSuggestion?.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                  {selectedSuggestion.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-title">
                {selectedSuggestion?.itemType === 'feature' ? 'Feature' : 'Phase'} Name
              </Label>
              <Input
                id="create-title"
                placeholder={selectedSuggestion?.itemType === 'feature' ? 'e.g., Dark Mode' : 'e.g., MVP Development'}
                value={createFormData.title}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  title: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description">Description (Optional)</Label>
              <Textarea
                id="create-description"
                placeholder="Add more details about this item..."
                value={createFormData.description}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  description: e.target.value
                })}
                rows={3}
              />
            </div>

            {selectedSuggestion?.itemType === 'feature' && (
              <div className="space-y-2">
                <Label htmlFor="create-priority">Priority</Label>
                <Select value={createFormData.priority} onValueChange={(value) => setCreateFormData({
                  ...createFormData,
                  priority: value as "low" | "medium" | "high"
                })}>
                  <SelectTrigger id="create-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => selectedSuggestion?.itemType === 'feature' ? handleCreateFeature() : handleCreatePhase()}
                className="gradient-primary flex-1"
                disabled={!createFormData.title.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}