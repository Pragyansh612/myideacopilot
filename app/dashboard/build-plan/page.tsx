"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Loader2, Package, Sparkles, Clock, TrendingUp,
  CheckCircle2, X, ArrowRight, BarChart3
} from "lucide-react"
import Link from "next/link"
import { AutoDetectionAPI, type BuildPlan, type CommonComponent } from "@/lib/api/idea"

export default function BuildPlanPage() {
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
      const result = await AutoDetectionAPI.analyzeAllIdeas()
      await loadData()
      
      // Show success message
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze ideas")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAcceptSuggestion = async (suggestionId: string) => {
    try {
      await AutoDetectionAPI.acceptSuggestion(suggestionId)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept suggestion")
    }
  }

  const handleDismissSuggestion = async (suggestionId: string) => {
    try {
      await AutoDetectionAPI.dismissSuggestion(suggestionId)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to dismiss suggestion")
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
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
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
              Analyze All Ideas
            </>
          )}
        </Button>
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
                Reusable Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{components.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Components used across ideas
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Build Plan */}
      {buildPlan && buildPlan.total_steps > 0 && (
        <Card className="glass border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
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
                  <div className="absolute left-[23px] top-12 bottom-0 w-0.5 bg-border" />
                )}
                
                {/* Step Number Badge */}
                <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary border-2 border-primary/20">
                  {step.step_number}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {getComponentTypeIcon(step.component_type)}
                        </span>
                        <h3 className="text-xl font-semibold">{step.component_name}</h3>
                        <Badge className={getPriorityColor(step.priority)}>
                          {step.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">Why build this first?</p>
                      <p className="text-sm text-muted-foreground">{step.reason}</p>
                    </div>
                  </div>

                  {/* Enables Ideas */}
                  {step.enables_ideas.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Enables these ideas:</p>
                      <div className="flex flex-wrap gap-2">
                        {step.enables_ideas.map((ideaTitle) => (
                          <Badge key={ideaTitle} variant="outline">
                            <ArrowRight className="w-3 h-3 mr-1" />
                            {ideaTitle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Effort */}
                  {step.estimated_effort && (
                    <Badge variant="secondary">
                      <Clock className="w-4 h-4 mr-2" />
                      {step.estimated_effort}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Common Components */}
      {components.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Reusable Components</CardTitle>
            <CardDescription>
              Build these components once and use them across multiple ideas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {components.map((component) => (
              <div
                key={component.id}
                className="p-5 rounded-lg glass-strong border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getComponentTypeIcon(component.component_type)}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{component.component_name}</h4>
                        <Badge variant="secondary" className="text-xs mt-1">
                          Build Priority #{component.suggested_order}
                        </Badge>
                      </div>
                    </div>

                    {component.description && (
                      <p className="text-sm text-muted-foreground">
                        {component.description}
                      </p>
                    )}

                    {/* Usage Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-medium">
                          Used in {component.usage_count} ideas:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-6">
                        {component.used_in_ideas.map((idea) => (
                          <Link
                            key={idea.id}
                            href={`/dashboard/ideas/${idea.id}`}
                          >
                            <Badge 
                              variant="outline" 
                              className="hover:bg-primary/10 transition-colors cursor-pointer"
                            >
                              {idea.title}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Priority Score */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Priority Score</span>
                        <span className="font-medium">
                          {(component.priority_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={component.priority_score * 100} 
                        className="h-2"
                      />
                    </div>

                    {component.estimated_effort && (
                      <Badge variant="outline">
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
                          onClick={() => handleAcceptSuggestion(component.id)}
                          className="gradient-primary"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismissSuggestion(component.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Dismiss
                        </Button>
                      </>
                    ) : (
                      <Badge variant="secondary" className="px-3 py-2">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
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
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground">AI Analysis</p>
              <p>Our AI analyzes all your ideas to find common technologies and patterns</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Component Detection</p>
              <p>Identifies reusable components like web scraping, authentication, or payment systems</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Optimized Strategy</p>
              <p>Suggests building order to maximize efficiency and code reuse across projects</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}