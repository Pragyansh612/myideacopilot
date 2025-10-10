import type React from "react"
import { Brain } from "lucide-react"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-background/50" />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full gradient-secondary opacity-20 blur-2xl animate-pulse" />
      <div className="absolute top-40 right-20 w-40 h-40 rounded-full gradient-accent opacity-15 blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-36 h-36 rounded-full gradient-primary opacity-25 blur-2xl animate-pulse delay-500" />

      <div className="relative w-full max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div className="p-3 rounded-xl gradient-primary group-hover:glow-primary transition-all duration-300">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              MyIdeaCopilot
            </span>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="glass-strong p-8 rounded-2xl hover:glow-primary transition-all duration-500">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-muted-foreground text-pretty">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center space-x-1"
          >
            <span>← Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
