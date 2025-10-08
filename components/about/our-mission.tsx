"use client"
import { Target, Zap, Users, Globe } from "lucide-react"

const missions = [
  {
    icon: Target,
    title: "Empower Creativity",
    description: "Provide tools that enhance human creativity, not replace it.",
  },
  {
    icon: Zap,
    title: "Simplify Innovation",
    description: "Make the journey from idea to execution seamless and intuitive.",
  },
  {
    icon: Users,
    title: "Foster Collaboration",
    description: "Enable teams to ideate and innovate together effortlessly.",
  },
  {
    icon: Globe,
    title: "Democratize Access",
    description: "Make powerful creative tools accessible to everyone, everywhere.",
  },
]

export function OurMission() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-muted/30">
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/20">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Our Mission</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            What Drives Us{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Forward
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our mission is simple yet ambitious: to become the world's most trusted copilot for creative minds.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {missions.map((mission, index) => (
            <div
              key={mission.title}
              className="glass-strong p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-border/30 hover:border-primary/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <mission.icon className="h-6 w-6 text-primary-foreground" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{mission.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{mission.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}