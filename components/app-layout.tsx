"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleSidebarCollapsedChange = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar onCollapsedChange={handleSidebarCollapsedChange} />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Mobile top padding for header */}
        <div className="lg:hidden h-16" />

        {/* Page Content */}
        <main className="min-h-screen pb-20 lg:pb-0">{children}</main>

        {/* Mobile bottom padding for navigation */}
        <div className="lg:hidden h-16" />
      </div>
    </div>
  )
}