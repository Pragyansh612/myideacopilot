"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Mail } from "lucide-react"
import Link from "next/link"

export function JoinUs() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Join Our{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Journey
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We're always looking for talented, passionate people to join our mission of empowering creativity worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="gradient-primary hover:scale-105 transition-all duration-300 shadow-xl group h-12 px-8 text-base font-semibold"
            >
              <Link href="/careers" className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="glass hover:bg-muted/50 transition-all duration-300 h-12 px-8 text-base font-semibold border-border/50 bg-transparent"
            >
              <Link href="/contact" className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Get in Touch
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Remote
              </div>
              <p className="text-xs text-muted-foreground">Work From Anywhere</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Flexible
              </div>
              <p className="text-xs text-muted-foreground">Work-Life Balance</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Growth
              </div>
              <p className="text-xs text-muted-foreground">Learning & Development</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}