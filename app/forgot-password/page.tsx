"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { Mail, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate password reset process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent a password reset link to your email address">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground text-pretty">
            If an account with that email exists, you'll receive a password reset link shortly.
          </p>
          <Button asChild className="w-full gradient-primary hover:glow-primary transition-all duration-300">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-10 glass focus:ring-2 focus:ring-primary/50 focus:glow-primary transition-all duration-300"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full gradient-primary hover:glow-primary transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {/* Back to login */}
      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center space-x-1"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
