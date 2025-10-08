"use client"
import { Mic, FolderOpen, Search, TrendingUp, CheckCircle, Sparkles } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Mic,
    title: "Capture Ideas",
    description:
      "Record ideas instantly through voice, text, or uploads. Our AI transcribes and organizes everything automatically.",
    features: ["Voice-to-text", "File uploads", "Quick notes", "Smart tagging"],
    gradient: "gradient-primary",
  },
  {
    number: "02",
    icon: FolderOpen,
    title: "Organize Visually",
    description: "AI categorizes and structures your ideas into boards, timelines, and mindmaps for clarity.",
    features: ["Smart sorting", "Visual boards", "Timeline view", "Mind mapping"],
    gradient: "gradient-primary",
  },
  {
    number: "03",
    icon: Search,
    title: "Research & Validate",
    description: "Get automated competitor analysis and market research to strengthen your concepts.",
    features: ["Market analysis", "Competitor insights", "Trend detection", "Data validation"],
    gradient: "gradient-accent",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Execute & Grow",
    description: "Transform validated ideas into action plans with AI recommendations and tracking.",
    features: ["Action planning", "Growth strategies", "Progress tracking", "Success metrics"],
    gradient: "gradient-accent",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative overflow-hidden bg-muted/30">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">How It Works</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Four Steps to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transform Ideas
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A simple, powerful process to turn scattered thoughts into actionable plans.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div key={step.title} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <step.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Step {step.number}</div>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{step.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {step.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="glass-strong p-8 rounded-3xl shadow-xl border border-border/30 hover:border-primary/30 transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-muted/30 to-transparent rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Mock interface */}
                    <div className="absolute inset-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-primary/60" />
                          <div className="w-3 h-3 rounded-full bg-accent/60" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className={`h-4 ${step.gradient} rounded-lg opacity-70`} />
                        <div className="h-3 bg-muted rounded w-3/4 opacity-50" />
                        <div className="h-3 bg-muted rounded w-1/2 opacity-30" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-6">
                        <div className="glass p-3 rounded-xl border border-border/20">
                          <div className="w-6 h-6 bg-primary/30 rounded-lg mb-2" />
                          <div className="h-2 bg-muted rounded" />
                        </div>
                        <div className="glass p-3 rounded-xl border border-border/20">
                          <div className="w-6 h-6 bg-accent/30 rounded-lg mb-2" />
                          <div className="h-2 bg-muted rounded" />
                        </div>
                      </div>
                    </div>

                    {/* Step number watermark */}
                    <div className="absolute bottom-6 right-6 text-7xl font-bold text-foreground/5">
                      {step.number}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}