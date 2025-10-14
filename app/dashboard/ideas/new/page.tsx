"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X, Plus, Sparkles, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { IdeaAPI, CategoryAPI, type IdeaCreate, type Category, type PriorityEnum } from "@/lib/api/idea"

const suggestedTags = [
  "AI",
  "Mobile App",
  "Web App",
  "Business",
  "Technology",
  "Innovation",
  "Sustainability",
  "Education",
  "Health",
  "Finance",
  "Entertainment",
  "Social",
  "Productivity",
  "Design",
  "Marketing",
  "Research",
]

export default function NewIdeaPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [priority, setPriority] = useState<PriorityEnum>("medium")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [effortScore, setEffortScore] = useState<number | "">("")
  const [impactScore, setImpactScore] = useState<number | "">("")
  const [interestScore, setInterestScore] = useState<number | "">("")
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const cats = await CategoryAPI.getCategories()
      setCategories(cats)
    } catch (err) {
      console.error("Failed to load categories:", err)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name is required")
      return
    }

    setIsCreatingCategory(true)
    try {
      const payload = {
        name: newCategoryName.trim(),
        color: newCategoryColor || "#3B82F6",
        ...(newCategoryDescription.trim() && { description: newCategoryDescription.trim() }),
      }
      
      console.log("Creating category with payload:", payload)
      
      const category = await CategoryAPI.createCategory(payload)
      console.log("Category created successfully:", category)
      
      setCategories([...categories, category])
      setCategoryId(category.id)
      setShowCategoryDialog(false)
      setNewCategoryName("")
      setNewCategoryColor("#3B82F6")
      setNewCategoryDescription("")
      setError(null)
    } catch (err) {
      console.error("Failed to create category:", err)
      setError(err instanceof Error ? err.message : "Failed to create category")
    } finally {
      setIsCreatingCategory(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const ideaData: IdeaCreate = {
        title: title.trim(),
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : [],
        category_id: categoryId || undefined,
        priority,
        effort_score: typeof effortScore === "number" ? effortScore : undefined,
        impact_score: typeof impactScore === "number" ? impactScore : undefined,
        interest_score: typeof interestScore === "number" ? interestScore : undefined,
      }

      await IdeaAPI.createIdea(ideaData)
      router.push("/dashboard/ideas")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create idea")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    if (title || description || tags.length > 0) {
      if (confirm("Are you sure you want to discard this idea? All changes will be lost.")) {
        router.push("/dashboard/ideas")
      }
    } else {
      router.push("/dashboard/ideas")
    }
  }

  return (
    <>
      <PageHeader title="Capture New Idea" description="Let your creativity flow">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDiscard} className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300" disabled={isSaving}>
            <X className="w-4 h-4 mr-2" />
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || isSaving}
            className="gradient-primary hover:glow-primary transition-all duration-300"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Idea
              </>
            )}
          </Button>
        </div>
      </PageHeader>

      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-4 hover:bg-muted/50 transition-all duration-300">
            <Link href="/dashboard/ideas">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Ideas
            </Link>
          </Button>

          {/* Main Editor */}
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Your Idea
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="What's your big idea?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium glass border-border/50 focus:border-primary/50 focus:glow-primary transition-all duration-300"
                  disabled={isSaving}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your idea in detail. What problem does it solve? How would it work? What makes it unique?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="glass border-border/50 focus:border-primary/50 focus:glow-primary resize-none transition-all duration-300"
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground">{description.length} characters</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Category</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCategoryDialog(true)}
                    className="text-xs"
                    disabled={isSaving}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    New Category
                  </Button>
                </div>
                <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoadingCategories || isSaving}>
                  <SelectTrigger className="glass border-border/50">
                    <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Choose a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          {cat.color && (
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          )}
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priority} onValueChange={(value) => setPriority(value as PriorityEnum)} disabled={isSaving}>
                  <SelectTrigger className="glass border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Scoring System */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Rate Your Idea (1-10)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Effort Required</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="1-10"
                      value={effortScore}
                      onChange={(e) => setEffortScore(e.target.value ? parseInt(e.target.value) : "")}
                      className="glass border-border/50"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Potential Impact</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="1-10"
                      value={impactScore}
                      onChange={(e) => setImpactScore(e.target.value ? parseInt(e.target.value) : "")}
                      className="glass border-border/50"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Your Interest</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="1-10"
                      value={interestScore}
                      onChange={(e) => setInterestScore(e.target.value ? parseInt(e.target.value) : "")}
                      className="glass border-border/50"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Tags</label>

                {/* Current Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add New Tag */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag(newTag))}
                    className="glass border-border/50 focus:border-primary/50 focus:glow-primary transition-all duration-300"
                    disabled={isSaving}
                  />
                  <Button variant="outline" onClick={() => addTag(newTag)} disabled={!newTag.trim() || isSaving}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Suggested Tags */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Suggested tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestedTags
                      .filter((tag) => !tags.includes(tag))
                      .slice(0, 10)
                      .map((tag) => (
                        <Button
                          key={tag}
                          variant="ghost"
                          size="sm"
                          onClick={() => addTag(tag)}
                          className="text-xs h-7 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                          disabled={isSaving}
                        >
                          {tag}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions Card */}
          <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Need inspiration?</span>
                </div>
                <Button variant="outline" size="sm" asChild className="hover:bg-primary/10 hover:text-primary transition-all duration-300">
                  <Link href="/dashboard/copilot">Ask AI Copilot</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Creation Dialog */}
      {showCategoryDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass-strong">
            <CardHeader>
              <CardTitle>Create New Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name *</label>
                <Input
                  placeholder="e.g., Product Ideas"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="glass border-border/50 focus:border-primary/50 focus:glow-primary transition-all duration-300"
                  disabled={isCreatingCategory}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="What kind of ideas belong in this category? (optional)"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  rows={3}
                  className="glass border-border/50 focus:border-primary/50 focus:glow-primary resize-none transition-all duration-300"
                  disabled={isCreatingCategory}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                    disabled={isCreatingCategory}
                  />
                  <Input
                    type="text"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="glass border-border/50 focus:border-primary/50 transition-all duration-300"
                    placeholder="#3B82F6"
                    disabled={isCreatingCategory}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCategoryDialog(false)
                    setNewCategoryName("")
                    setNewCategoryColor("#3B82F6")
                    setNewCategoryDescription("")
                    setError(null)
                  }}
                  disabled={isCreatingCategory}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCategory} 
                  disabled={!newCategoryName.trim() || isCreatingCategory} 
                  className="gradient-primary"
                >
                  {isCreatingCategory ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}