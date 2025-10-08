"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/empty-state"
import { Plus, Search, Calendar, Tag, Grid, List, MoreHorizontal, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function IdeasPage() {
  const [hasIdeas, setHasIdeas] = useState(false) // Set to true to show ideas
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock data for ideas - only show if hasIdeas is true
  const allIdeas = [
    {
      id: 1,
      title: "AI-Powered Recipe Generator",
      description:
        "An app that creates personalized recipes based on dietary preferences and available ingredients. Users can input what they have in their fridge and get creative meal suggestions.",
      tags: ["AI", "Food", "Mobile App"],
      date: "2024-01-15",
      category: "Product Idea",
    },
    {
      id: 2,
      title: "Sustainable Packaging Solution",
      description:
        "Biodegradable packaging made from agricultural waste for e-commerce businesses. Could reduce plastic waste significantly.",
      tags: ["Sustainability", "Business", "Innovation"],
      date: "2024-01-14",
      category: "Business Idea",
    },
    {
      id: 3,
      title: "Virtual Study Groups Platform",
      description:
        "Connect students worldwide for collaborative learning and peer support. Include features like shared whiteboards and study timers.",
      tags: ["Education", "Social", "Platform"],
      date: "2024-01-13",
      category: "Social Impact",
    },
    {
      id: 4,
      title: "Smart Home Energy Optimizer",
      description: "IoT system that automatically adjusts home energy usage based on occupancy and weather patterns.",
      tags: ["IoT", "Energy", "Smart Home"],
      date: "2024-01-12",
      category: "Technology",
    },
    {
      id: 5,
      title: "Mindfulness App for Developers",
      description:
        "A meditation and mindfulness app specifically designed for software developers with coding-themed exercises.",
      tags: ["Wellness", "Developers", "Mental Health"],
      date: "2024-01-11",
      category: "Product Idea",
    },
    {
      id: 6,
      title: "Local Artist Marketplace",
      description: "Platform connecting local artists with customers for custom artwork and commissions.",
      tags: ["Art", "Marketplace", "Local"],
      date: "2024-01-10",
      category: "Business Idea",
    },
  ]

  // Filter and sort ideas
  const filteredIdeas = allIdeas
    .filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || idea.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "title") return a.title.localeCompare(b.title)
      return 0
    })

  const categories = ["all", ...Array.from(new Set(allIdeas.map((idea) => idea.category)))]

  return (
    <AppLayout>
      <PageHeader title="My Ideas" description={`${filteredIdeas.length} ideas captured`}>
        <Button asChild className="gradient-primary hover:glow-primary">
          <Link href="/ideas/new">
            <Plus className="w-4 h-4 mr-2" />
            New Idea
          </Link>
        </Button>
      </PageHeader>

      <div className="p-6 space-y-6">
        {!hasIdeas ? (
          <EmptyState
            icon={Lightbulb}
            title="No ideas captured yet"
            description="Your idea collection is empty. Start capturing your thoughts, inspirations, and creative concepts to build your personal idea library."
            actionLabel="Create your first idea"
            actionHref="/ideas/new"
            illustration="💡"
          />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="glass p-4 rounded-lg space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ideas, tags, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass border-border/50"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40 glass border-border/50">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32 glass border-border/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
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
            {filteredIdeas.length === 0 ? (
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
                {filteredIdeas.map((idea) => (
                  <Card
                    key={idea.id}
                    className="glass hover:glass-strong transition-all duration-300 cursor-pointer group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base group-hover:text-primary transition-colors duration-200">
                            {idea.title}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1 line-clamp-2">{idea.description}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {idea.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(idea.date).toLocaleDateString()}
                          </div>
                          <span className="bg-muted/50 px-2 py-1 rounded-full">{idea.category}</span>
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
    </AppLayout>
  )
}
