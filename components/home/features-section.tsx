"use client"
import { Brain, Search, Layout, Zap, Sparkles, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Quick Capture",
    description:
      "Instantly capture ideas through text, voice, or file uploads. Never lose a brilliant thought again.",
    gradient: "gradient-primary",
  },
  {
    icon: Brain,
    title: "AI Copilot",
    description:
      "Get intelligent suggestions to refine and expand your ideas. Think deeper with AI assistance.",
    gradient: "gradient-primary",
  },
  {
    icon: Search,
    title: "Smart Research",
    description:
      "Automated market analysis and competitor research to validate and strengthen your concepts.",
    gradient: "gradient-accent",
  },
  {
    icon: Layout,
    title: "Visual Organization",
    description: "Transform ideas into boards, timelines, and mindmaps. See connections emerge naturally.",
    gradient: "gradient-accent",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Features</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Innovate Faster
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Powerful tools designed to transform scattered thoughts into organized, actionable ideas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-strong p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group border border-border/30 hover:border-primary/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-3 gap-8 lg:gap-12">
          <div className="text-center space-y-2">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              10x
            </div>
            <p className="text-sm text-muted-foreground">Faster Development</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              24/7
            </div>
            <p className="text-sm text-muted-foreground">AI Assistance</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ∞
            </div>
            <p className="text-sm text-muted-foreground">Possibilities</p>
          </div>
        </div>
      </div>
    </section>
  )
}