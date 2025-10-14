"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Loader2, ExternalLink, CheckCircle2, X, Zap } from "lucide-react"
import { CompetitorAPI } from "@/lib/api/idea"
import { EmptyState } from "@/components/empty-state"

interface CompetitorTabProps {
  ideaId: string
  competitorData: any
  onUpdate: () => void
  onError: (error: string) => void
}

export function CompetitorTab({ ideaId, competitorData, onUpdate, onError }: CompetitorTabProps) {
  const [competitorUrls, setCompetitorUrls] = useState("")
  const [isScrapingCompetitors, setIsScrapingCompetitors] = useState(false)

  const handleScrapeCompetitors = async () => {
    const urls = competitorUrls.split('\n').filter(url => url.trim())
    if (urls.length === 0) return

    try {
      setIsScrapingCompetitors(true)
      await CompetitorAPI.scrapeCompetitors({
        idea_id: ideaId,
        urls,
        analyze: true,
      })
      setCompetitorUrls("")
      onUpdate()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to scrape competitors")
    } finally {
      setIsScrapingCompetitors(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Input Form */}
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

      {/* Results */}
      {competitorData && competitorData.research && competitorData.research.length > 0 ? (
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
      ) : (
        <EmptyState
          icon={Users}
          title="No competitor research yet"
          description="Add competitor URLs to analyze their strengths, weaknesses, and find differentiation opportunities"
          illustration="🔍"
        />
      )}
    </div>
  )
}