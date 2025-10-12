"use client"

import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { PenTool, Mic, ImageIcon, FileText, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export default function CapturePage() {
  const captureOptions = [
    {
      id: "quick",
      title: "Quick Capture",
      description: "Jot down ideas instantly",
      icon: PenTool,
      href: "/capture/quick",
      gradient: "from-blue-500/20 to-teal-500/20",
      iconGradient: "from-blue-500 to-teal-500",
      emoji: "✍️",
    },
    {
      id: "voice",
      title: "Voice Capture",
      description: "Record your thoughts",
      icon: Mic,
      href: "/capture/voice",
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconGradient: "from-emerald-500 to-teal-500",
      emoji: "🎤",
    },
    {
      id: "image",
      title: "Image Capture",
      description: "Upload visual inspiration",
      icon: ImageIcon,
      href: "/capture/image",
      gradient: "from-teal-500/20 to-cyan-500/20",
      iconGradient: "from-teal-500 to-cyan-500",
      emoji: "🖼️",
    },
    {
      id: "document",
      title: "Document Capture",
      description: "Import PDFs and docs",
      icon: FileText,
      href: "/capture/document",
      gradient: "from-cyan-500/20 to-blue-500/20",
      iconGradient: "from-cyan-500 to-blue-500",
      emoji: "📄",
    },
  ]

  return (
    <>
      <div className="space-y-8">
        <PageHeader title="Capture Ideas" description="Choose how you'd like to capture your next big idea" />

        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-teal-500/5 to-emerald-500/5 rounded-3xl blur-3xl" />
          <Card className="relative glass-card border-white/10 p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-emerald-500/20 backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Multi-Modal Idea Capture
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transform any inspiration into actionable ideas. Whether it's a quick thought, voice memo, visual concept,
              or document insight - we've got you covered.
            </p>
          </Card>
        </div>

        {/* Capture Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {captureOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Link key={option.id} href={option.href}>
                <Card
                  className={`glass-card border-white/10 p-8 group hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden`}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`p-4 rounded-2xl bg-gradient-to-r ${option.iconGradient} bg-opacity-10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent
                          className={`h-8 w-8 bg-gradient-to-r ${option.iconGradient} bg-clip-text text-transparent`}
                        />
                      </div>
                      <div className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        {option.emoji}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {option.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">{option.description}</p>

                    <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                      <span>Get started</span>
                      <Zap className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${option.iconGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg`}
                  />
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Ideas Captured", value: "247", icon: "💡" },
            { label: "Voice Memos", value: "18", icon: "🎤" },
            { label: "Images Saved", value: "32", icon: "🖼️" },
            { label: "Docs Processed", value: "9", icon: "📄" },
          ].map((stat, index) => (
            <Card key={index} className="glass-card border-white/10 p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-blue-400 mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
