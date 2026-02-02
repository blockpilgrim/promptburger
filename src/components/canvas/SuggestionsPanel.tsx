import { useState, useRef, useEffect } from 'react'
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { AddToFieldMenu } from './AddToFieldMenu'

const COLLAPSED_MAX_HEIGHT = 180
const OVERFLOW_THRESHOLD = 60

function SuggestionItem({ children }: { children?: React.ReactNode }) {
  const textRef = useRef<HTMLSpanElement>(null)
  return (
    <li className="flex gap-2 group items-start">
      <span className="text-accent-foreground/70 shrink-0 mt-0.5">•</span>
      <span ref={textRef} className="flex-1">{children}</span>
      <AddToFieldMenu getText={() => textRef.current?.textContent || ''} />
    </li>
  )
}

interface SuggestionsPanelProps {
  suggestions: string
}

export function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [needsExpand, setNeedsExpand] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Strip the "## Suggestions for Improvement" heading — we render our own
  const body = suggestions
    .replace(/^##\s*Suggestions for Improvement\s*\n*/i, '')
    .trim()

  useEffect(() => {
    if (contentRef.current) {
      const overflow = contentRef.current.scrollHeight - COLLAPSED_MAX_HEIGHT
      setNeedsExpand(overflow > OVERFLOW_THRESHOLD)
    }
  }, [body])

  if (!body) return null

  return (
    <div className="border-t border-border bg-surface/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChefHat className="h-4 w-4 text-accent-foreground" />
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Chef's Notes
          </span>
        </div>
        {needsExpand && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
          >
            {expanded ? (
              <>
                Collapse <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Expand <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>
      <div
        ref={contentRef}
        className="text-sm text-text-muted leading-relaxed overflow-hidden transition-[max-height] duration-200"
        style={{ maxHeight: expanded || !needsExpand ? 'none' : `${COLLAPSED_MAX_HEIGHT}px` }}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="space-y-2.5">{children}</ul>,
            li: SuggestionItem,
            strong: ({ children }) => (
              <strong className="font-medium text-text-muted">{children}</strong>
            ),
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
      {needsExpand && !expanded && (
        <div className="h-8 -mt-8 relative bg-gradient-to-t from-surface/90 to-transparent pointer-events-none" />
      )}
    </div>
  )
}
