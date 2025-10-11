"use client"

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold mt-5 mb-3 text-foreground" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-base font-semibold mt-3 mb-2 text-foreground" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-3 leading-relaxed text-foreground/90" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-3 space-y-1.5 ml-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1.5 ml-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-foreground/90 leading-relaxed" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-foreground/90" {...props} />
          ),
          code: ({ node, inline, ...props }: any) => (
            inline ? (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
                {...props}
              />
            ) : (
              <code
                className="block bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto my-3"
                {...props}
              />
            )
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-3" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary/30 pl-4 italic my-3 text-muted-foreground"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-border" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}