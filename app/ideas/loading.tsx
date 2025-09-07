import { AppLayout } from "@/components/app-layout"
import { GlassSkeleton, CardSkeleton } from "@/components/glass-skeleton"

export default function IdeasLoading() {
  return (
    <AppLayout>
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <GlassSkeleton className="h-8 w-32" />
            <GlassSkeleton className="h-4 w-48" />
          </div>
          <GlassSkeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search and Filters Loading */}
        <div className="glass p-4 rounded-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <GlassSkeleton className="flex-1 h-10" />
            <div className="flex gap-2">
              <GlassSkeleton className="w-40 h-10" />
              <GlassSkeleton className="w-32 h-10" />
              <GlassSkeleton className="w-20 h-10" />
            </div>
          </div>
        </div>

        {/* Ideas Grid Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
