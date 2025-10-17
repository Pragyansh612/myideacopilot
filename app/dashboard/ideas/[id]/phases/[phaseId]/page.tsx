"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Plus, Edit2, Trash2, CheckCircle2, Circle, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhaseAPI, FeatureAPI, IdeaAPI, type Phase, type Feature, type PriorityEnum } from "@/lib/api/idea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"

export default function PhaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ideaId = params.id as string
  const phaseId = params.phaseId as string

  const [phase, setPhase] = useState<Phase | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPhase, setEditedPhase] = useState<Partial<Phase>>({})
  const [showNewFeature, setShowNewFeature] = useState(false)
  const [newFeatureTitle, setNewFeatureTitle] = useState("")
  const [newFeatureDescription, setNewFeatureDescription] = useState("")
  const [newFeaturePriority, setNewFeaturePriority] = useState<PriorityEnum>("medium")
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [deletingFeatureId, setDeletingFeatureId] = useState<string | null>(null)

  useEffect(() => {
    loadPhaseData()
  }, [phaseId])

  const loadPhaseData = async () => {
    try {
      setIsLoading(true)
      const phaseData = await PhaseAPI.getPhases(ideaId)
      const currentPhase = phaseData.find(p => p.id === phaseId)
      
      if (!currentPhase) {
        setError("Phase not found")
        return
      }

      setPhase(currentPhase)
      setEditedPhase(currentPhase)

      const allFeatures = await FeatureAPI.getFeatures(ideaId)
      const phaseFeatures = allFeatures.filter(f => f.phase_id === phaseId)
      setFeatures(phaseFeatures)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load phase")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePhase = async () => {
    if (!phase) return

    try {
      await PhaseAPI.updatePhase(phase.id, {
        name: editedPhase.name || phase.name,
        description: editedPhase.description,
      })
      setPhase({ ...phase, ...editedPhase })
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update phase")
    }
  }

  const handleTogglePhaseComplete = async () => {
    if (!phase) return

    try {
      await PhaseAPI.updatePhase(phase.id, {
        is_completed: !phase.is_completed,
      })
      setPhase({ ...phase, is_completed: !phase.is_completed })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update phase")
    }
  }

  const handleCreateFeature = async () => {
    if (!newFeatureTitle.trim()) return

    try {
      await FeatureAPI.createFeatureForPhase(phaseId, {
        title: newFeatureTitle,
        description: newFeatureDescription || undefined,
        priority: newFeaturePriority,
      })
      setNewFeatureTitle("")
      setNewFeatureDescription("")
      setNewFeaturePriority("medium")
      setShowNewFeature(false)
      await loadPhaseData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create feature")
    }
  }

  const handleUpdateFeature = async (feature: Feature) => {
    if (!editingFeature) return

    try {
      await FeatureAPI.updateFeature(feature.id, {
        title: editingFeature.title,
        description: editingFeature.description,
        priority: editingFeature.priority,
        is_completed: editingFeature.is_completed,
      })
      setEditingFeature(null)
      await loadPhaseData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update feature")
    }
  }

  const handleToggleFeatureComplete = async (feature: Feature) => {
    try {
      await FeatureAPI.updateFeature(feature.id, {
        is_completed: !feature.is_completed,
      })
      await loadPhaseData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update feature")
    }
  }

  const handleDeleteFeature = async (featureId: string) => {
    try {
      await FeatureAPI.deleteFeature(featureId)
      setDeletingFeatureId(null)
      await loadPhaseData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete feature")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!phase) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
        <div className="mt-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error || "Phase not found"}
        </div>
      </div>
    )
  }

  const completedFeatures = features.filter(f => f.is_completed).length
  const totalFeatures = features.length
  const completionPercentage = totalFeatures === 0 ? 0 : Math.round((completedFeatures / totalFeatures) * 100)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Idea
          </Button>

          <div className="space-y-4">
            {/* Phase Header */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={handleTogglePhaseComplete}
                    className="mt-1 flex-shrink-0"
                  >
                    {phase.is_completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={editedPhase.name || phase.name}
                        onChange={(e) => setEditedPhase({ ...editedPhase, name: e.target.value })}
                        className="text-2xl font-bold glass mb-2"
                      />
                    ) : (
                      <h1 className={`text-3xl font-bold ${phase.is_completed ? "line-through text-muted-foreground" : ""}`}>
                        {phase.name}
                      </h1>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSavePhase} className="gradient-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <Textarea
                  value={editedPhase.description || phase.description || ""}
                  onChange={(e) => setEditedPhase({ ...editedPhase, description: e.target.value })}
                  placeholder="Phase description..."
                  rows={3}
                  className="glass"
                />
              ) : (
                <p className="text-muted-foreground">
                  {phase.description || "No description provided"}
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{completedFeatures}/{totalFeatures} features</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-primary/50 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{completionPercentage}% complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Feature Section */}
        <div>
          <Button
            onClick={() => setShowNewFeature(!showNewFeature)}
            className="gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </Button>
        </div>

        {/* New Feature Form */}
        {showNewFeature && (
          <Card className="glass border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Feature Title</label>
                <Input
                  placeholder="e.g., User authentication setup"
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
                <Select value={newFeaturePriority} onValueChange={(value) => setNewFeaturePriority(value as PriorityEnum)}>
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
                <Button onClick={handleCreateFeature} className="gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Create Feature
                </Button>
                <Button variant="outline" onClick={() => setShowNewFeature(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features List */}
        {features.length === 0 ? (
          <Card className="glass">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No features yet</h3>
              <p className="text-muted-foreground">Add your first feature to break down this phase into actionable items</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Completed Features */}
            {features.filter(f => f.is_completed).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Completed ({completedFeatures})</h3>
                {features
                  .filter(f => f.is_completed)
                  .map((feature) => (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      isEditing={editingFeature?.id === feature.id}
                      editingFeature={editingFeature}
                      onToggleComplete={() => handleToggleFeatureComplete(feature)}
                      onEdit={() => setEditingFeature(feature)}
                      onSave={() => handleUpdateFeature(feature)}
                      onCancel={() => setEditingFeature(null)}
                      onDelete={() => setDeletingFeatureId(feature.id)}
                      onEditChange={setEditingFeature}
                    />
                  ))}
              </div>
            )}

            {/* Active Features */}
            {features.filter(f => !f.is_completed).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Active ({features.filter(f => !f.is_completed).length})</h3>
                {features
                  .filter(f => !f.is_completed)
                  .map((feature) => (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      isEditing={editingFeature?.id === feature.id}
                      editingFeature={editingFeature}
                      onToggleComplete={() => handleToggleFeatureComplete(feature)}
                      onEdit={() => setEditingFeature(feature)}
                      onSave={() => handleUpdateFeature(feature)}
                      onCancel={() => setEditingFeature(null)}
                      onDelete={() => setDeletingFeatureId(feature.id)}
                      onEditChange={setEditingFeature}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingFeatureId} onOpenChange={(open) => !open && setDeletingFeatureId(null)}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Delete Feature?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The feature will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeletingFeatureId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingFeatureId && handleDeleteFeature(deletingFeatureId)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Feature Card Component
interface FeatureCardProps {
  feature: Feature
  isEditing: boolean
  editingFeature: Feature | null
  onToggleComplete: () => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
  onEditChange: (feature: Feature) => void
}

function FeatureCard({
  feature,
  isEditing,
  editingFeature,
  onToggleComplete,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditChange,
}: FeatureCardProps) {
  return (
    <Card className={`glass transition-all ${feature.is_completed ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        {isEditing && editingFeature ? (
          // Edit Mode
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editingFeature.title}
                onChange={(e) => onEditChange({ ...editingFeature, title: e.target.value })}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editingFeature.description || ""}
                onChange={(e) => onEditChange({ ...editingFeature, description: e.target.value })}
                rows={2}
                className="glass resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={editingFeature.priority} onValueChange={(value) => onEditChange({ ...editingFeature, priority: value as PriorityEnum })}>
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
              <Button onClick={onSave} className="gradient-primary" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="flex items-start gap-3">
            <button
              onClick={onToggleComplete}
              className="mt-1 flex-shrink-0"
            >
              {feature.is_completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
              )}
            </button>
            <div className="flex-1">
              <h4 className={`font-medium ${feature.is_completed ? "line-through text-muted-foreground" : ""}`}>
                {feature.title}
              </h4>
              {feature.description && (
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant={
                  feature.priority === 'high' ? 'default' :
                  feature.priority === 'medium' ? 'secondary' :
                  'outline'
                }
                className="text-xs"
              >
                {feature.priority}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}