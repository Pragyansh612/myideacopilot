"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Sparkles, Loader2, Lightbulb, TrendingUp, Target, CheckCircle2 } from "lucide-react"
import { AIAPI, type AISuggestion, type SuggestionTypeEnum } from "@/lib/api/idea"

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

  // Group suggestions by type
  const suggestionsByType = aiSuggestions.reduce((acc, suggestion) => {
    const type = suggestion.suggestion_type
    if (!acc[type]) acc[type] = []
    acc[type].push(suggestion)
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
    </div>
  )
}