import type React from "react"
interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 lg:top-0 z-40">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
          {children && <div className="flex items-center space-x-2">{children}</div>}
        </div>
      </div>
    </div>
  )
}
