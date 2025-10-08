import type React from "react"
import type { Metadata } from "next"
import { AppLayout } from "@/components/app-layout"

export const metadata: Metadata = {
  title: "Dashboard | MyIdeaCopilot - AI-Powered Idea Manager",
  description: "Manage and organize your ideas with AI-powered insights. Track your creative journey and bring your ideas to life.",
  keywords: ["dashboard", "idea management", "AI copilot", "creativity", "innovation"],
  openGraph: {
    title: "Dashboard | MyIdeaCopilot",
    description: "Manage and organize your ideas with AI-powered insights",
    type: "website",
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}