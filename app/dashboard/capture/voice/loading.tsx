import { AppLayout } from "@/components/app-layout"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function VoiceCaptureLoading() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recording Interface Skeleton */}
          <div className="space-y-6">
            <Card className="glass-card border-white/10 p-12 text-center">
              <div className="space-y-6">
                <Skeleton className="w-32 h-32 rounded-full mx-auto" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              </div>
            </Card>

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

          {/* Transcription Area Skeleton */}
          <div className="space-y-6">
            <Card className="glass-card border-white/10 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-48 w-full" />
              </div>
            </Card>
          </div>
        </div>

        {/* Tips Skeleton */}
        <Card className="glass-card border-white/10 p-6">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 mt-0.5" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
