"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/empty-state"
import { Plus, Search, Calendar, Tag, Grid, List, MoreHorizontal, Lightbulb, Loader2 } from "lucide-react"
import Link from "next/link"
import { IdeaAPI, CategoryAPI, type Idea, type Category, type PriorityEnum, type StatusEnum } from "@/lib/api/idea"
import { useRouter } from "next/navigation"

export default function IdeasPage() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [selectedCategory, sortBy, searchQuery])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load categories
      const cats = await CategoryAPI.getCategories()
      setCategories(cats)

      // Load ideas with filters
      const result = await IdeaAPI.getIdeas({
        category_id: selectedCategory !== "all" ? selectedCategory : undefined,
        sort_by: sortBy,
        sort_order: "desc",
        search: searchQuery || undefined,
        limit: 100,
      })

      setIdeas(result.ideas)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ideas")
    } finally {
      setIsLoading(false)
    }
  }

  const handleIdeaClick = (ideaId: string) => {
    router.push(`/dashboard/ideas/${ideaId}`)
  }

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ]

  return (
    <>
      <PageHeader title="My Ideas" description={`${ideas.length} ideas captured`}>
        <Button asChild className="gradient-primary hover:glow-primary transition-all duration-300">
          <Link href="/dashboard/ideas/new">
            <Plus className="w-4 h-4 mr-2" />
            New Idea
          </Link>
        </Button>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : ideas.length === 0 && !searchQuery && selectedCategory === "all" ? (
          <EmptyState
            icon={Lightbulb}
            title="No ideas captured yet"
            description="Your idea collection is empty. Start capturing your thoughts, inspirations, and creative concepts to build your personal idea library."
            actionLabel="Create your first idea"
            actionHref="/dashboard/ideas/new"
            illustration="💡"
          />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="glass p-4 rounded-xl space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ideas, tags, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass border-border/50 focus:border-primary/50 focus:glow-primary transition-all duration-300"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40 glass border-border/50">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32 glass border-border/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="overall_score">Score</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <div className="flex border border-border/50 rounded-lg glass overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ideas Grid/List */}
            {ideas.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No ideas found"
                description="No ideas match your current search or filter criteria. Try adjusting your search terms or clearing the filters."
                actionLabel="Clear filters"
                onAction={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                illustration="🔍"
              />
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}
              >
                {ideas.map((idea) => (
                  <Card
                    key={idea.id}
                    onClick={() => handleIdeaClick(idea.id)}
                    className="glass hover:glass-strong transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base group-hover:text-primary transition-colors duration-200 truncate">
                            {idea.title}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1 line-clamp-2">
                            {idea.description || "No description"}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {idea.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{idea.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(idea.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          {idea.overall_score && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                              {idea.overall_score.toFixed(1)}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full capitalize ${
                            idea.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                            idea.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-green-500/10 text-green-500'
                          }`}>
                            {idea.priority}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}