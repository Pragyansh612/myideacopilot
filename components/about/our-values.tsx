"use client"
import { Heart, Shield, Zap, Users, Sparkles, TrendingUp } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "User-Centric",
    description: "Every decision we make starts with our users' needs and experiences.",
    gradient: "gradient-primary",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your ideas are yours. We protect your data with industry-leading security.",
    gradient: "gradient-accent",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We constantly push boundaries to bring you cutting-edge AI capabilities.",
    gradient: "gradient-primary",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Great ideas emerge from diverse perspectives working together.",
    gradient: "gradient-accent",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    description: "We set high standards and deliver exceptional quality in everything we do.",
    gradient: "gradient-primary",
  },
  {
    icon: TrendingUp,
    title: "Growth Mindset",
    description: "We embrace learning, feedback, and continuous improvement.",
    gradient: "gradient-accent",
  },
]

export function OurValues() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/20">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Our Values</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            The Principles That{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Guide Us
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our core values shape our culture, guide our decisions, and define how we serve our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="glass-strong p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-border/30 hover:border-primary/30 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 ${value.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <value.icon className="h-6 w-6 text-primary-foreground" />
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}