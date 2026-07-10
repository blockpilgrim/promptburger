import { useState, useRef } from 'react'
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { AddToFieldMenu } from './AddToFieldMenu'

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
  const [expanded, setExpanded] = useState(true)

  // Strip the "## Suggestions for Improvement" heading — we render our own
  const body = suggestions
    .replace(/^##\s*Suggestions for Improvement\s*\n*/i, '')
    .trim()

  if (!body) return null

  return (
    <div className="border-t border-border bg-surface/50 p-6">
      {/* The whole header row toggles the panel — a large, obvious target. */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? "Hide Chef's Notes" : "Show Chef's Notes"}
        className="group flex w-full cursor-pointer items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <ChefHat className="h-4 w-4 text-accent-foreground" />
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Chef's Notes
          </span>
        </span>
        {/* Panel is docked at the bottom: it grows upward to reveal and folds
            downward to hide, so the chevron points the way the notes move. */}
        <span className="flex items-center gap-1 text-xs text-text-muted transition-colors group-hover:text-text">
          {expanded ? (
            <>
              Hide <ChevronDown className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Show <ChevronUp className="h-3.5 w-3.5" />
            </>
          )}
        </span>
      </button>

      {/* grid-rows 1fr/0fr animates height smoothly without measuring content */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="pt-4 text-sm text-text-muted leading-relaxed"
            inert={!expanded ? true : undefined}
            aria-hidden={!expanded}
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
        </div>
      </div>
    </div>
  )
}
