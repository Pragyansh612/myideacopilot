"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Loader2, Package, CheckCircle2, Clock, ArrowRight, 
  Sparkles, BarChart3, X, TrendingUp 
} from "lucide-react"
import Link from "next/link"
import { AutoDetectionAPI, type CommonComponent, type BuildPlan } from "@/lib/api/idea"

interface BuildPlanTabProps {
  ideaId: string;
  onError: (error: string) => void;
}

export function BuildPlanTab({ ideaId, onError }: BuildPlanTabProps) {
  const [buildPlan, setBuildPlan] = useState<BuildPlan | null>(null)
  const [components, setComponents] = useState<CommonComponent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [plan, comps] = await Promise.all([
        AutoDetectionAPI.getBuildPlan(),
        AutoDetectionAPI.getCommonComponents(2)
      ])
      setBuildPlan(plan)
      setComponents(comps)
    } catch (err) {
      // Silent fail - might be no data yet
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true)
      await AutoDetectionAPI.analyzeAllIdeas()
      await loadData()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to analyze ideas")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAcceptSuggestion = async (suggestionId: string) => {
    try {
      await AutoDetectionAPI.acceptSuggestion(suggestionId)
      await loadData()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to accept suggestion")
    }
  }

  const handleDismissSuggestion = async (suggestionId: string) => {
    try {
      await AutoDetectionAPI.dismissSuggestion(suggestionId)
      await loadData()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to dismiss suggestion")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-500/10'
      case 'high': return 'text-orange-500 bg-orange-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'low': return 'text-green-500 bg-green-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getComponentTypeIcon = (type: string) => {
    switch (type) {
      case 'technology': return '⚙️'
      case 'feature': return '✨'
      case 'service': return '🔌'
      case 'integration': return '🔗'
      default: return '📦'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Build Plan Optimizer</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered suggestions for building reusable components
          </p>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="gradient-primary"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Ideas
            </>
          )}
        </Button>
      </div>

      {/* Build Plan Summary */}
      {buildPlan && buildPlan.total_steps > 0 && (
        <Card className="glass border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Optimized Build Strategy</CardTitle>
            </div>
            <CardDescription>{buildPlan.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timeline */}
            {buildPlan.estimated_timeline && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Estimated Timeline:</span>
                <Badge variant="secondary">{buildPlan.estimated_timeline}</Badge>
              </div>
            )}

            {/* Build Steps */}
            <div className="space-y-3">
              {buildPlan.steps.map((step, index) => (
                <div
                  key={step.step_number}
                  className="relative pl-8 pb-4 last:pb-0"
                >
                  {/* Timeline Line */}
                  {index < buildPlan.steps.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />
                  )}
                  
                  {/* Step Number Badge */}
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {step.step_number}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getComponentTypeIcon(step.component_type)}
                          </span>
                          <h4 className="font-semibold">{step.component_name}</h4>
                          <Badge className={getPriorityColor(step.priority)}>
                            {step.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="flex items-start gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{step.reason}</span>
                    </div>

                    {/* Enables Ideas */}
                    {step.enables_ideas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">Enables:</span>
                        {step.enables_ideas.slice(0, 3).map((ideaTitle) => (
                          <Badge key={ideaTitle} variant="outline" className="text-xs">
                            {ideaTitle}
                          </Badge>
                        ))}
                        {step.enables_ideas.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{step.enables_ideas.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Effort */}
                    {step.estimated_effort && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.estimated_effort}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common Components */}
      {components.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Reusable Components</CardTitle>
            <CardDescription>
              Build these components once and use them across multiple ideas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {components.map((component) => (
              <div
                key={component.id}
                className="p-4 rounded-lg glass-strong border border-border/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getComponentTypeIcon(component.component_type)}
                      </span>
                      <h4 className="font-semibold">{component.component_name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        #{component.suggested_order}
                      </Badge>
                    </div>

                    {component.description && (
                      <p className="text-sm text-muted-foreground">
                        {component.description}
                      </p>
                    )}

                    {/* Usage Info */}
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Used in {component.usage_count} ideas:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {component.used_in_ideas.slice(0, 2).map((idea) => (
                          <Link
                            key={idea.id}
                            href={`/dashboard/ideas/${idea.id}`}
                            className="text-primary hover:underline text-xs"
                          >
                            {idea.title}
                          </Link>
                        ))}
                        {component.usage_count > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{component.usage_count - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Priority Score */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Priority:</span>
                      <div className="flex-1 max-w-xs">
                        <Progress 
                          value={component.priority_score * 100} 
                          className="h-2"
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {(component.priority_score * 100).toFixed(0)}%
                      </span>
                    </div>

                    {component.estimated_effort && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {component.estimated_effort}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {!component.is_accepted ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcceptSuggestion(component.id)}
                          className="text-xs"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismissSuggestion(component.id)}
                          className="text-xs text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Dismiss
                        </Button>
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Accepted
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!buildPlan && components.length === 0 && !isLoading && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No build plan yet</h3>
            <p className="text-muted-foreground mb-4">
              Analyze your ideas to discover reusable components and get an optimized build strategy
            </p>
            <Button onClick={handleAnalyze} className="gradient-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Ideas Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}