import { AppLayout } from "@/components/app-layout"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function QuickCaptureLoading() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Form Skeleton */}
        <Card className="glass-card border-white/10 p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16" />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </Card>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="glass-card border-white/10 p-4">
              <div className="text-center space-y-2">
                <Skeleton className="h-5 w-5 mx-auto" />
                <Skeleton className="h-5 w-8 mx-auto" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
