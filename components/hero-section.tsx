"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles, Zap, Target, Brain } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-background/50" />

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full gradient-secondary opacity-20 blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 rounded-full gradient-accent opacity-15 blur-2xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-24 h-24 rounded-full gradient-primary opacity-25 blur-xl animate-pulse delay-500" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground/80">AI-Powered Creativity</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                Your{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AI-powered
                </span>{" "}
                Idea Manager & Copilot
              </h1>

              <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                Capture, refine, and grow your ideas with AI support. Transform scattered thoughts into organized
                insights with intelligent research, visualization, and collaboration tools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="gradient-primary hover:glow-primary transition-all duration-300 group"
              >
                <Link href="/signup" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="glass hover:glow-secondary transition-all duration-300 group bg-transparent"
              >
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-full gradient-primary">
                  <Zap className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Quick Capture</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-full gradient-secondary">
                  <Target className="h-3 w-3 text-secondary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">AI Research</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-full gradient-accent">
                  <Sparkles className="h-3 w-3 text-accent-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Smart Organization</span>
              </div>
            </div>
          </div>

          {/* Right side - Visual illustration */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Main glass card */}
              <div className="glass-strong p-8 rounded-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 gradient-primary rounded opacity-60" />
                    <div className="h-3 gradient-secondary rounded w-3/4 opacity-40" />
                    <div className="h-3 gradient-accent rounded w-1/2 opacity-40" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="glass p-3 rounded-lg">
                      <div className="w-6 h-6 gradient-primary rounded mb-2" />
                      <div className="h-2 bg-muted rounded w-full" />
                      <div className="h-2 bg-muted rounded w-2/3 mt-1" />
                    </div>
                    <div className="glass p-3 rounded-lg">
                      <div className="w-6 h-6 gradient-secondary rounded mb-2" />
                      <div className="h-2 bg-muted rounded w-full" />
                      <div className="h-2 bg-muted rounded w-3/4 mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 glass p-4 rounded-xl transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                <Brain className="h-6 w-6 text-primary" />
              </div>

              <div className="absolute -bottom-4 -right-4 glass p-4 rounded-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>

              {/* Glow effects */}
              <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl -z-10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
