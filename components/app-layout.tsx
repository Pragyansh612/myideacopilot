import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
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
