import Link from "next/link"
import { Brain, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/30">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-lg gradient-primary">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MyIdeaCopilot
              </span>
            </Link>
            <p className="text-muted-foreground text-pretty max-w-xs">
              Transform your scattered thoughts into organized, actionable ideas with AI-powered creativity tools.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <div className="space-y-2 text-sm">
              <Link href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/api" className="block text-muted-foreground hover:text-foreground transition-colors">
                API
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="/careers" className="block text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="block text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
              <Link href="/security" className="block text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">© 2024 MyIdeaCopilot. All rights reserved.</p>

          <div className="flex items-center space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
