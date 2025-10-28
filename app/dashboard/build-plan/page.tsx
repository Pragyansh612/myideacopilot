"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Loader2, Package, Sparkles, Clock, TrendingUp,
  CheckCircle2, X, ArrowRight, BarChart3, Zap, Code
} from "lucide-react"
import Link from "next/link"
import { AutoDetectionAPI, type BuildPlan, type CommonComponent } from "@/lib/api/idea"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function BuildPlanPage() {
  const router = useRouter()
  const [buildPlan, setBuildPlan] = useState<BuildPlan | null>(null)
  const [components, setComponents] = useState<CommonComponent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError(err instanceof Error ? err.message : "Failed to load build plan")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true)
      setError(null)
      await AutoDetectionAPI.analyzeAllIdeas()
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze ideas")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAcceptSuggestion = async (suggestionId: string) => {
    try {
      // Optimistic update - update UI immediately
      setComponents(prev => 
        prev.map(c => c.id === suggestionId ? { ...c, is_accepted: true } : c)
      )
      
      // Then make the API call
      await AutoDetectionAPI.acceptSuggestion(suggestionId)
    } catch (err) {
      // Revert on error
      setComponents(prev => 
        prev.map(c => c.id === suggestionId ? { ...c, is_accepted: false } : c)
      )
      setError(err instanceof Error ? err.message : "Failed to accept suggestion")
    }
  }

  const handleDismissSuggestion = async (suggestionId: string) => {
    try {
      // Optimistic update - remove from UI immediately
      setComponents(prev => prev.filter(c => c.id !== suggestionId))
      
      // Then make the API call
      await AutoDetectionAPI.dismissSuggestion(suggestionId)
    } catch (err) {
      // Reload on error
      await loadData()
      setError(err instanceof Error ? err.message : "Failed to dismiss suggestion")
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
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="glass">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <Card className="glass">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
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
    <div className="p-4 md:p-6 space-y-6">
{/* Header */}
<div className="space-y-4">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => router.push('/dashboard/ideas')}
    className="mb-2"
  >
    <ArrowLeft className="w-4 h-4 mr-2" />
    Back to Ideas
  </Button>
  
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-3xl font-bold">Build Plan Optimizer</h1>
      <p className="text-muted-foreground mt-2">
        AI-powered strategy to build reusable components and accelerate development
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
          Re-analyze Ideas
        </>
      )}
    </Button>
  </div>
</div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      {(buildPlan || components.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Build Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{buildPlan?.total_steps || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Optimized components to build
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {buildPlan?.estimated_timeline || '—'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated completion time
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {acceptedComponents.length}/{components.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Accepted reusable components
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for different views */}
      {(buildPlan || components.length > 0) && (
        <Tabs defaultValue="strategy" className="space-y-4">
          <TabsList className="glass">
            <TabsTrigger value="strategy" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Build Strategy
            </TabsTrigger>
            <TabsTrigger value="components" className="gap-2">
              <Package className="w-4 h-4" />
              Components ({pendingComponents.length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Accepted ({acceptedComponents.length})
            </TabsTrigger>
          </TabsList>

          {/* Build Strategy Tab */}
          <TabsContent value="strategy" className="space-y-4">
            {buildPlan && buildPlan.total_steps > 0 ? (
              <Card className="glass border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <CardTitle>Optimized Build Strategy</CardTitle>
                  </div>
                  <CardDescription>{buildPlan.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {buildPlan.steps.map((step, index) => (
                    <div
                      key={step.step_number}
                      className="relative pl-12 pb-6 last:pb-0"
                    >
                      {/* Timeline Line */}
                      {index < buildPlan.steps.length - 1 && (
                        <div className="absolute left-[23px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-border" />
                      )}
                      
                      {/* Step Number Badge */}
                      <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold text-primary border-2 border-primary/30 shadow-lg shadow-primary/20">
                        {step.step_number}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="text-2xl">
                                {getComponentTypeIcon(step.component_type)}
                              </span>
                              <h3 className="text-xl font-semibold">{step.component_name}</h3>
                              <Badge className={`${getPriorityColor(step.priority)} border`}>
                                {step.priority}
                              </Badge>
                              {step.estimated_effort && (
                                <Badge variant="secondary" className="gap-1">
                                  <Clock className="w-3 h-3" />
                                  {step.estimated_effort}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        {/* Reason */}
                        <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 p-4 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-sm mb-1">Why build this first?</p>
                            <p className="text-sm text-muted-foreground">{step.reason}</p>
                          </div>
                        </div>

                        {/* Enables Ideas */}
                        {step.enables_ideas.length > 0 && (
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-muted-foreground">Unlocks:</span>
                            {step.enables_ideas.map((ideaTitle) => (
                              <Badge key={ideaTitle} variant="outline" className="gap-1">
                                <ArrowRight className="w-3 h-3" />
                                {ideaTitle}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Build Strategy Yet</h3>
                  <p className="text-muted-foreground">
                    Analyze your ideas to get an optimized build strategy
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pending Components Tab */}
          <TabsContent value="components" className="space-y-4">
            {pendingComponents.length > 0 ? (
              <div className="space-y-4">
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
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    You've reviewed all component suggestions
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Accepted Components Tab */}
          <TabsContent value="accepted" className="space-y-4">
            {acceptedComponents.length > 0 ? (
              <div className="space-y-4">
                {acceptedComponents.map((component) => (
                  <AcceptedComponentCard
                    key={component.id}
                    component={component}
                    getComponentTypeIcon={getComponentTypeIcon}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Accepted Components</h3>
                  <p className="text-muted-foreground">
                    Review component suggestions to start building
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {!buildPlan && components.length === 0 && !isLoading && (
        <Card className="glass">
          <CardContent className="p-16 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">No Build Plan Yet</h3>
                <p className="text-muted-foreground">
                  Create at least 2 ideas, then analyze them to discover reusable components 
                  and get an AI-powered build strategy.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={handleAnalyze} 
                  className="gradient-primary"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Ideas
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  size="lg"
                >
                  <Link href="/dashboard/ideas">
                    View All Ideas
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary font-bold text-lg">1</span>
            </div>
            <p className="font-medium text-foreground">AI Analysis</p>
            <p className="text-muted-foreground">
              Analyzes all your ideas to find common technologies, patterns, and dependencies
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary font-bold text-lg">2</span>
            </div>
            <p className="font-medium text-foreground">Component Detection</p>
            <p className="text-muted-foreground">
              Identifies reusable components like authentication, payments, or APIs
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary font-bold text-lg">3</span>
            </div>
            <p className="font-medium text-foreground">Build Strategy</p>
            <p className="text-muted-foreground">
              Suggests optimal build order to maximize code reuse and efficiency
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Component Card Component
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
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDismissing, setIsDismissing] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    await onAccept(component.id)
    setIsAccepting(false)
  }

  const handleDismiss = async () => {
    setIsDismissing(true)
    await onDismiss(component.id)
    setIsDismissing(false)
  }

  return (
    <Card className="glass hover:glass-strong transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getComponentTypeIcon(component.component_type)}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{component.component_name}</h4>
                <Badge variant="secondary" className="text-xs mt-1">
                  Priority #{component.suggested_order}
                </Badge>
              </div>
            </div>

            {component.description && (
              <p className="text-sm text-muted-foreground">{component.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                Used in {component.usage_count} ideas:
              </span>
            </div>
            <div className="flex flex-wrap gap-2 ml-6">
              {component.used_in_ideas.map((idea: any) => (
                <Link key={idea.id} href={`/dashboard/ideas/${idea.id}`}>
                  <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
                    {idea.title}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Priority Score</span>
                <span className="font-medium">{(component.priority_score * 100).toFixed(0)}%</span>
              </div>
              <Progress value={component.priority_score * 100} className="h-2" />
            </div>

            {component.estimated_effort && (
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                {component.estimated_effort}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={isAccepting || isDismissing}
              className="gradient-primary"
            >
              {isAccepting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              disabled={isAccepting || isDismissing}
              className="text-destructive hover:bg-destructive/10"
            >
              {isDismissing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Dismiss
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Accepted Component Card
function AcceptedComponentCard({ 
  component, 
  getComponentTypeIcon 
}: {
  component: any
  getComponentTypeIcon: (type: string) => string
}) {
  return (
    <Card className="glass border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getComponentTypeIcon(component.component_type)}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{component.component_name}</h4>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Priority #{component.suggested_order}
                  </Badge>
                  <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Accepted
                  </Badge>
                </div>
              </div>
            </div>

            {component.description && (
              <p className="text-sm text-muted-foreground">{component.description}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {component.used_in_ideas.map((idea: any) => (
                <Link key={idea.id} href={`/dashboard/ideas/${idea.id}`}>
                  <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
                    {idea.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}