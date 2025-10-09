"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useRouter } from "next/navigation"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { AuthAPI } from "@/lib/api/auth"
import { TokenManager } from "@/lib/auth/tokens"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    display_name: ""
  })
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const router = useRouter()

  // Check if user is already authenticated
  useEffect(() => {
    if (TokenManager.isAuthenticated()) {
      router.push('/dashboard')
    } else {
      setIsCheckingAuth(false)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      console.log('Attempting signup...') // Debug log
      
      const response = await AuthAPI.signup({
        email: formData.email,
        password: formData.password,
        display_name: formData.display_name || undefined
      })

      console.log('Signup response received:', response) // Debug log

      // Extract tokens from the correct path: data.session
      const access_token = response?.data?.session?.access_token
      const refresh_token = response?.data?.session?.refresh_token

      if (!access_token || !refresh_token) {
        console.error('Missing tokens in response structure:', {
          hasData: !!response?.data,
          hasSession: !!response?.data?.session,
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
          fullResponse: response
        })
        throw new Error('Unable to extract authentication tokens from server response')
      }

      console.log('Tokens extracted successfully:', {
        accessTokenLength: access_token.length,
        refreshTokenLength: refresh_token.length
      })

      // Store tokens in localStorage
      TokenManager.setTokens(access_token, refresh_token)
      console.log('Tokens stored in localStorage')

      // Set cookies via API for immediate middleware access
      console.log('Setting cookies via API...')
      const cookieResponse = await fetch('/api/auth/set-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token,
          refresh_token
        }),
      })

      if (!cookieResponse.ok) {
        const errorData = await cookieResponse.json()
        console.error('Failed to set cookies:', errorData)
        throw new Error(`Failed to set authentication cookies: ${errorData.error || 'Unknown error'}`)
      }

      const cookieResult = await cookieResponse.json()
      console.log('Cookies set successfully:', cookieResult)

      // Small delay to ensure cookies are set before redirect
      await new Promise(resolve => setTimeout(resolve, 150))

      console.log('Redirecting to dashboard')

      // Force a hard navigation to ensure middleware picks up cookies
      window.location.href = '/dashboard'
    } catch (err) {
      console.error('Signup error:', err)
      const errorMessage = err instanceof Error ? err.message : "Signup failed. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start your creative journey with MyIdeaCopilot">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="display_name">Display Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="Enter your name"
              className="pl-10 glass focus:ring-2 focus:ring-primary/50 focus:glow-primary transition-all duration-300"
              value={formData.display_name}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="pl-10 glass focus:ring-2 focus:ring-primary/50 focus:glow-primary transition-all duration-300"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password (min 6 characters)"
              className="pl-10 pr-10 glass focus:ring-2 focus:ring-primary/50 focus:glow-primary transition-all duration-300"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Must be at least 6 characters long</p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full gradient-primary hover:glow-primary transition-all duration-300"
          disabled={isLoading || !formData.email || formData.password.length < 6}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Google Signup */}
        <Button
          type="button"
          variant="outline"
          className="w-full glass hover:glow-secondary transition-all duration-300 bg-transparent"
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
      </form>

      {/* Sign in link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}