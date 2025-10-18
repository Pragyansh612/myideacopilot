"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Plus, Edit2, Trash2, CheckCircle2, Circle, Save, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhaseAPI, FeatureAPI, AIAPI, type Phase, type Feature, type PriorityEnum, type SuggestedItem } from "@/lib/api/idea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<SuggestedItem[]>([])
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [selectedSuggestionForCreation, setSelectedSuggestionForCreation] = useState<SuggestedItem | null>(null)
  const [showCreateFeatureDialog, setShowCreateFeatureDialog] = useState(false)
  const [creationFormData, setCreationFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as PriorityEnum,
  })
  const [lastGeneratedTime, setLastGeneratedTime] = useState<Date | null>(null)

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

      await loadAISuggestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load phase")
    } finally {
      setIsLoading(false)
    }
  }

  const loadAISuggestions = async () => {
    try {
      const suggestions = await AIAPI.getSuggestions(ideaId)
      const featureSuggestions = suggestions.filter(s => s.suggestion_type === "features")

      if (featureSuggestions.length > 0) {
        const content = typeof featureSuggestions[0].content === 'string'
          ? JSON.parse(featureSuggestions[0].content)
          : featureSuggestions[0].content

        const items = Array.isArray(content) ? content : [content]
        const parsedSuggestions = items.map(item => ({
          title: item.title,
          description: item.description,
          priority: item.priority || "medium",
          type: "feature" as const
        }))

        setAiSuggestions(parsedSuggestions)
        setLastGeneratedTime(new Date(featureSuggestions[0].created_at))
      } else {
        setAiSuggestions([])
        setLastGeneratedTime(null)
      }
    } catch (err) {
      setAiSuggestions([])
      setLastGeneratedTime(null)
    }
  }

  const handleGenerateAISuggestions = async () => {
    if (!phase) return

    try {
      setIsLoadingAI(true)

      const context = `Generate feature suggestions for the phase "${phase.name}"`

      await AIAPI.generateSuggestions({
        idea_id: ideaId,
        suggestion_type: "features",
        context,
      })

      await loadAISuggestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate suggestions")
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleCreateFeatureFromSuggestion = async () => {
    if (!selectedSuggestionForCreation || !creationFormData.title.trim()) return

    try {
      await FeatureAPI.createFeatureForPhase(phaseId, {
        title: creationFormData.title,
        description: creationFormData.description,
        priority: creationFormData.priority,
      })

      // Remove from suggestions
      setAiSuggestions(prev => 
        prev.filter(s => s.title !== selectedSuggestionForCreation.title)
      )

      // Reset form
      setShowCreateFeatureDialog(false)
      setSelectedSuggestionForCreation(null)
      setCreationFormData({ title: "", description: "", priority: "medium" })

      await loadPhaseData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create feature")
    }
  }

  const openCreateDialog = (suggestion: SuggestedItem) => {
    setSelectedSuggestionForCreation(suggestion)
    setCreationFormData({
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority as PriorityEnum,
    })
    setShowCreateFeatureDialog(true)
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
        <div className="p-4 md:p-6 mx-auto">
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
      <div className="p-4 md:p-6 mx-auto space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowNewFeature(!showNewFeature)}
            className="gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </Button>
          <Button
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            disabled={isLoadingAI}
            variant="outline"
          >
            {isLoadingAI ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {showAISuggestions ? "Hide" : "Show"} AI Suggestions
              </>
            )}
          </Button>
        </div>

        {/* AI Suggestions Panel */}
        {showAISuggestions && (
          <Card className="glass border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>AI Feature Suggestions</CardTitle>
                  <CardDescription>
                    {aiSuggestions.length === 0
                      ? "Generate AI suggestions to get feature ideas for this phase"
                      : `${aiSuggestions.length} suggestion${aiSuggestions.length !== 1 ? 's' : ''} available`
                    }
                  </CardDescription>
                  {lastGeneratedTime && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Generated {lastGeneratedTime.toLocaleDateString()} at {lastGeneratedTime.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleGenerateAISuggestions}
                  disabled={isLoadingAI}
                  size="sm"
                  className="gradient-primary"
                >
                  {isLoadingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {aiSuggestions.length > 0 ? "Generate More" : "Generate"}
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            {aiSuggestions.length > 0 && (
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {aiSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg glass-strong border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer"
                      onClick={() => openCreateDialog(suggestion)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                            {suggestion.title}
                          </h4>
                          {suggestion.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {suggestion.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge
                            variant={
                              suggestion.priority === 'high' ? 'default' :
                              suggestion.priority === 'medium' ? 'secondary' :
                              'outline'
                            }
                            className="text-xs"
                          >
                            {suggestion.priority}
                          </Badge>
                          <Button
                            size="sm"
                            className="gradient-primary h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              openCreateDialog(suggestion)
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}

            {aiSuggestions.length === 0 && (
              <CardContent className="p-8 text-center">
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No suggestions yet</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Click "Generate" to get AI-powered feature ideas</p>
              </CardContent>
            )}
          </Card>
        )}

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

      {/* Create Feature from Suggestion Dialog */}
      <Dialog open={showCreateFeatureDialog} onOpenChange={setShowCreateFeatureDialog}>
        <DialogContent className="glass max-w-md">
          <DialogHeader>
            <DialogTitle>Create Feature</DialogTitle>
            <DialogDescription>
              Create a new feature from this AI suggestion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm font-medium line-clamp-2">{selectedSuggestionForCreation?.title}</p>
              {selectedSuggestionForCreation?.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                  {selectedSuggestionForCreation.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Feature Title</label>
              <Input
                placeholder="Feature name"
                value={creationFormData.title}
                onChange={(e) => setCreationFormData({
                  ...creationFormData,
                  title: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Add more details..."
                value={creationFormData.description}
                onChange={(e) => setCreationFormData({
                  ...creationFormData,
                  description: e.target.value
                })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={creationFormData.priority} onValueChange={(value) => setCreationFormData({
                ...creationFormData,
                priority: value as PriorityEnum
              })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateFeatureFromSuggestion}
                className="gradient-primary flex-1"
                disabled={!creationFormData.title.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateFeatureDialog(false)}
              >
                Cancel
              </Button>
            </div>
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
              <Button
              onClick={onSave}
                className="gradient-primary"
                size="sm"
              >
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