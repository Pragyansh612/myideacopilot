"use client"

import { useState, useEffect, useMemo } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/empty-state"
import { AchievementsSection } from "@/components/achievements-section"
import { Plus, Search, Clock, Lightbulb, TrendingUp, Target, Calendar, Sparkles, AlertCircle, LucideIcon } from "lucide-react"
import Link from "next/link"
import { IdeaAPI, Idea, PriorityEnum, StatusEnum } from "@/lib/api/idea"
import { UserAPI, UserProfile, UserStats } from "@/lib/api/user"
import { useRouter } from "next/navigation"

// Type definitions
interface QuickAction {
  href: string
  gradient: string
  icon: LucideIcon
  title: string
  description: string
  hoverGlow: string
}

interface Stat {
  title: string
  value: string
  icon: LucideIcon
  change: string
  color: string
  bgColor: string
}

// Separated components for better performance
function QuickActionCard({ href, gradient, icon: Icon, title, description, hoverGlow }: QuickAction) {
  return (
    <Link href={href}>
      <Card className={`glass hover:glass-strong transition-all duration-300 ${hoverGlow} cursor-pointer group h-full`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon
  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function IdeaCard({ idea }: { idea: Idea }) {
  const statusConfig: Record<StatusEnum, { label: string; className: string }> = {
    completed: { label: 'Completed', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
    in_progress: { label: 'In Progress', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    paused: { label: 'Paused', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    archived: { label: 'Archived', className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
    new: { label: 'New', className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  }

  const priorityConfig: Record<PriorityEnum, string> = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  }

  const statusBadge = statusConfig[idea.status] || statusConfig.new
  const priorityIcon = priorityConfig[idea.priority] || '⚪'

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Link href={`/ideas/${idea.id}`}>
      <Card className="glass hover:glass-strong transition-all duration-300 cursor-pointer group h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base group-hover:text-primary transition-colors duration-200 line-clamp-2 flex-1">
              {idea.title}
            </CardTitle>
            <span className="text-lg flex-shrink-0">{priorityIcon}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${statusBadge.className}`}>
              {statusBadge.label}
            </span>
            <div className="text-xs text-muted-foreground flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(idea.created_at)}
            </div>
          </div>

          {idea.status === 'in_progress' && idea.progress_percentage !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{idea.progress_percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${idea.progress_percentage}%` }}
                />
              </div>
            </div>
          )}

          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {idea.tags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
              {idea.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                  +{idea.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

function LoadingSkeleton() {
  return (
    <>
      <PageHeader
        title="Loading..."
        description="Fetching your dashboard data"
      />
      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        <section>
          <Skeleton className="h-7 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <section className="lg:col-span-2">
            <Skeleton className="h-7 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="glass">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-16 mb-2" />
                    <Skeleton className="h-3 w-28" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <section className="lg:col-span-1">
            <Card className="glass">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </section>
        </div>

        <section>
          <Skeleton className="h-7 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Something went wrong"
      />
      <div className="p-4 md:p-6">
        <Card className="glass border-destructive/50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Unable to load dashboard</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={onRetry} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [recentIdeas, setRecentIdeas] = useState<Idea[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch all data in parallel for better performance
      const [profile, stats, ideasData] = await Promise.all([
        UserAPI.getProfile(),
        UserAPI.getStats(),
        IdeaAPI.getIdeas({
          limit: 6,
          sort_by: 'created_at',
          sort_order: 'desc',
        })
      ])

      setUserProfile(profile)
      setUserStats(stats)
      setRecentIdeas(ideasData.ideas)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')

      if (err instanceof Error && err.message.includes('401')) {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Memoize stats calculation
  const stats = useMemo<Stat[]>(() => {
    if (!userStats) return []
    return [
      {
        title: "Total Ideas",
        value: (userStats.ideas_created || 0).toString(),
        icon: Lightbulb,
        change: `${userStats.ideas_completed || 0} completed`,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      },
      {
        title: "Current Level",
        value: (userStats.current_level || 1).toString(),
        icon: TrendingUp,
        change: `${userStats.total_xp || 0} total XP`,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        title: "Current Streak",
        value: `${userStats.current_streak || 0} days`,
        icon: Target,
        change: `${userStats.longest_streak || 0} days longest`,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
    ]
  }, [userStats])

  const quickActions = useMemo<QuickAction[]>(() => [
    {
      href: "/ideas/new",
      gradient: "gradient-primary",
      icon: Plus,
      title: "New Idea",
      description: "Capture a fresh thought",
      hoverGlow: "hover:glow-primary"
    },
    {
      href: "/ideas?search=true",
      gradient: "gradient-secondary",
      icon: Search,
      title: "Search Ideas",
      description: "Find existing ideas",
      hoverGlow: "hover:glow-secondary"
    },
    {
      href: "/ideas?filter=recent",
      gradient: "gradient-accent",
      icon: Clock,
      title: "Recent Ideas",
      description: "View latest thoughts",
      hoverGlow: "hover:glow-accent"
    }
  ], [])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchDashboardData} />
  }

  const hasIdeas = recentIdeas.length > 0

  return (
    <>
      <PageHeader
        title={`Welcome back${userProfile?.display_name ? `, ${userProfile.display_name}` : ''}!`}
        description="Track your progress and manage your ideas"
      />

      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.href} {...action} />
            ))}
          </div>
        </section>

        {/* Two Column Layout for Stats and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Stats Overview */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
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