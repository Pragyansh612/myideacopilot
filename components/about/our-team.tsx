"use client"
import { Sparkles } from "lucide-react"

const team = [
  {
    name: "Alex Rivera",
    role: "CEO & Co-Founder",
    initial: "AR",
    bio: "Former product lead at major tech companies, passionate about human-AI collaboration.",
  },
  {
    name: "Sarah Chen",
    role: "CTO & Co-Founder",
    initial: "SC",
    bio: "AI researcher with a decade of experience in machine learning and natural language processing.",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Design",
    initial: "MJ",
    bio: "Award-winning designer focused on creating intuitive, beautiful user experiences.",
  },
  {
    name: "Emily Watson",
    role: "Head of Product",
    initial: "EW",
    bio: "Product strategist dedicated to building tools that solve real user problems.",
  },
  {
    name: "David Kim",
    role: "Head of Engineering",
    initial: "DK",
    bio: "Full-stack engineer passionate about scalable systems and clean code.",
  },
  {
    name: "Lisa Thompson",
    role: "Head of Community",
    initial: "LT",
    bio: "Community builder focused on creating meaningful connections between creators.",
  },
]

export function OurTeam() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-muted/30">
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Our Team</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Meet the Minds{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Behind MyIdeaCopilot
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A diverse team of innovators, designers, and builders united by a passion for creativity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {team.map((member, index) => (
            <div
              key={member.name}
              className="glass-strong p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-border/30 hover:border-primary/30 text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
                {member.initial}
              </div>

              <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}