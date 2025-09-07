"use client"
import { ArrowRight, Mic, FolderOpen, Search, TrendingUp, CheckCircle } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Mic,
    title: "Capture",
    description:
      "Record ideas instantly through voice, text, or uploads. Our AI transcribes and organizes everything automatically.",
    features: ["Voice-to-text", "File uploads", "Quick notes", "Smart tagging"],
    gradient: "gradient-primary",
    glow: "glow-primary",
  },
  {
    number: "02",
    icon: FolderOpen,
    title: "Organize",
    description: "Let AI categorize and structure your ideas into boards, timelines, and mindmaps for better clarity.",
    features: ["Smart categorization", "Visual boards", "Timeline view", "Mind mapping"],
    gradient: "gradient-secondary",
    glow: "glow-secondary",
  },
  {
    number: "03",
    icon: Search,
    title: "Research",
    description: "Get automated competitor analysis and market research to validate and strengthen your concepts.",
    features: ["Market analysis", "Competitor insights", "Trend detection", "Validation metrics"],
    gradient: "gradient-accent",
    glow: "glow-accent",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Grow",
    description: "Transform validated ideas into actionable plans with AI-powered recommendations and next steps.",
    features: ["Action planning", "Growth strategies", "Progress tracking", "Success metrics"],
    gradient: "gradient-primary",
    glow: "glow-primary",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-muted/20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 gradient-primary rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-40 right-20 w-40 h-40 gradient-secondary rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-36 h-36 gradient-accent rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">Simple Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            How{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              MyIdeaCopilot
            </span>{" "}
            works
          </h2>

          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Four simple steps to transform your scattered thoughts into organized, research-backed, actionable ideas.
          </p>
        </div>

        <div className="space-y-12 lg:space-y-0">
          {steps.map((step, index) => (
            <div key={step.title} className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 ${step.gradient} rounded-2xl flex items-center justify-center`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Step {step.number}</div>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground text-pretty leading-relaxed">{step.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  {step.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className={`mt-8 lg:mt-0 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div
                  className={`glass-strong p-8 rounded-2xl hover:${step.glow} transition-all duration-500 transform hover:scale-105`}
                >
                  <div className="aspect-square bg-gradient-to-br from-muted/50 to-transparent rounded-xl flex items-center justify-center relative overflow-hidden">
                    {/* Mock interface elements */}
                    <div className="absolute inset-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-3 h-3 rounded-full bg-primary/60" />
                        <div className="w-3 h-3 rounded-full bg-secondary/60" />
                        <div className="w-3 h-3 rounded-full bg-accent/60" />
                      </div>

                      <div className="space-y-2">
                        <div className={`h-3 ${step.gradient} rounded opacity-60`} />
                        <div className="h-2 bg-muted rounded w-3/4 opacity-40" />
                        <div className="h-2 bg-muted rounded w-1/2 opacity-40" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-4">
                        <div className="glass p-2 rounded">
                          <div className="w-4 h-4 bg-primary/40 rounded mb-1" />
                          <div className="h-1 bg-muted rounded" />
                        </div>
                        <div className="glass p-2 rounded">
                          <div className="w-4 h-4 bg-secondary/40 rounded mb-1" />
                          <div className="h-1 bg-muted rounded" />
                        </div>
                      </div>
                    </div>

                    {/* Step number overlay */}
                    <div className="absolute bottom-4 right-4 text-6xl font-bold text-foreground/5">{step.number}</div>
                  </div>
                </div>
              </div>

              {/* Arrow connector (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block lg:col-span-2 flex justify-center py-8">
                  <ArrowRight className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
