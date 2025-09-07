import { AppLayout } from "@/components/app-layout"
import { GlassSpinner } from "@/components/glass-spinner"
import { GlassSkeleton } from "@/components/glass-skeleton"

interface PageLoadingProps {
  title?: string
  showHeader?: boolean
  showSpinner?: boolean
}

export function PageLoading({ title = "Loading...", showHeader = true, showSpinner = true }: PageLoadingProps) {
  return (
    <AppLayout>
      {showHeader && (
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <GlassSkeleton className="h-8 w-48" />
              <GlassSkeleton className="h-4 w-96" />
            </div>
            <GlassSkeleton className="h-10 w-32" />
          </div>
        </div>
      )}

      <div className="p-6">
        {showSpinner && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <GlassSpinner size="lg" />
              <p className="text-muted-foreground">{title}</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
