"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Idea } from "@/lib/api/idea"

interface DetailsTabProps {
  idea: Idea
}

export function DetailsTab({ idea }: DetailsTabProps) {
  return (
    <div className="space-y-4">
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
    </div>
  )
}