"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Loader2, Package, CheckCircle2, Clock, ArrowRight, 
  Sparkles, BarChart3, X, TrendingUp, Zap
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
      // Optimistic update
      setComponents(prev => 
        prev.map(c => c.id === suggestionId ? { ...c, is_accepted: true } : c)
      )
      await AutoDetectionAPI.acceptSuggestion(suggestionId)
    } catch (err) {
      // Revert on error
      setComponents(prev => 
        prev.map(c => c.id === suggestionId ? { ...c, is_accepted: false } : c)
      )
      onError(err instanceof Error ? err.message : "Failed to accept suggestion")
    }
  }

  const handleDismissSuggestion = async (suggestionId: string) => {
    try {
      // Optimistic update
      setComponents(prev => prev.filter(c => c.id !== suggestionId))
      await AutoDetectionAPI.dismissSuggestion(suggestionId)
    } catch (err) {
      // Reload on error
      await loadData()
      onError(err instanceof Error ? err.message : "Failed to dismiss suggestion")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
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
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="glass">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  const acceptedComponents = components.filter(c => c.is_accepted)
  const pendingComponents = components.filter(c => !c.is_accepted)

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
              Analyze
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      {(buildPlan || components.length > 0) ? (
        <Tabs defaultValue="strategy" className="space-y-4">
          <TabsList className="glass">
            <TabsTrigger value="strategy" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Strategy
            </TabsTrigger>
            <TabsTrigger value="components" className="gap-2">
              <Package className="w-4 h-4" />
              Suggestions ({pendingComponents.length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Accepted ({acceptedComponents.length})
            </TabsTrigger>
          </TabsList>

          {/* Strategy Tab */}
          <TabsContent value="strategy">
            {buildPlan && buildPlan.total_steps > 0 ? (
              <Card className="glass border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">Build Strategy</CardTitle>
                  </div>
                  <CardDescription>{buildPlan.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {buildPlan.estimated_timeline && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {buildPlan.estimated_timeline}
                    </Badge>
                  )}

                  <div className="space-y-4">
                    {buildPlan.steps.map((step, index) => (
                      <div key={step.step_number} className="relative pl-10 pb-4 last:pb-0">
                        {index < buildPlan.steps.length - 1 && (
                          <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-border" />
                        )}
                        
                        <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary border-2 border-primary/30">
                          {step.step_number}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg">{getComponentTypeIcon(step.component_type)}</span>
                            <h4 className="font-semibold">{step.component_name}</h4>
                            <Badge className={`${getPriorityColor(step.priority)} border text-xs`}>
                              {step.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{step.description}</p>

                          <div className="flex items-start gap-2 text-xs bg-primary/5 border border-primary/10 p-3 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{step.reason}</span>
                          </div>

                          {step.enables_ideas.length > 0 && (
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="text-xs text-muted-foreground">Unlocks:</span>
                              {step.enables_ideas.slice(0, 2).map(title => (
                                <Badge key={title} variant="outline" className="text-xs">
                                  {title}
                                </Badge>
                              ))}
                              {step.enables_ideas.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{step.enables_ideas.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No strategy available yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components">
            {pendingComponents.length > 0 ? (
              <div className="space-y-3">
                {pendingComponents.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    onAccept={handleAcceptSuggestion}
                    onDismiss={handleDismissSuggestion}
                    getComponentTypeIcon={getComponentTypeIcon}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-primary" />
                  <p className="text-sm text-muted-foreground">All suggestions reviewed!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Accepted Tab */}
          <TabsContent value="accepted">
            {acceptedComponents.length > 0 ? (
              <div className="space-y-3">
                {acceptedComponents.map((component) => (
                  <Card key={component.id} className="glass border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getComponentTypeIcon(component.component_type)}</span>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{component.component_name}</h4>
                            <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Accepted
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{component.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {component.used_in_ideas.map(idea => (
                              <Link key={idea.id} href={`/dashboard/ideas/${idea.id}`}>
                                <Badge variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">
                                  {idea.title}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No accepted components yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No build plan yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Analyze your ideas to discover reusable components
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

// Component Card with optimistic updates
function ComponentCard({ 
  component, 
  onAccept, 
  onDismiss, 
  getComponentTypeIcon 
}: {
  component: any
  onAccept: (id: string) => void
  onDismiss: (id: string) => void
  getComponentTypeIcon: (type: string) => string
}) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAccept = async () => {
    setIsProcessing(true)
    await onAccept(component.id)
    setIsProcessing(false)
  }

  const handleDismiss = async () => {
    setIsProcessing(true)
    await onDismiss(component.id)
    setIsProcessing(false)
  }

  return (
    <Card className="glass hover:glass-strong transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getComponentTypeIcon(component.component_type)}</span>
              <h4 className="font-semibold">{component.component_name}</h4>
              <Badge variant="secondary" className="text-xs">#{component.suggested_order}</Badge>
            </div>

            {component.description && (
              <p className="text-sm text-muted-foreground">{component.description}</p>
            )}

            <div className="flex items-center gap-2 text-xs">
              <Package className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Used in {component.usage_count} ideas</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {component.used_in_ideas.slice(0, 2).map((idea: any) => (
                <Link key={idea.id} href={`/dashboard/ideas/${idea.id}`}>
                  <Badge variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">
                    {idea.title}
                  </Badge>
                </Link>
              ))}
              {component.usage_count > 2 && (
                <Badge variant="outline" className="text-xs">+{component.usage_count - 2}</Badge>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Priority</span>
                <span className="font-medium">{(component.priority_score * 100).toFixed(0)}%</span>
              </div>
              <Progress value={component.priority_score * 100} className="h-1.5" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={isProcessing}
              className="gradient-primary"
            >
              {isProcessing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3 h-3" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              disabled={isProcessing}
              className="text-destructive hover:bg-destructive/10"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}