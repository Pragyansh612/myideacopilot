"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Lightbulb, Layers, Sparkles } from "lucide-react"
import { FeatureAPI, PhaseAPI, type SuggestedItem } from "@/lib/api/idea"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface SuggestedItemsBarProps {
  items: SuggestedItem[]
  ideaId: string
  onItemCreated: (item: SuggestedItem) => void
  onError: (error: string) => void
}

export function SuggestedItemsBar({ items, ideaId, onItemCreated, onError }: SuggestedItemsBarProps) {
  const [creating, setCreating] = useState<string | null>(null)
  const [createdItems, setCreatedItems] = useState<string[]>([])

  if (items.length === 0) return null

  const handleCreateItem = async (item: SuggestedItem, index: number) => {
    try {
      const itemKey = `${item.type}-${index}`
      setCreating(itemKey)

      if (item.type === "feature") {
        await FeatureAPI.createFeatureForIdea(ideaId, {
          title: item.title,
          description: item.description,
          priority: (item.priority as "low" | "medium" | "high") || "medium",
        })
      } else if (item.type === "phase") {
        await PhaseAPI.createPhase(ideaId, {
          name: item.title,
          description: item.description,
          order_index: 0,
        })
      }

      setCreatedItems(prev => [...prev, itemKey])
      onItemCreated(item)
      
      setTimeout(() => {
        setCreating(null)
      }, 500)
    } catch (err) {
      setCreating(null)
      onError(err instanceof Error ? err.message : "Failed to create item")
    }
  }

  const remainingItems = items.filter((_, idx) => !createdItems.includes(`${items[idx].type}-${idx}`))

  return (
    <div className="fixed bottom-24 right-6 max-w-sm space-y-2 pointer-events-auto z-40 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 px-2">
        <div className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="text-xs font-semibold text-muted-foreground">AI Suggestions</span>
        </div>
      </div>

      {remainingItems.map((item, idx) => {
        const originalIndex = items.findIndex(
          i => i.title === item.title && i.type === item.type
        )
        const itemKey = `${item.type}-${originalIndex}`
        const isCreating = creating === itemKey

        return (
          <Card 
            key={`${item.type}-${item.title}`}
            className="glass hover:glass-strong transition-all border-primary/20 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <CardContent className="p-3 space-y-2">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0">
                  {item.type === "feature" ? (
                    <Lightbulb className="w-4 h-4 text-primary" />
                  ) : (
                    <Layers className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {item.priority && (
                  <Badge 
                    variant={
                      item.priority === 'high' ? 'default' :
                      item.priority === 'medium' ? 'secondary' :
                      'outline'
                    }
                    className="text-xs"
                  >
                    {item.priority}
                  </Badge>
                )}
                <div className="ml-auto flex gap-1">
                  <Button
                    size="sm"
                    className="gradient-primary h-7 px-2"
                    onClick={() => handleCreateItem(item, originalIndex)}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {remainingItems.length > 0 && (
        <p className="text-xs text-muted-foreground text-center px-2">
          Click to create from AI suggestions
        </p>
      )}
    </div>
  )
}