"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X, Plus, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

const categories = [
  "Product Idea",
  "Business Idea",
  "Technology",
  "Social Impact",
  "Creative Project",
  "Research Topic",
]

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
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSaving, setIsSaving] = useState(false)

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
    if (!title.trim()) return

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Saving idea:", { title, description, category, tags })

    setIsSaving(false)
    router.push("/dashboard/ideas")
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
          <Button variant="outline" onClick={handleDiscard} className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300">
            <X className="w-4 h-4 mr-2" />
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || isSaving}
            className="gradient-primary hover:glow-primary transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Idea"}
          </Button>
        </div>
      </PageHeader>

      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
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
                />
                <p className="text-xs text-muted-foreground">{description.length} characters</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="glass border-border/50">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  />
                  <Button variant="outline" onClick={() => addTag(newTag)} disabled={!newTag.trim()}>
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
    </>
  )
}