"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, CheckCircle2, Circle, Target } from "lucide-react"
import { PhaseAPI, FeatureAPI, type Phase, type Feature } from "@/lib/api/idea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

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
  const [newFeaturePriority, setNewFeaturePriority] = useState<"low" | "medium" | "high">("medium")
  const [showAssignFeatureDialog, setShowAssignFeatureDialog] = useState(false)
  const [selectedFeatureToAssign, setSelectedFeatureToAssign] = useState<string | null>(null)
  const [selectedPhaseForAssignment, setSelectedPhaseForAssignment] = useState<string | null>(null)
  const router = useRouter()

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
          priority: newFeaturePriority,
        })
      } else {
        await FeatureAPI.createFeatureForIdea(ideaId, {
          title: newFeatureTitle,
          description: newFeatureDescription || undefined,
          priority: newFeaturePriority,
        })
      }
      setNewFeatureTitle("")
      setNewFeatureDescription("")
      setNewFeaturePriority("medium")
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

  const handleAssignFeatureToPhase = async () => {
    if (!selectedFeatureToAssign || !selectedPhaseForAssignment) return

    try {
      await FeatureAPI.updateFeature(selectedFeatureToAssign, {
        phase_id: selectedPhaseForAssignment,
      })
      setShowAssignFeatureDialog(false)
      setSelectedFeatureToAssign(null)
      setSelectedPhaseForAssignment(null)
      onUpdate()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to assign feature to phase")
    }
  }

  const unassignedFeatures = features.filter((f) => !f.phase_id)

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
            <Card
              key={phase.id}
              className="glass hover:glass-strong transition-all cursor-pointer group"
              onClick={() => router.push(`/dashboard/ideas/${ideaId}/phases/${phase.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTogglePhaseComplete(phase)
                      }}
                      className="mt-1 flex-shrink-0"
                    >
                      {phase.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <CardTitle
                        className={`group-hover:text-primary transition-colors ${
                          phase.is_completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {phase.name}
                      </CardTitle>
                      {phase.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {phase.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Quick Feature Count */}
              <CardContent className="px-6 pb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{features.filter(f => f.phase_id === phase.id).length} features</span>
                  <span>•</span>
                  <span>
                    {features.filter(f => f.phase_id === phase.id && f.is_completed).length} completed
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Unassigned Features */}
      {unassignedFeatures.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Unassigned Features</CardTitle>
            <CardDescription>Features not yet assigned to a phase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {unassignedFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-start gap-3 p-3 rounded-lg glass-strong group hover:glass-strong transition-all"
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
                  <p
                    className={`text-sm font-medium ${
                      feature.is_completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {feature.title}
                  </p>
                  {feature.description && (
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant="secondary" className="text-xs">
                    {feature.priority}
                  </Badge>
                  {phases.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFeatureToAssign(feature.id)
                        setShowAssignFeatureDialog(true)
                      }}
                      className="text-xs"
                    >
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Feature Without Phase */}
      {!showNewFeature && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowNewFeature("no-phase")}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feature (No Phase)
          </Button>
        </div>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={newFeaturePriority}
                onValueChange={(value) => setNewFeaturePriority(value as "low" | "medium" | "high")}
              >
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Assign Feature to Phase Dialog */}
      <Dialog open={showAssignFeatureDialog} onOpenChange={setShowAssignFeatureDialog}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Assign Feature to Phase</DialogTitle>
            <DialogDescription>Select a phase to assign this feature</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Phase</label>
              <Select value={selectedPhaseForAssignment || ""} onValueChange={setSelectedPhaseForAssignment}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Choose a phase..." />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAssignFeatureDialog(false)
                  setSelectedFeatureToAssign(null)
                  setSelectedPhaseForAssignment(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignFeatureToPhase}
                disabled={!selectedPhaseForAssignment}
                className="gradient-primary"
              >
                Assign Feature
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}