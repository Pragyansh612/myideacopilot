"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Lightbulb, FolderOpen, Bot, Sparkles, CheckCircle } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Welcome to MyIdeaCopilot",
    subtitle: "Your AI-powered creativity companion",
    description:
      "Transform your scattered thoughts into organized, actionable ideas with the help of AI. Let's get you started on your creative journey.",
    icon: Sparkles,
    illustration: "✨",
  },
  {
    id: 2,
    title: "Capture Ideas Anywhere",
    subtitle: "Multiple ways to save your thoughts",
    description:
      "Quickly jot down text, record voice memos, upload images, or scan documents. Your ideas are captured instantly, no matter the format.",
    icon: Lightbulb,
    illustration: "💡",
  },
  {
    id: 3,
    title: "Organize & Visualize",
    subtitle: "Keep your ideas structured",
    description:
      "Tag, categorize, and search through your ideas effortlessly. Create connections between concepts and watch your creativity flourish.",
    icon: FolderOpen,
    illustration: "📁",
  },
  {
    id: 4,
    title: "AI Copilot Assistant",
    subtitle: "Get intelligent help with your ideas",
    description:
      "Chat with your AI copilot to refine ideas, brainstorm new concepts, research competitors, and get personalized suggestions.",
    icon: Bot,
    illustration: "🤖",
  },
  {
    id: 5,
    title: "You're All Set!",
    subtitle: "Ready to start creating",
    description:
      "Your creative workspace is ready. Start capturing your first idea and let MyIdeaCopilot help you turn thoughts into reality.",
    icon: CheckCircle,
    illustration: "🚀",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const progress = (currentStep / steps.length) * 100
  const step = steps.find((s) => s.id === currentStep)!

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const handleGetStarted = () => {
    router.push("/capture")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-2000" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main content */}
        <div className="glass-strong rounded-2xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
          {/* Step illustration */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 glass rounded-full flex items-center justify-center text-4xl glow-primary">
              {step.illustration}
            </div>
            <step.icon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary/20" />
          </div>

          {/* Step content */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {step.title}
            </h1>
            <p className="text-xl text-muted-foreground font-medium">{step.subtitle}</p>
            <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">{step.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button
                onClick={handleGetStarted}
                className="gradient-primary text-primary-foreground flex items-center gap-2 glow-primary"
              >
                Get Started
                <Sparkles className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="gradient-primary text-primary-foreground flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">You can always access this guide later from Settings</p>
        </div>
      </div>
    </div>
  )
}
