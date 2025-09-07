import { AppLayout } from "@/components/app-layout"
import { GlassSkeleton } from "@/components/glass-skeleton"

export default function SettingsLoading() {
  return (
    <AppLayout>
      <div className="p-6 border-b border-border/50">
        <div className="space-y-2">
          <GlassSkeleton className="h-8 w-24" />
          <GlassSkeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Section Loading */}
        <div className="glass rounded-lg p-6 space-y-6">
          <GlassSkeleton className="h-6 w-32" />
          <div className="flex items-start gap-6">
            <GlassSkeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <GlassSkeleton className="h-4 w-16" />
                  <GlassSkeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <GlassSkeleton className="h-4 w-12" />
                  <GlassSkeleton className="h-10 w-full" />
                </div>
              </div>
              <GlassSkeleton className="h-10 w-32" />
            </div>
          </div>
        </div>

        {/* Settings Sections Loading */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-lg p-6 space-y-4">
            <GlassSkeleton className="h-6 w-32" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <GlassSkeleton className="h-4 w-32" />
                    <GlassSkeleton className="h-3 w-48" />
                  </div>
                  <GlassSkeleton className="w-12 h-6" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
