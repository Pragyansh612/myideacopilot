"use client"
import { Brain, Search, Layout, Zap, Sparkles } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Quick Capture",
    description:
      "Instantly capture ideas through text, voice recordings, or file uploads. Never lose a brilliant thought again.",
    gradient: "gradient-primary",
    glow: "glow-primary",
  },
  {
    icon: Brain,
    title: "AI Copilot",
    description:
      "Get intelligent suggestions to refine and expand your ideas. Let AI help you think deeper and broader.",
    gradient: "gradient-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Search,
    title: "Competitor Research",
    description:
      "Automatically research market trends and competitor analysis to validate and strengthen your concepts.",
    gradient: "gradient-accent",
    glow: "glow-accent",
  },
  {
    icon: Layout,
    title: "Organize & Visualize",
    description: "Transform ideas into boards, timelines, and mindmaps. See connections and patterns emerge naturally.",
    gradient: "gradient-primary",
    glow: "glow-primary",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 gradient-secondary opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 gradient-accent opacity-5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">Powerful Features</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              supercharge
            </span>{" "}
            your creativity
          </h2>

          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            From quick capture to intelligent insights, MyIdeaCopilot provides all the tools you need to transform
            scattered thoughts into actionable plans.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`glass-strong p-6 rounded-2xl hover:${feature.glow} transition-all duration-500 group cursor-pointer transform hover:-translate-y-2`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>

              <p className="text-muted-foreground text-pretty leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Additional feature highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              10x
            </div>
            <p className="text-sm text-muted-foreground">Faster idea development</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              24/7
            </div>
            <p className="text-sm text-muted-foreground">AI-powered assistance</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              ∞
            </div>
            <p className="text-sm text-muted-foreground">Unlimited possibilities</p>
          </div>
        </div>
      </div>
    </section>
  )
}
