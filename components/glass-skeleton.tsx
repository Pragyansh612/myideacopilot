import { cn } from "@/lib/utils"

interface GlassSkeletonProps {
  className?: string
  shimmer?: boolean
}

export function GlassSkeleton({ className, shimmer = true }: GlassSkeletonProps) {
  return (
    <div
      className={cn(
        "glass rounded-lg bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30",
        shimmer && "animate-pulse",
        className,
      )}
    />
  )
}

interface CardSkeletonProps {
  showHeader?: boolean
  showContent?: boolean
  showFooter?: boolean
  className?: string
}

export function CardSkeleton({
  showHeader = true,
  showContent = true,
  showFooter = true,
  className,
}: CardSkeletonProps) {
  return (
    <div className={cn("glass rounded-lg p-6 space-y-4", className)}>
      {showHeader && (
        <div className="space-y-2">
          <GlassSkeleton className="h-5 w-3/4" />
          <GlassSkeleton className="h-4 w-1/2" />
        </div>
      )}

      {showContent && (
        <div className="space-y-2">
          <GlassSkeleton className="h-4 w-full" />
          <GlassSkeleton className="h-4 w-5/6" />
          <GlassSkeleton className="h-4 w-4/6" />
        </div>
      )}

      {showFooter && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <GlassSkeleton className="h-6 w-16" />
            <GlassSkeleton className="h-6 w-20" />
          </div>
          <GlassSkeleton className="h-4 w-24" />
        </div>
      )}
    </div>
  )
}
