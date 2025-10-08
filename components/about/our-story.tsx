"use client"
import { BookOpen, Lightbulb, Rocket } from "lucide-react"

export function OurStory() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/20">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Our Story</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              From a Simple Idea to a{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Global Platform
              </span>
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>
                MyIdeaCopilot was born from a simple observation: brilliant ideas often get lost in the chaos of daily life. Whether scribbled on napkins, buried in notes apps, or forgotten in meetings, countless innovations never see the light of day.
              </p>
              <p>
                In 2023, our founders—a team of designers, engineers, and creative thinkers—came together with a vision to build an intelligent companion that could capture, nurture, and grow ideas alongside their creators.
              </p>
              <p>
                Today, we're proud to serve over 50,000 creators, entrepreneurs, students, and professionals worldwide, helping them transform fleeting thoughts into meaningful innovations.
              </p>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="glass-strong p-8 rounded-3xl shadow-2xl">
              <div className="space-y-6">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="h-20 w-20 text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 gradient-primary rounded-lg opacity-70" />
                  <div className="h-3 bg-muted rounded w-3/4 opacity-60" />
                  <div className="h-3 bg-muted rounded w-1/2 opacity-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}