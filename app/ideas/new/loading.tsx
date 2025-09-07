import { AppLayout } from "@/components/app-layout"
import { GlassSkeleton } from "@/components/glass-skeleton"

export default function NewIdeaLoading() {
  return (
    <AppLayout>
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <GlassSkeleton className="h-8 w-32" />
            <GlassSkeleton className="h-4 w-64" />
          </div>
          <GlassSkeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Form Loading */}
        <div className="glass rounded-lg p-8 space-y-6">
          <div className="space-y-2">
            <GlassSkeleton className="h-4 w-16" />
            <GlassSkeleton className="h-12 w-full" />
          </div>

          <div className="space-y-2">
            <GlassSkeleton className="h-4 w-24" />
            <GlassSkeleton className="h-32 w-full" />
          </div>

          <div className="space-y-2">
            <GlassSkeleton className="h-4 w-20" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <GlassSkeleton key={i} className="h-8 w-16" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <GlassSkeleton className="h-4 w-20" />
            <GlassSkeleton className="h-10 w-48" />
          </div>

          <div className="flex gap-3 pt-4">
            <GlassSkeleton className="h-12 w-24" />
            <GlassSkeleton className="h-12 flex-1" />
          </div>
        </div>

        {/* AI Suggestions Loading */}
        <div className="glass rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <GlassSkeleton className="w-6 h-6" />
            <GlassSkeleton className="h-5 w-32" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <GlassSkeleton className="w-4 h-4 mt-1" />
                <GlassSkeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
