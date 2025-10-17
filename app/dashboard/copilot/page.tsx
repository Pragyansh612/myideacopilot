"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmptyState } from "@/components/empty-state"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Lightbulb as IdeaIcon,
  CheckSquare,
  Layers,
  Users,
  X,
  Loader2,
  Paperclip,
  History,
  Clock
} from "lucide-react"
import { CopilotAPI, ChatRequest, ChatHistoryItem } from "@/lib/api/copilot"
import { IdeaAPI, Idea, type SuggestedItem } from "@/lib/api/idea"
import { SuggestedItemsBar } from "@/components/copilot/suggested-items-bar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  context_used?: any
  query_type?: string
  user_prompt?: string
  ai_response?: string
  suggested_items?: SuggestedItem[]
}

interface ContextItem {
  type: 'idea' | 'feature' | 'phase' | 'competitor'
  id: string
  title: string
  description?: string
}

const suggestedPrompts = [
  {
    icon: Lightbulb,
    title: "Brainstorm Ideas",
    prompt: "Help me brainstorm innovative ideas for a mobile app that solves everyday problems.",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    prompt: "What are the current trends in sustainable technology that I should consider for my next project?",
  },
  {
    icon: Target,
    title: "Refine Concept",
    prompt: "I have an idea for a productivity tool. Can you help me refine it and identify potential challenges?",
  },
  {
    icon: Sparkles,
    title: "Creative Inspiration",
    prompt: "I'm feeling stuck creatively. Can you give me some unique perspectives on problem-solving?",
  },
]

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [context, setContext] = useState<ContextItem[]>([])
  const [showContextDialog, setShowContextDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loadingIdeas, setLoadingIdeas] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historyTotal, setHistoryTotal] = useState(0)
  const [suggestedItems, setSuggestedItems] = useState<SuggestedItem[]>([])
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load first idea on mount for suggested items bar
  useEffect(() => {
    const loadFirstIdea = async () => {
      try {
        const result = await IdeaAPI.getIdeas({ limit: 1 })
        if (result.ideas.length > 0) {
          setSelectedIdeaId(result.ideas[0].id)
        }
      } catch (error) {
        console.error('Failed to load first idea:', error)
      }
    }
    loadFirstIdea()
  }, [])

  const loadIdeas = async () => {
    setLoadingIdeas(true)
    try {
      const result = await IdeaAPI.getIdeas({ limit: 100 })
      setIdeas(result.ideas)
      if (result.ideas.length > 0 && !selectedIdeaId) {
        setSelectedIdeaId(result.ideas[0].id)
      }
    } catch (error) {
      console.error('Failed to load ideas:', error)
    } finally {
      setLoadingIdeas(false)
    }
  }

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const result = await CopilotAPI.getHistory(50, 0)
      setChatHistory(result.logs)
      setHistoryTotal(result.total)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const loadConversationFromHistory = (historyItem: ChatHistoryItem) => {
    setMessages([])
    
    const welcomeMessage: Message = {
      id: "welcome",
      content: "Hello! I'm your AI Copilot, here to help you brainstorm, refine, and develop your ideas. What would you like to explore today?",
      sender: "ai",
      timestamp: new Date(),
    }

    const userMessage: Message = {
      id: `history-user-${historyItem.id}`,
      content: historyItem.user_prompt,
      sender: "user",
      timestamp: new Date(historyItem.created_at),
      user_prompt: historyItem.user_prompt,
    }

    const aiMessage: Message = {
      id: `history-ai-${historyItem.id}`,
      content: historyItem.ai_response,
      sender: "ai",
      timestamp: new Date(historyItem.created_at),
      context_used: historyItem.context_data?.matched_contexts,
      query_type: historyItem.query_type,
      ai_response: historyItem.ai_response,
    }

    setMessages([welcomeMessage, userMessage, aiMessage])
    setHasStartedChat(true)
    setShowHistoryDialog(false)

    if (historyItem.context_data?.matched_contexts) {
      const contexts: ContextItem[] = []
      const matched = historyItem.context_data.matched_contexts

      if (matched.idea) {
        contexts.push({
          type: 'idea',
          id: matched.idea.id,
          title: matched.idea.title,
          description: matched.idea.description,
        })
      }
      if (matched.feature) {
        contexts.push({
          type: 'feature',
          id: matched.feature.id,
          title: matched.feature.title,
          description: matched.feature.description,
        })
      }
      if (matched.competitor) {
        contexts.push({
          type: 'competitor',
          id: matched.competitor.id,
          title: matched.competitor.competitor_name,
        })
      }
      setContext(contexts)
    }
  }

  const addContextItem = (item: ContextItem) => {
    const exists = context.some(c => c.type === item.type && c.id === item.id)
    if (!exists) {
      setContext([...context, item])
    }
    setShowContextDialog(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const removeContextItem = (type: string, id: string) => {
    setContext(context.filter(c => !(c.type === type && c.id === id)))
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    if (!hasStartedChat) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: "Hello! I'm your AI Copilot, here to help you brainstorm, refine, and develop your ideas. What would you like to explore today?",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      setHasStartedChat(true)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const chatRequest: ChatRequest = {
        query: content.trim(),
      }

      context.forEach(item => {
        if (item.type === 'idea') chatRequest.idea_id = item.id
        if (item.type === 'feature') chatRequest.feature_id = item.id
        if (item.type === 'phase') chatRequest.phase_id = item.id
        if (item.type === 'competitor') chatRequest.competitor_id = item.id
      })

      const response = await CopilotAPI.chat(chatRequest)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: "ai",
        timestamp: new Date(),
        context_used: response.context_used,
        query_type: response.query_type,
        suggested_items: response.suggested_items,
      }
      setMessages((prev) => [...prev, aiMessage])
      
      if (response.suggested_items && response.suggested_items.length > 0) {
        setSuggestedItems(response.suggested_items)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  const getContextIcon = (type: string) => {
    switch (type) {
      case 'idea': return <IdeaIcon className="w-3 h-3" />
      case 'feature': return <CheckSquare className="w-3 h-3" />
      case 'phase': return <Layers className="w-3 h-3" />
      case 'competitor': return <Users className="w-3 h-3" />
      default: return null
    }
  }

  const getContextColor = (type: string) => {
    switch (type) {
      case 'idea': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'feature': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'phase': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'competitor': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const formatRelativeTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return then.toLocaleDateString()
  }

  return (
    <div className="flex flex-col h-screen">
      <PageHeader 
        title="AI Copilot" 
        description="Your creative thinking partner"
      >
        <Button
          variant="outline"
          size="sm"
          className="glass border-border/50"
          onClick={() => {
            loadHistory()
            setShowHistoryDialog(true)
          }}
        >
          <History className="w-4 h-4 mr-2" />
          History
        </Button>
      </PageHeader>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!hasStartedChat && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-2xl w-full space-y-8">
              <EmptyState
                icon={Bot}
                title="Start a conversation with your AI Copilot"
                description="Ask me anything about your ideas, brainstorm new concepts, get feedback, or explore creative possibilities. I'm here to help you think through problems and discover new opportunities."
                illustration="🤖"
              />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground text-center">Try asking me about:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedPrompts.map((prompt, index) => (
                    <Card
                      key={index}
                      className="glass hover:glass-strong cursor-pointer transition-all duration-300 hover:glow-primary group"
                      onClick={() => handleSuggestedPrompt(prompt.prompt)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <prompt.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {prompt.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{prompt.prompt}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.sender === "user" && context.length > 0 && (
                  <div className="flex justify-end mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap max-w-[80%] lg:max-w-[70%]">
                      {context.map((item) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${getContextColor(item.type)}`}
                        >
                          {getContextIcon(item.type)}
                          <span>{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-start space-x-3 ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={message.sender === "ai" ? "gradient-primary" : "bg-secondary"}>
                      {message.sender === "ai" ? (
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <User className="w-4 h-4 text-secondary-foreground" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`max-w-[80%] lg:max-w-[70%] ${
                      message.sender === "user" ? "glass-strong border-primary/20 ml-auto" : "glass border-border/50"
                    } rounded-lg p-4`}
                  >
                    {message.sender === "ai" ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                    
                    {message.query_type && message.sender === "ai" && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <span className="text-xs text-muted-foreground">
                          Query Type: <span className="font-medium">{message.query_type}</span>
                        </span>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="gradient-primary">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="glass border-border/50 rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm flex-shrink-0">
          {context.length > 0 && (
            <div className="px-6 pt-3 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground">Active Context:</span>
                {context.map((item) => (
                  <Badge
                    key={`${item.type}-${item.id}`}
                    variant="secondary"
                    className={`flex items-center gap-1.5 pr-1 ${getContextColor(item.type)} border`}
                  >
                    {getContextIcon(item.type)}
                    <span className="text-xs font-medium">{item.title}</span>
                    <button
                      onClick={() => removeContextItem(item.type, item.id)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-3 p-6 pt-3">
            <Dialog open={showContextDialog} onOpenChange={setShowContextDialog}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="glass border-border/50 hover:border-primary/50 relative h-10 w-10 flex-shrink-0"
                  onClick={() => {
                    loadIdeas()
                    setShowContextDialog(true)
                  }}
                >
                  <Paperclip className="w-4 h-4" />
                  {context.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                      {context.length}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="glass max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Add Context</DialogTitle>
                  <DialogDescription>
                    Select ideas, features, phases, or competitors to provide context for your conversation
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4">
                    {loadingIdeas ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                          <IdeaIcon className="w-4 h-4 text-blue-500" />
                          Ideas
                        </h4>
                        <div className="space-y-2">
                          {ideas.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No ideas found. Create some ideas first!
                            </p>
                          ) : (
                            ideas.map((idea) => {
                              const isSelected = context.some(c => c.type === 'idea' && c.id === idea.id)
                              return (
                                <Card
                                  key={idea.id}
                                  className={`glass hover:glass-strong cursor-pointer transition-all ${
                                    isSelected ? 'ring-2 ring-primary' : ''
                                  }`}
                                  onClick={() => addContextItem({
                                    type: 'idea',
                                    id: idea.id,
                                    title: idea.title,
                                    description: idea.description
                                  })}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{idea.title}</div>
                                        {idea.description && (
                                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {idea.description}
                                          </p>
                                        )}
                                      </div>
                                      {isSelected && (
                                        <CheckSquare className="w-4 h-4 text-primary flex-shrink-0" />
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={context.length > 0 ? `Ask about ${context[0].title}...` : "Ask me anything about your ideas..."}
                className="glass border-border/50 focus:border-primary/50 focus:glow-primary min-h-[44px] max-h-32 resize-none py-3"
                disabled={isTyping}
                rows={1}
              />
              <div className="absolute right-3 top-3">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="gradient-primary hover:glow-primary h-10 w-10 p-0 flex-shrink-0"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Suggested Items Bar */}
      {selectedIdeaId && suggestedItems.length > 0 && (
        <SuggestedItemsBar 
          items={suggestedItems}
          ideaId={selectedIdeaId}
          onItemCreated={() => {
            setSuggestedItems([])
          }}
          onError={(error) => console.error('Error creating item:', error)}
        />
      )}

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="glass max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Chat History
            </DialogTitle>
            <DialogDescription>
              View and continue from your previous conversations ({historyTotal} total)
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Clock className="w-12 h-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No chat history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((item) => (
                  <Card
                    key={item.id}
                    className="glass hover:glass-strong cursor-pointer transition-all group"
                    onClick={() => loadConversationFromHistory(item)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {item.user_prompt}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                              {item.ai_response}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              {item.query_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(item.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        {item.context_data?.context_entities && item.context_data.context_entities.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/30">
                            {item.context_data.context_entities.map((entity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {entity}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}