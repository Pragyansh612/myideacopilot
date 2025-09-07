import { AppLayout } from "@/components/app-layout"
import { GlassSkeleton, CardSkeleton } from "@/components/glass-skeleton"

export default function DashboardLoading() {
  return (
    <AppLayout>
      <div className="p-6 border-b border-border/50">
        <div className="space-y-2">
          <GlassSkeleton className="h-8 w-64" />
          <GlassSkeleton className="h-4 w-96" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Quick Actions Loading */}
        <section>
          <GlassSkeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <GlassSkeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2">
                    <GlassSkeleton className="h-4 w-20" />
                    <GlassSkeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Loading */}
        <section>
          <GlassSkeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <GlassSkeleton className="h-4 w-20" />
                    <GlassSkeleton className="h-8 w-12" />
                    <GlassSkeleton className="h-3 w-24" />
                  </div>
                  <GlassSkeleton className="w-10 h-10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Ideas Loading */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <GlassSkeleton className="h-6 w-32" />
            <GlassSkeleton className="h-8 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
