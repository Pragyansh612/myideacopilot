"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { AchievementsSection } from "@/components/achievements-section"
import { Plus, Search, Clock, Lightbulb, TrendingUp, Users, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"

// Mock data for recent ideas
const recentIdeas = [
  {
    id: 1,
    title: "AI-Powered Recipe Generator",
    description: "An app that creates personalized recipes based on dietary preferences and available ingredients.",
    tags: ["AI", "Food", "Mobile App"],
    date: "2024-01-15",
    category: "Product Idea",
  },
  {
    id: 2,
    title: "Sustainable Packaging Solution",
    description: "Biodegradable packaging made from agricultural waste for e-commerce businesses.",
    tags: ["Sustainability", "Business", "Innovation"],
    date: "2024-01-14",
    category: "Business Idea",
  },
  {
    id: 3,
    title: "Virtual Study Groups Platform",
    description: "Connect students worldwide for collaborative learning and peer support.",
    tags: ["Education", "Social", "Platform"],
    date: "2024-01-13",
    category: "Social Impact",
  },
  {
    id: 4,
    title: "Smart Home Energy Optimizer",
    description: "IoT system that automatically adjusts home energy usage based on occupancy and weather.",
    tags: ["IoT", "Energy", "Smart Home"],
    date: "2024-01-12",
    category: "Technology",
  },
]

const stats = [
  {
    title: "Total Ideas",
    value: "24",
    icon: Lightbulb,
    change: "+3 this week",
  },
  {
    title: "Ideas This Month",
    value: "8",
    icon: TrendingUp,
    change: "+2 from last month",
  },
  {
    title: "Categories",
    value: "6",
    icon: Users,
    change: "Technology, Business, Social",
  },
]

export default function DashboardPage() {
  const [hasIdeas, setHasIdeas] = useState(true) // Set to true to show normal dashboard

  return (
    <AppLayout>
      <PageHeader title="Welcome back, Alex!" description="Ready to capture your next big idea?" />

      <div className="p-6 space-y-8">
        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/ideas/new">
              <Card className="glass hover:glass-strong transition-all duration-300 hover:glow-primary cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">New Idea</h3>
                      <p className="text-sm text-muted-foreground">Capture a fresh thought</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ideas?search=true">
              <Card className="glass hover:glass-strong transition-all duration-300 hover:glow-secondary cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Search className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Search Ideas</h3>
                      <p className="text-sm text-muted-foreground">Find existing ideas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ideas?filter=recent">
              <Card className="glass hover:glass-strong transition-all duration-300 hover:glow-accent cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Recent Ideas</h3>
                      <p className="text-sm text-muted-foreground">View latest thoughts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Two Column Layout for Stats and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Overview */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hasIdeas
                ? stats.map((stat, index) => (
                    <Card key={index} className="glass">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <stat.icon className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : [
                    {
                      title: "Total Ideas",
                      value: "0",
                      icon: Lightbulb,
                      change: "Start your journey",
                    },
                    {
                      title: "Ideas This Month",
                      value: "0",
                      icon: TrendingUp,
                      change: "Create your first idea",
                    },
                    {
                      title: "Categories",
                      value: "0",
                      icon: Users,
                      change: "Organize your thoughts",
                    },
                  ].map((stat, index) => (
                    <Card key={index} className="glass">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <stat.icon className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </section>

          {/* Achievements Section */}
          <section className="lg:col-span-1">
            <AchievementsSection />
          </section>
        </div>

        {/* Recent Ideas or Empty State */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Ideas</h2>
            {hasIdeas && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/ideas">View All</Link>
              </Button>
            )}
          </div>

          {hasIdeas ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentIdeas.map((idea) => (
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
                        <CardDescription className="text-sm mt-1">{idea.description}</CardDescription>
                      </div>
                      <div className="ml-4 text-xs text-muted-foreground flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(idea.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                        {idea.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="Your creative journey starts here"
              description="You haven't captured any ideas yet. Start by creating your first idea and let MyIdeaCopilot help you turn thoughts into reality."
              actionLabel="Create your first idea"
              actionHref="/ideas/new"
              illustration="🌟"
            />
          )}
        </section>
      </div>
    </AppLayout>
  )
}
