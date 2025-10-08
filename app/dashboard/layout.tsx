import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Dashboard layout content - no Navbar/Footer */}
      {children}
    </div>
  )
}