"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, CheckCircle2, Circle, Target } from "lucide-react"
import { PhaseAPI, FeatureAPI, type Phase, type Feature, type PriorityEnum } from "@/lib/api/idea"

interface PhasesTabProps {
  ideaId: string
  phases: Phase[]
  features: Feature[]
  onUpdate: () => void
  onError: (error: string) => void
}

export function PhasesTab({ ideaId, phases, features, onUpdate, onError }: PhasesTabProps) {
  const [showNewPhase, setShowNewPhase] = useState(false)
  const [newPhaseName, setNewPhaseName] = useState("")
  const [newPhaseDescription, setNewPhaseDescription] = useState("")
  const [showNewFeature, setShowNewFeature] = useState<string | null>(null)
  const [newFeatureTitle, setNewFeatureTitle] = useState("")
  const [newFeatureDescription, setNewFeatureDescription] = useState("")

  const handleCreatePhase = async () => {
    if (!newPhaseName.trim()) return

    try {
      await PhaseAPI.createPhase(ideaId, {
        name: newPhaseName,
        description: newPhaseDescription || undefined,
        order_index: phases.length,
      })
      setNewPhaseName("")
      setNewPhaseDescription("")
      setShowNewPhase(false)
      onUpdate()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create phase")
    }
  }

  const handleTogglePhaseComplete = async (phase: Phase) => {
    try {
      await PhaseAPI.updatePhase(phase.id, {
        is_completed: !phase.is_completed,
      })
      onUpdate()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update phase")
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
      onUpdate()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create feature")
    }
  }

  const handleToggleFeatureComplete = async (feature: Feature) => {
    try {
      await FeatureAPI.updateFeature(feature.id, {
        is_completed: !feature.is_completed,
      })
      onUpdate()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update feature")
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Phases & Features</h3>
          <p className="text-sm text-muted-foreground">Break down your idea into actionable phases</p>
        </div>
        <Button onClick={() => setShowNewPhase(true)} className="gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Phase
        </Button>
      </div>

      {/* New Phase Form */}
      {showNewPhase && (
        <Card className="glass border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phase Name</label>
              <Input
                placeholder="e.g., MVP Development"
                value={newPhaseName}
                onChange={(e) => setNewPhaseName(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Describe this phase..."
                value={newPhaseDescription}
                onChange={(e) => setNewPhaseDescription(e.target.value)}
                rows={3}
                className="glass resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreatePhase} className="gradient-primary">
                <Save className="w-4 h-4 mr-2" />
                Create Phase
              </Button>
              <Button variant="outline" onClick={() => setShowNewPhase(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phases List */}
      {phases.length === 0 && !showNewPhase ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No phases yet</h3>
            <p className="text-muted-foreground mb-4">Create phases to organize your idea development</p>
            <Button onClick={() => setShowNewPhase(true)} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create First Phase
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {phases.map((phase) => (
            <Card key={phase.id} className="glass">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleTogglePhaseComplete(phase)}
                      className="mt-1 flex-shrink-0"
                    >
                      {phase.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <CardTitle className={phase.is_completed ? "line-through text-muted-foreground" : ""}>
                        {phase.name}
                      </CardTitle>
                      {phase.description && (
                        <CardDescription className="mt-1">{phase.description}</CardDescription>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewFeature(phase.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Feature
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {/* New Feature Form */}
                {showNewFeature === phase.id && (
                  <div className="p-4 rounded-lg glass-strong border border-primary/20 space-y-3">
                    <Input
                      placeholder="Feature title"
                      value={newFeatureTitle}
                      onChange={(e) => setNewFeatureTitle(e.target.value)}
                      className="glass"
                    />
                    <Textarea
                      placeholder="Feature description (optional)"
                      value={newFeatureDescription}
                      onChange={(e) => setNewFeatureDescription(e.target.value)}
                      rows={2}
                      className="glass resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleCreateFeature(phase.id)}
                        className="gradient-primary"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowNewFeature(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Existing Features */}
                {features
                  .filter((f) => f.phase_id === phase.id)
                  .map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-start gap-3 p-3 rounded-lg glass-strong"
                    >
                      <button
                        onClick={() => handleToggleFeatureComplete(feature)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {feature.is_completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${feature.is_completed ? "line-through text-muted-foreground" : ""}`}>
                          {feature.title}
                        </p>
                        {feature.description && (
                          <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.priority}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Unassigned Features */}
      {features.filter((f) => !f.phase_id).length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Unassigned Features</CardTitle>
            <CardDescription>Features not yet assigned to a phase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {features
              .filter((f) => !f.phase_id)
              .map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start gap-3 p-3 rounded-lg glass-strong"
                >
                  <button
                    onClick={() => handleToggleFeatureComplete(feature)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {feature.is_completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${feature.is_completed ? "line-through text-muted-foreground" : ""}`}>
                      {feature.title}
                    </p>
                    {feature.description && (
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.priority}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Add Feature Without Phase */}
      {!showNewFeature && (
        <Button
          variant="outline"
          onClick={() => setShowNewFeature("no-phase")}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Feature (No Phase)
        </Button>
      )}

      {/* New Feature Form (No Phase) */}
      {showNewFeature === "no-phase" && (
        <Card className="glass border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Feature Title</label>
              <Input
                placeholder="e.g., User authentication"
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Describe this feature..."
                value={newFeatureDescription}
                onChange={(e) => setNewFeatureDescription(e.target.value)}
                rows={3}
                className="glass resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleCreateFeature(undefined)} className="gradient-primary">
                <Save className="w-4 h-4 mr-2" />
                Create Feature
              </Button>
              <Button variant="outline" onClick={() => setShowNewFeature(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}