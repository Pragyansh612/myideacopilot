"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { AchievementsSection } from "@/components/achievements-section"
import { Plus, Search, Clock, Lightbulb, TrendingUp, Users, Calendar, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { IdeaAPI, Idea, PriorityEnum, StatusEnum } from "@/lib/api/idea"
import { UserAPI, UserProfile, UserStats } from "@/lib/api/user"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [recentIdeas, setRecentIdeas] = useState<Idea[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch user profile
      const profile = await UserAPI.getProfile()
      setUserProfile(profile)

      // Fetch user stats
      const stats = await UserAPI.getStats()
      setUserStats(stats)

      // Fetch recent ideas (limit to 4 for dashboard)
      const ideasData = await IdeaAPI.getIdeas({
        limit: 4,
        sort_by: 'created_at',
        sort_order: 'desc',
      })
      setRecentIdeas(ideasData.ideas)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')

      // Check if unauthorized
      if (err instanceof Error && err.message.includes('401')) {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCategoryLabel = (priority: PriorityEnum, status: StatusEnum) => {
    if (status === 'completed') return 'Completed'
    if (status === 'in_progress') return 'In Progress'
    if (status === 'paused') return 'Paused'
    if (status === 'archived') return 'Archived'
    return 'New Idea'
  }

  const getTopCategories = () => {
    if (!userStats || userStats.collaborations_count === 0) {
      return 'No collaborations yet'
    }
    return `${userStats.collaborations_count} ${userStats.collaborations_count === 1 ? 'collaboration' : 'collaborations'}`
  }

  const hasIdeas = recentIdeas.length > 0

  const stats = userStats ? [
    {
      title: "Total Ideas",
      value: (userStats.ideas_created || 0).toString(),
      icon: Lightbulb,
      change: `+${userStats.ideas_created || 0} created`,
    },
    {
      title: "Ideas Completed",
      value: (userStats.ideas_completed || 0).toString(),
      icon: TrendingUp,
      change: `${userStats.ideas_completed || 0} completed`,
    },
    {
      title: "Current Streak",
      value: (userStats.current_streak || 0).toString(),
      icon: Users,
      change: `${userStats.longest_streak || 0} longest`,
    },
  ] : []

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Loading..."
          description="Fetching your dashboard data"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <PageHeader
          title="Error"
          description="Failed to load dashboard"
        />
        <div className="p-4 md:p-6">
          <Card className="glass">
            <CardContent className="p-6">
              <p className="text-destructive">{error}</p>
              <Button onClick={fetchDashboardData} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={`Welcome back${userProfile?.display_name ? `, ${userProfile.display_name}` : ''}!`}
        description="Ready to capture your next big idea?"
      />

      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Stats Overview */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hasIdeas && userStats
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
                <Link key={idea.id} href={`/ideas/${idea.id}`}>
                  <Card className="glass hover:glass-strong transition-all duration-300 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base group-hover:text-primary transition-colors duration-200">
                            {idea.title}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {idea.description || 'No description'}
                          </CardDescription>
                        </div>
                        <div className="ml-4 text-xs text-muted-foreground flex items-center whitespace-nowrap">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(idea.created_at)}
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
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full whitespace-nowrap">
                          {getCategoryLabel(idea.priority, idea.status)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
    </>
  )
}