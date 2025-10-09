"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LayoutDashboard, Lightbulb, Bot, Settings, Menu, X, LogOut, Brain } from "lucide-react"
import { TokenManager } from "@/lib/auth/tokens"
import { AuthAPI } from "@/lib/api/auth"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Ideas",
    href: "/dashboard/ideas",
    icon: Lightbulb,
  },
  {
    name: "AI Copilot",
    href: "/dashboard/copilot",
    icon: Bot,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

const handleLogout = async () => {
  try {
    // Get access token before clearing
    const accessToken = TokenManager.getAccessToken();
    
    // Call backend logout API if token exists
    if (accessToken) {
      try {
        await AuthAPI.logout(accessToken);
      } catch (error) {
        console.error('Backend logout failed:', error);
        // Continue with client-side logout even if backend fails
      }
    }
    
    // Clear cookies via API route
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    // Clear localStorage
    TokenManager.clearTokens();
    
    // Redirect to login
    router.push("/login");
  } catch (error) {
    console.error('Logout error:', error);
    // Force logout even if there's an error
    TokenManager.clearTokens();
    router.push("/login");
  }
}

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <div className="flex flex-col flex-grow glass-strong border-r border-border/50 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border/50">
            <Link href="/dashboard" className="flex items-center space-x-2 group transition-all duration-300">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center group-hover:scale-110 group-hover:glow-primary transition-all duration-300">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                MyIdeaCopilot
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent rounded-r-full glow-primary" />
                  )}
                  <item.icon
                    className={cn(
                      "w-5 h-5 mr-3 transition-all duration-300",
                      isActive ? "text-primary scale-110" : "group-hover:scale-110",
                    )}
                  />
                  <span className="transition-all duration-300">{item.name}</span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50 backdrop-blur-xl">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MyIdeaCopilot
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-muted/50 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="glass-strong border-t border-border/50 p-4 animate-in slide-in-from-top duration-200">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                    )}
                    <item.icon
                      className={cn(
                        "w-5 h-5 mr-3 transition-all duration-300",
                        isActive ? "text-primary scale-110" : "",
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-3 pt-3 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50 backdrop-blur-xl safe-area-bottom">
        <nav className="flex items-center justify-around py-2 px-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center px-2 py-2 text-xs font-medium transition-all duration-300 relative min-w-0 flex-1",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full glow-primary" />
                )}
                <item.icon
                  className={cn("w-5 h-5 mb-1 transition-all duration-300", isActive ? "scale-110" : "")}
                />
                <span className="truncate w-full text-center">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}