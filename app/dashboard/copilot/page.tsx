"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmptyState } from "@/components/empty-state"
import { Send, Bot, User, Sparkles, Lightbulb, TrendingUp, Target } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
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

const aiResponses = [
  "That's a fascinating idea! Let me help you explore this concept further. What specific problem are you trying to solve?",
  "I love the direction you're thinking in. Here are some ways we could expand on that concept...",
  "Great question! Based on current market trends, I'd suggest considering these approaches...",
  "That's an innovative perspective. Let's break this down into actionable steps...",
  "Interesting! Have you considered how this might scale or what the user experience would look like?",
  "I can see the potential in this idea. What resources would you need to get started?",
]

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    if (!hasStartedChat) {
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "Hello! I'm your AI Copilot, here to help you brainstorm, refine, and develop your ideas. What would you like to explore today?",
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

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <AppLayout>
      <PageHeader title="AI Copilot" description="Your creative thinking partner" />

      <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
        {!hasStartedChat && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
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
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
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
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
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
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </>
        )}

        <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-6">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your ideas..."
                className="glass border-border/50 focus:border-primary/50 focus:glow-primary pr-12"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="gradient-primary hover:glow-primary"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI responses are simulated. In production, this would connect to a real AI service.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
