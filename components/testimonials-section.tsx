"use client"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow",
    avatar: "/professional-woman-with-short-black-hair.jpg",
    rating: 5,
    quote:
      "MyIdeaCopilot transformed how I manage product ideas. The AI research feature saved me hours of market analysis, and the visual organization helps my team stay aligned.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Startup Founder",
    company: "InnovateLab",
    avatar: "/hispanic-man-with-beard-and-glasses.jpg",
    rating: 5,
    quote:
      "As a founder, I have ideas constantly flowing. This tool helps me capture everything instantly and the AI copilot helps me refine concepts into actionable business plans.",
  },
  {
    name: "Emily Watson",
    role: "Design Student",
    company: "Stanford University",
    avatar: "/young-woman-with-blonde-hair-and-creative-style.jpg",
    rating: 5,
    quote:
      "The voice capture feature is a game-changer for creative brainstorming. I can record ideas while sketching, and the AI organizes everything beautifully.",
  },
  {
    name: "David Kim",
    role: "Innovation Director",
    company: "Global Corp",
    avatar: "/asian-businessman-confident.png",
    rating: 5,
    quote:
      "Our innovation team uses MyIdeaCopilot for all ideation sessions. The competitor research and market validation features help us make data-driven decisions quickly.",
  },
  {
    name: "Lisa Thompson",
    role: "Content Creator",
    company: "Creative Studios",
    avatar: "/woman-with-curly-red-hair-and-artistic-style.jpg",
    rating: 5,
    quote:
      "I love how the mindmaps help me visualize content strategies. The AI suggestions often spark new creative directions I wouldn't have thought of alone.",
  },
  {
    name: "Alex Johnson",
    role: "Research Scientist",
    company: "BioTech Labs",
    avatar: "/person-with-short-brown-hair-and-lab-coat.jpg",
    rating: 5,
    quote:
      "Perfect for managing research hypotheses and experimental ideas. The timeline feature helps track the evolution of concepts from initial spark to published paper.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-muted/10">
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 gradient-secondary opacity-5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-64 h-64 gradient-accent opacity-5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
            <Quote className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">Testimonials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              creators worldwide
            </span>
          </h2>

          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Join thousands of students, professionals, and founders who have transformed their creative process with
            MyIdeaCopilot.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="glass-strong p-6 rounded-2xl hover:glow-primary transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
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
                <blockquote className="text-foreground/90 text-pretty leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3 pt-4 border-t border-border/30">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                  />
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              50K+
            </div>
            <p className="text-sm text-muted-foreground">Active users</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              1M+
            </div>
            <p className="text-sm text-muted-foreground">Ideas captured</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              4.9
            </div>
            <p className="text-sm text-muted-foreground">Average rating</p>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              99%
            </div>
            <p className="text-sm text-muted-foreground">User satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  )
}
