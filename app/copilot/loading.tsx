import { AppLayout } from "@/components/app-layout"
import { GlassSkeleton } from "@/components/glass-skeleton"

export default function CopilotLoading() {
  return (
    <AppLayout>
      <div className="p-6 border-b border-border/50">
        <div className="space-y-2">
          <GlassSkeleton className="h-8 w-32" />
          <GlassSkeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
        {/* Chat Messages Loading */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* AI Message */}
          <div className="flex items-start space-x-3">
            <GlassSkeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="glass rounded-lg p-4 max-w-[70%]">
              <div className="space-y-2">
                <GlassSkeleton className="h-4 w-full" />
                <GlassSkeleton className="h-4 w-3/4" />
                <GlassSkeleton className="h-3 w-16 mt-2" />
              </div>
            </div>
          </div>

          {/* Suggested Prompts Loading */}
          <div className="space-y-4 mt-8">
            <GlassSkeleton className="h-4 w-48 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <GlassSkeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <GlassSkeleton className="h-4 w-24" />
                      <GlassSkeleton className="h-3 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area Loading */}
        <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-6">
          <div className="flex space-x-3">
            <GlassSkeleton className="flex-1 h-10" />
            <GlassSkeleton className="w-10 h-10" />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
