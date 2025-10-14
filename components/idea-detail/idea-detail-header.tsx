"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ArrowLeft, Edit2, Trash2, Save, X, Loader2 } from "lucide-react"
import { IdeaAPI, type Idea, type IdeaUpdate } from "@/lib/api/idea"

interface IdeaDetailHeaderProps {
  idea: Idea
  onUpdate: () => void
  onDelete: () => void
  onError: (error: string) => void
}

export function IdeaDetailHeader({ idea, onUpdate, onDelete, onError }: IdeaDetailHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editTitle, setEditTitle] = useState(idea.title)
  const [editDescription, setEditDescription] = useState(idea.description || "")

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true)
      const updateData: IdeaUpdate = {
        title: editTitle,
        description: editDescription,
      }
      await IdeaAPI.updateIdea(idea.id, updateData)
      await onUpdate()
      setIsEditing(false)
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update idea")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(idea.title)
    setEditDescription(idea.description || "")
    setIsEditing(false)
  }

  return (
    <>
      <PageHeader
        title={isEditing ? "Edit Idea" : idea.title}
        description={undefined}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/ideas">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving} className="gradient-primary">
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      {isEditing && (
        <div className="p-4 md:p-6">
          <Card className="glass-strong">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-lg font-medium glass"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={6}
                  className="glass resize-none"
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          setShowDeleteDialog(false)
          onDelete()
        }}
        title="Delete Idea"
        description="Are you sure you want to delete this idea? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  )
}