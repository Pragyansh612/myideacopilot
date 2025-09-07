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
import { Upload, ImageIcon, X, Save, ArrowLeft, Sparkles, Eye, RotateCw, Crop, Palette, Zap, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UploadedImage {
  id: string
  file: File
  url: string
  aiDescription: string
  isProcessing: boolean
}

export default function ImageCapturePage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulated AI descriptions for different types of images
  const aiDescriptions = [
    "A vibrant workspace setup with a modern laptop, coffee cup, and notebook. The lighting suggests creativity and productivity, perfect for brainstorming sessions.",
    "An architectural sketch showing innovative building design concepts. The clean lines and geometric patterns indicate modern sustainable architecture principles.",
    "A nature scene with flowing water and organic shapes. This image evokes tranquility and could inspire biomimetic design solutions.",
    "A colorful mind map or diagram with interconnected ideas. The visual organization suggests systematic thinking and creative problem-solving approaches.",
    "A minimalist product design mockup showcasing clean aesthetics and user-centered design principles. The composition emphasizes functionality and elegance.",
  ]

  const suggestedTags = [
    "design",
    "inspiration",
    "architecture",
    "nature",
    "workspace",
    "creative",
    "minimal",
    "concept",
    "sketch",
    "photography",
    "art",
    "innovation",
  ]

  const generateAIDescription = useCallback(() => {
    return aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)]
  }, [])

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const id = Math.random().toString(36).substr(2, 9)
          const url = URL.createObjectURL(file)

          const newImage: UploadedImage = {
            id,
            file,
            url,
            aiDescription: "",
            isProcessing: true,
          }

          setUploadedImages((prev) => [...prev, newImage])

          // Simulate AI processing
          setTimeout(
            () => {
              setUploadedImages((prev) =>
                prev.map((img) =>
                  img.id === id
                    ? {
                        ...img,
                        aiDescription: generateAIDescription(),
                        isProcessing: false,
                      }
                    : img,
                ),
              )
            },
            2000 + Math.random() * 2000,
          )
        }
      })
    },
    [generateAIDescription],
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

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSave = async () => {
    if (!title.trim() || uploadedImages.length === 0) return

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSaving(false)
    // Reset form
    setUploadedImages([])
    setTitle("")
    setDescription("")
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
            <PageHeader title="Image Capture" description="Upload visual inspiration and get AI insights" />
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
                  : uploadedImages.length > 0
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
                      {isDragOver ? "Drop your images here" : "Upload your visual inspiration"}
                    </h3>
                    <p className="text-muted-foreground">
                      Drag and drop images here, or{" "}
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
                      JPG
                    </Badge>
                    <Badge variant="secondary" className="glass-badge">
                      PNG
                    </Badge>
                    <Badge variant="secondary" className="glass-badge">
                      WebP
                    </Badge>
                    <Badge variant="secondary" className="glass-badge">
                      SVG
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Uploaded Images Grid */}
            {uploadedImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Uploaded Images ({uploadedImages.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedImages.map((image) => (
                    <Card key={image.id} className="glass-card border-white/10 overflow-hidden">
                      <div className="relative">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt="Uploaded image"
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          onClick={() => removeImage(image.id)}
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500/80 hover:bg-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        {/* Image Actions */}
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 glass-button">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 glass-button">
                            <RotateCw className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 glass-button">
                            <Crop className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium">AI Analysis</span>
                          {image.isProcessing && (
                            <div className="animate-spin rounded-full h-3 w-3 border border-blue-400/30 border-t-blue-400" />
                          )}
                        </div>

                        {image.isProcessing ? (
                          <div className="space-y-2">
                            <div className="h-3 bg-white/10 rounded animate-pulse" />
                            <div className="h-3 bg-white/10 rounded animate-pulse w-3/4" />
                            <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground leading-relaxed">{image.aiDescription}</p>
                        )}
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
                  <ImageIcon className="h-5 w-5 text-blue-400" />
                  Idea Details
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your visual idea a title..."
                    className="glass-input border-white/10 focus:border-blue-400/50 focus:ring-blue-400/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what inspired you about these images..."
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
                  disabled={!title.trim() || uploadedImages.length === 0 || isSaving}
                  className="w-full glass-button bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
                      Saving Idea...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Visual Idea
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Upload Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Images", value: uploadedImages.length.toString(), icon: ImageIcon },
                {
                  label: "Processing",
                  value: uploadedImages.filter((img) => img.isProcessing).length.toString(),
                  icon: Zap,
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

            {/* AI Features */}
            <Card className="glass-card border-white/10 p-4">
              <div className="space-y-3">
                <h4 className="font-medium text-blue-400 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  AI Features
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Automatic image analysis and description</li>
                  <li>• Smart tag suggestions based on content</li>
                  <li>• Color palette extraction</li>
                  <li>• Style and mood detection</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
