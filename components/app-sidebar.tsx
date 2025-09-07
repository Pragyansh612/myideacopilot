"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LayoutDashboard, Lightbulb, Bot, Settings, Menu, X, LogOut } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Ideas",
    href: "/ideas",
    icon: Lightbulb,
  },
  {
    name: "AI Copilot",
    href: "/copilot",
    icon: Bot,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <div className="flex flex-col flex-grow glass-strong border-r border-border/50">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border/50">
            <Link href="/dashboard" className="flex items-center space-x-2 pulse-on-hover">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MyIdeaCopilot
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 glow-primary shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 btn-hover-lift",
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                  )}
                  <item.icon
                    className={cn(
                      "w-5 h-5 mr-3 transition-all duration-300",
                      isActive ? "text-primary scale-110" : "group-hover:scale-105",
                    )}
                  />
                  <span className="transition-all duration-300">{item.name}</span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground btn-hover-lift"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/dashboard" className="flex items-center space-x-2 pulse-on-hover">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MyIdeaCopilot
            </span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn-hover-scale"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="glass-strong border-t border-border/50 p-4 stagger-fade-in">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 glow-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 btn-hover-lift",
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
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50">
        <nav className="flex items-center justify-around py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center px-3 py-2 text-xs font-medium transition-all duration-300 relative",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground btn-hover-scale",
                )}
              >
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full glow-primary" />
                )}
                <item.icon
                  className={cn("w-5 h-5 mb-1 transition-all duration-300", isActive ? "glow-primary scale-110" : "")}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
