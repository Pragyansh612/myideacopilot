"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  X,
  Save,
  ArrowLeft,
  Sparkles,
  Download,
  Eye,
  Clock,
  BarChart3,
  Plus,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface UploadedDocument {
  id: string
  file: File
  name: string
  size: string
  type: string
  aiSummary: string
  keyInsights: string[]
  isProcessing: boolean
  processingProgress: number
}

export default function DocumentCapturePage() {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulated AI summaries for different document types
  const aiSummaries = [
    "This research paper explores innovative approaches to sustainable urban development, focusing on green infrastructure and smart city technologies. Key findings include the potential for 40% reduction in energy consumption through integrated IoT systems and renewable energy sources.",
    "A comprehensive business plan outlining a new fintech startup focused on micro-lending for small businesses. The document details market analysis, competitive landscape, and projected revenue streams with a 3-year growth strategy.",
    "Technical documentation for a machine learning framework designed for real-time data processing. The paper covers architecture design, performance benchmarks, and implementation guidelines for enterprise applications.",
    "Strategic marketing report analyzing consumer behavior trends in the digital marketplace. Includes data-driven insights on customer acquisition, retention strategies, and emerging market opportunities.",
    "Academic thesis on the intersection of artificial intelligence and creative industries. Explores how AI tools are transforming content creation, design processes, and artistic expression in the modern era.",
  ]

  const keyInsightsList = [
    ["Sustainable development", "Smart cities", "IoT integration", "Energy efficiency"],
    ["Fintech innovation", "Micro-lending", "Market analysis", "Growth strategy"],
    ["Machine learning", "Real-time processing", "Enterprise solutions", "Performance optimization"],
    ["Digital marketing", "Consumer behavior", "Data analytics", "Market trends"],
    ["AI creativity", "Content creation", "Design automation", "Artistic innovation"],
  ]

  const suggestedTags = [
    "research",
    "business",
    "technical",
    "strategy",
    "analysis",
    "innovation",
    "planning",
    "documentation",
    "insights",
    "reference",
  ]

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄"
    if (type.includes("word") || type.includes("document")) return "📝"
    if (type.includes("presentation")) return "📊"
    if (type.includes("spreadsheet")) return "📈"
    return "📋"
  }

  const generateAISummary = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * aiSummaries.length)
    return {
      summary: aiSummaries[randomIndex],
      insights: keyInsightsList[randomIndex],
    }
  }, [])

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return

      Array.from(files).forEach((file) => {
        // Check if file is a document type
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
        ]

        if (allowedTypes.some((type) => file.type.includes(type.split("/")[1]))) {
          const id = Math.random().toString(36).substr(2, 9)

          const newDocument: UploadedDocument = {
            id,
            file,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            aiSummary: "",
            keyInsights: [],
            isProcessing: true,
            processingProgress: 0,
          }

          setUploadedDocuments((prev) => [...prev, newDocument])

          // Simulate processing with progress
          const progressInterval = setInterval(() => {
            setUploadedDocuments((prev) =>
              prev.map((doc) =>
                doc.id === id
                  ? {
                      ...doc,
                      processingProgress: Math.min(doc.processingProgress + Math.random() * 15, 95),
                    }
                  : doc,
              ),
            )
          }, 300)

          // Complete processing after random time
          setTimeout(
            () => {
              clearInterval(progressInterval)
              const { summary, insights } = generateAISummary()

              setUploadedDocuments((prev) =>
                prev.map((doc) =>
                  doc.id === id
                    ? {
                        ...doc,
                        aiSummary: summary,
                        keyInsights: insights,
                        isProcessing: false,
                        processingProgress: 100,
                      }
                    : doc,
                ),
              )
            },
            3000 + Math.random() * 4000,
          )
        }
      })
    },
    [generateAISummary],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files)
    },
    [handleFileSelect],
  )

  const removeDocument = (id: string) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSave = async () => {
    if (!title.trim() || uploadedDocuments.length === 0) return

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSaving(false)
    // Reset form
    setUploadedDocuments([])
    setTitle("")
    setNotes("")
    setSelectedTags([])
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/capture">
            <Button variant="ghost" size="sm" className="glass-button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <PageHeader title="Document Capture" description="Upload documents and extract key insights with AI" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drag & Drop Zone */}
            <Card
              className={`glass-card border-2 border-dashed transition-all duration-300 ${
                isDragOver
                  ? "border-blue-400/50 bg-blue-500/5"
                  : uploadedDocuments.length > 0
                    ? "border-white/20"
                    : "border-white/30"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-12 text-center">
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-full mx-auto w-fit transition-all duration-300 ${
                      isDragOver ? "bg-blue-500/20 scale-110" : "bg-gradient-to-r from-blue-500/10 to-teal-500/10"
                    }`}
                  >
                    <Upload className={`h-12 w-12 ${isDragOver ? "text-blue-400" : "text-blue-400/70"}`} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {isDragOver ? "Drop your documents here" : "Upload your documents"}
                    </h3>
                    <p className="text-muted-foreground">
                      Drag and drop documents here, or{" "}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        browse files
                      </button>
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="glass-badge">
                      PDF
                    </Badge>
                    <Badge variant="secondary" className="glass-badge">
                      DOCX
                    </Badge>
                    <Badge variant="secondary" className="glass-badge">
                      PPTX
                    </Badge>
                    <Badge variant="secondary" className="glass-badge">
                      TXT
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Uploaded Documents */}
            {uploadedDocuments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Uploaded Documents ({uploadedDocuments.length})</h3>
                <div className="space-y-4">
                  {uploadedDocuments.map((document) => (
                    <Card key={document.id} className="glass-card border-white/10">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* File Icon */}
                          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-teal-500/10 flex-shrink-0">
                            <div className="text-2xl">{getFileIcon(document.type)}</div>
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium truncate">{document.name}</h4>
                                <p className="text-sm text-muted-foreground">{document.size}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => removeDocument(document.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Processing Progress */}
                            {document.isProcessing && (
                              <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-blue-400">
                                  <div className="animate-spin rounded-full h-3 w-3 border border-blue-400/30 border-t-blue-400" />
                                  <span>Processing document...</span>
                                </div>
                                <Progress value={document.processingProgress} className="h-2" />
                              </div>
                            )}

                            {/* AI Summary */}
                            {!document.isProcessing && document.aiSummary && (
                              <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm font-medium">AI Summary</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{document.aiSummary}</p>

                                {/* Key Insights */}
                                <div className="space-y-2">
                                  <span className="text-sm font-medium text-blue-400">Key Insights</span>
                                  <div className="flex flex-wrap gap-2">
                                    {document.keyInsights.map((insight, index) => (
                                      <Badge key={index} variant="secondary" className="glass-badge text-xs">
                                        {insight}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Idea Details Sidebar */}
          <div className="space-y-6">
            {/* Idea Form */}
            <Card className="glass-card border-white/10 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Document Insights
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your document insights a title..."
                    className="glass-input border-white/10 focus:border-blue-400/50 focus:ring-blue-400/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your thoughts about these documents..."
                    className="glass-input min-h-[100px] border-white/10 focus:border-blue-400/50 focus:ring-blue-400/20 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "secondary"}
                        className={`cursor-pointer transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-blue-500/20 text-blue-400 border-blue-400/30"
                            : "glass-badge hover:bg-blue-500/10 hover:border-blue-400/20"
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {selectedTags.includes(tag) ? (
                          <X className="h-3 w-3 mr-1" />
                        ) : (
                          <Plus className="h-3 w-3 mr-1" />
                        )}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={!title.trim() || uploadedDocuments.length === 0 || isSaving}
                  className="w-full glass-button bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
                      Saving Insights...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Document Insights
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Processing Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Documents", value: uploadedDocuments.length.toString(), icon: FileText },
                {
                  label: "Processing",
                  value: uploadedDocuments.filter((doc) => doc.isProcessing).length.toString(),
                  icon: Clock,
                },
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <Card key={index} className="glass-card border-white/10 p-4 text-center">
                    <IconComponent className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-blue-400">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </Card>
                )
              })}
            </div>

            {/* AI Capabilities */}
            <Card className="glass-card border-white/10 p-4">
              <div className="space-y-3">
                <h4 className="font-medium text-blue-400 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  AI Capabilities
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Automatic document summarization</li>
                  <li>• Key insight extraction</li>
                  <li>• Content categorization</li>
                  <li>• Actionable recommendations</li>
                </ul>
              </div>
            </Card>

            {/* Security Notice */}
            <Card className="glass-card border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-amber-400">Privacy & Security</h4>
                  <p className="text-xs text-amber-400/80">
                    Documents are processed securely and are not stored permanently on our servers.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
