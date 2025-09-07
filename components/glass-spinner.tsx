import { cn } from "@/lib/utils"

interface GlassSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function GlassSpinner({ size = "md", className }: GlassSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 glass rounded-full animate-spin">
        <div className="absolute inset-1 rounded-full gradient-primary opacity-20" />
        <div className="absolute top-0 left-1/2 w-1 h-1 -translate-x-1/2 bg-primary rounded-full glow-primary" />
      </div>
    </div>
  )
}
