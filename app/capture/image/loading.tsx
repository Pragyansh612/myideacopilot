import { AppLayout } from "@/components/app-layout"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ImageCaptureLoading() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-white/10 p-12">
              <div className="text-center space-y-4">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-6 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-12" />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card className="glass-card border-white/10 p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-16" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="glass-card border-white/10 p-4">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-5 w-5 mx-auto" />
                    <Skeleton className="h-5 w-8 mx-auto" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                </Card>
              ))}
            </div>

            <Card className="glass-card border-white/10 p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-3 w-full" />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
