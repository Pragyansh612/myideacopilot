"use client"
import { Button } from "@/components/ui/button"
import { Check, Star, Zap, Crown } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started with idea management",
    features: [
      "Up to 50 ideas",
      "Basic AI suggestions",
      "Simple organization",
      "Voice-to-text capture",
      "Basic templates",
      "Community support",
    ],
    cta: "Get Started Free",
    popular: false,
    gradient: "gradient-secondary",
    glow: "glow-secondary",
  },
  {
    name: "Pro",
    price: "19",
    description: "Unlock the full power of AI-driven creativity",
    features: [
      "Unlimited ideas",
      "Advanced AI copilot",
      "Competitor research",
      "Market analysis",
      "Custom mindmaps",
      "Timeline visualization",
      "Priority support",
      "Export capabilities",
      "Team collaboration",
    ],
    cta: "Start Pro Trial",
    popular: true,
    gradient: "gradient-primary",
    glow: "glow-primary",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 gradient-primary opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 gradient-accent opacity-5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">Simple Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Choose your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              creative journey
            </span>
          </h2>

          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Start free and upgrade when you're ready to unlock the full potential of AI-powered idea management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-strong p-8 rounded-2xl relative transition-all duration-500 hover:scale-105 ${
                plan.popular ? `hover:${plan.glow} border-2 border-primary/20` : "hover:glow-secondary"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="gradient-primary px-4 py-2 rounded-full text-sm font-medium text-primary-foreground">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    {plan.popular && <Star className="h-5 w-5 text-primary fill-current" />}
                  </div>
                  <p className="text-muted-foreground text-pretty">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {plan.name === "Pro" && (
                    <p className="text-sm text-muted-foreground">14-day free trial, cancel anytime</p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 ${plan.gradient} rounded-full flex items-center justify-center flex-shrink-0`}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  asChild
                  className={`w-full ${
                    plan.popular
                      ? "gradient-primary hover:glow-primary"
                      : "glass hover:glow-secondary bg-transparent border border-border/50"
                  } transition-all duration-300`}
                  size="lg"
                >
                  <Link href="/signup">{plan.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            All plans include SSL security, regular backups, and 99.9% uptime guarantee
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Instant setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
