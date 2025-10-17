"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const [creatingFromSuggestion, setCreatingFromSuggestion] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  })

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
      setCreatingFromSuggestion(selectedSuggestion?.id || null)

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
    } finally {
      setCreatingFromSuggestion(null)
    }
  }

  const handleCreatePhase = async () => {
    if (!createFormData.title.trim()) {
      onError("Phase name is required")
      return
    }

    try {
      setCreatingFromSuggestion(selectedSuggestion?.id || null)

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
    } finally {
      setCreatingFromSuggestion(null)
    }
  }

  const openCreateDialog = (suggestion: any, item: any, itemType: "feature" | "phase") => {
    setSelectedSuggestion(suggestion)
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
                  <SelectItem value="features">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Feature Suggestions
                    </div>
                  </SelectItem>
                  <SelectItem value="phases">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Phase Suggestions
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {type === 'features' && <Lightbulb className="w-5 h-5 text-primary" />}
                    {type === 'phases' && <Zap className="w-5 h-5 text-primary" />}
                    {type === 'improvements' && <TrendingUp className="w-5 h-5 text-primary" />}
                    {type === 'marketing' && <Target className="w-5 h-5 text-primary" />}
                    {type === 'validation' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    <CardTitle className="capitalize">{type}</CardTitle>
                  </div>
                  {isCreateableType(type) && (
                    <Badge variant="outline" className="text-xs">
                      Creatable
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
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

                      {items.length > 0 ? (
                        <div className="space-y-3">
                          {items.map((item: any, idx: number) => (
                            <div key={idx} className="p-4 rounded-lg glass-strong border border-border/50 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  {item.title && (
                                    <h4 className="font-semibold text-sm">{item.title}</h4>
                                  )}
                                  {item.name && (
                                    <h4 className="font-semibold text-sm">{item.name}</h4>
                                  )}
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                {item.priority && (
                                  <Badge
                                    variant={
                                      item.priority === 'high' ? 'default' :
                                        item.priority === 'medium' ? 'secondary' :
                                          'outline'
                                    }
                                    className="text-xs ml-2 flex-shrink-0"
                                  >
                                    {item.priority}
                                  </Badge>
                                )}
                              </div>

                              {(item.estimated_effort || item.effort || item.impact || item.estimated_duration_weeks) && (
                                <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/30 pt-2">
                                  {item.estimated_effort && (
                                    <span>Effort: {item.estimated_effort}/10</span>
                                  )}
                                  {item.effort && (
                                    <span>Effort: {item.effort}</span>
                                  )}
                                  {item.impact && (
                                    <span>Impact: {item.impact}</span>
                                  )}
                                  {item.estimated_duration_weeks && (
                                    <span>Duration: {item.estimated_duration_weeks} weeks</span>
                                  )}
                                </div>
                              )}

                              {isCreateableType(type) && (
                                <Dialog open={showCreateDialog && selectedSuggestion?.id === suggestion.id} onOpenChange={setShowCreateDialog}>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="w-full gap-2 mt-2"
                                      onClick={() => openCreateDialog(suggestion, item, type === 'features' ? 'feature' : 'phase')}
                                      disabled={creatingFromSuggestion === suggestion.id}
                                    >
                                      {creatingFromSuggestion === suggestion.id ? (
                                        <>
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                          Creating...
                                        </>
                                      ) : (
                                        <>
                                          <Plus className="w-3 h-3" />
                                          Create {type === 'features' ? 'Feature' : 'Phase'}
                                        </>
                                      )}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="glass max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Create {type === 'features' ? 'Feature' : 'Phase'}</DialogTitle>
                                      <DialogDescription>
                                        {type === 'features' 
                                          ? 'Create a new feature from this AI suggestion'
                                          : 'Create a new phase from this AI suggestion'
                                        }
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="create-title">
                                          {type === 'features' ? 'Feature' : 'Phase'} Name
                                        </Label>
                                        <Input
                                          id="create-title"
                                          placeholder={type === 'features' ? 'e.g., Dark Mode' : 'e.g., MVP Development'}
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

                                      {type === 'features' && (
                                        <div className="space-y-2">
                                          <Label htmlFor="create-priority">Priority</Label>
                                          <Select value={createFormData.priority} onValueChange={(value) => setCreateFormData({
                                            ...createFormData,
                                            priority: value as "low" | "medium" | "high"
                                          })}>
                                            <SelectTrigger>
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
                                          onClick={() => type === 'features' ? handleCreateFeature() : handleCreatePhase()}
                                          className="gradient-primary flex-1"
                                          disabled={!createFormData.title.trim() || creatingFromSuggestion !== null}
                                        >
                                          {creatingFromSuggestion ? (
                                            <>
                                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                              Creating...
                                            </>
                                          ) : (
                                            <>
                                              <Plus className="w-4 h-4 mr-2" />
                                              Create
                                            </>
                                          )}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => setShowCreateDialog(false)}
                                          disabled={creatingFromSuggestion !== null}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
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
    </div>
  )
}