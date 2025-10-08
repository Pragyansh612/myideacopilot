"use client"
import { Star, Quote, Sparkles } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow",
    initial: "SC",
    rating: 5,
    quote:
      "MyIdeaCopilot transformed how I manage product ideas. The AI research feature saves hours of analysis time.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Startup Founder",
    company: "InnovateLab",
    initial: "MR",
    rating: 5,
    quote:
      "As a founder with constant idea flow, this tool helps me capture everything and refine concepts into actionable plans.",
  },
  {
    name: "Emily Watson",
    role: "Design Lead",
    company: "Creative Co",
    initial: "EW",
    rating: 5,
    quote:
      "The voice capture is perfect for creative brainstorming. I record ideas while sketching and AI organizes everything.",
  },
  {
    name: "David Kim",
    role: "Innovation Director",
    company: "Global Corp",
    initial: "DK",
    rating: 5,
    quote:
      "Our team uses this for all ideation sessions. The competitor research helps us make data-driven decisions quickly.",
  },
  {
    name: "Lisa Thompson",
    role: "Content Strategist",
    company: "MediaHub",
    initial: "LT",
    rating: 5,
    quote:
      "The mindmaps help visualize content strategies perfectly. AI suggestions spark creative directions I wouldn't find alone.",
  },
  {
    name: "Alex Johnson",
    role: "Research Lead",
    company: "BioTech Labs",
    initial: "AJ",
    rating: 5,
    quote:
      "Perfect for research hypotheses. The timeline feature tracks concept evolution from initial spark to final results.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Innovators Worldwide
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals transforming their creative process.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="glass-strong p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-border/30 hover:border-primary/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-primary fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-foreground/90 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3 pt-4 border-t border-border/30">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {testimonial.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              50K+
            </div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              1M+
            </div>
            <p className="text-sm text-muted-foreground">Ideas Captured</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              4.9
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              99%
            </div>
            <p className="text-sm text-muted-foreground">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  )
}