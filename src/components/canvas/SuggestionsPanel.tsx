import { isValidElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Check,
  ChefHat,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  Flame,
  Reply,
  Undo2,
  X,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { AddToFieldMenu } from './AddToFieldMenu'
import { Button } from '../shared/Button'
import { useAppStore } from '../../store'

// Flattens rendered markdown (text, <strong>, nested elements) to plain text.
function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join('')
  if (isValidElement(node)) {
    return nodeToText((node.props as { children?: ReactNode }).children)
  }
  return ''
}

function SuggestionItem({ children }: { children?: ReactNode }) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isResponding, setIsResponding] = useState(false)

  // The note's plain text is its identity in the store.
  const noteText = useMemo(() => nodeToText(children).trim(), [children])

  const response = useAppStore((s) => (noteText ? s.noteResponses[noteText] ?? '' : ''))
  const isDismissed = useAppStore((s) =>
    noteText ? s.dismissedNotes.includes(noteText) : false,
  )
  const setNoteResponse = useAppStore((s) => s.setNoteResponse)
  const dismissNote = useAppStore((s) => s.dismissNote)
  const undismissNote = useAppStore((s) => s.undismissNote)

  const isAnswered = response.trim().length > 0
  const showResponseBox = !isDismissed && (isResponding || response.length > 0)

  useEffect(() => {
    if (isResponding) inputRef.current?.focus()
  }, [isResponding])

  // Grow the answer box with its content instead of showing a scrollbar.
  useLayoutEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [response, showResponseBox])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      inputRef.current?.blur()
      setIsResponding(false)
    }
    if (e.key === 'Escape') {
      inputRef.current?.blur()
      setIsResponding(false)
    }
  }

  return (
    <li className="group">
      <div className={`flex gap-2 items-start ${isDismissed ? 'opacity-40' : ''}`}>
        {isAnswered ? (
          <Check className="h-3.5 w-3.5 shrink-0 mt-1 text-success" aria-label="Answered" />
        ) : (
          <span className="text-accent-foreground/70 shrink-0 mt-0.5">•</span>
        )}
        <span className="flex-1">{children}</span>

        <span className="flex items-center gap-1 shrink-0">
          {isDismissed ? (
            <button
              type="button"
              onClick={() => undismissNote(noteText)}
              className="flex items-center gap-1 rounded-md px-1.5 h-5 text-[11px] font-medium text-text-muted hover:text-text hover:bg-surface-raised transition-colors"
            >
              <Undo2 className="h-3 w-3" />
              Undo
            </button>
          ) : (
            <>
              {!isAnswered && (
                <button
                  type="button"
                  onClick={() => setIsResponding(true)}
                  className="flex items-center gap-1 rounded-md px-1.5 h-5 text-[11px] font-medium text-accent-foreground bg-accent/20 hover:bg-accent/35 transition-colors"
                  aria-label="Respond to this note"
                >
                  <Reply className="h-3 w-3" />
                  Respond
                </button>
              )}
              <AddToFieldMenu getText={() => noteText} />
              <button
                type="button"
                onClick={() => {
                  setIsResponding(false)
                  dismissNote(noteText)
                }}
                className="h-5 w-5 flex items-center justify-center rounded-md text-text-muted hover:text-danger hover:bg-surface-raised transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="Dismiss note as not relevant"
                title="Not relevant"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </span>
      </div>

      {showResponseBox && (
        <div className="mt-1.5 ml-5 flex items-start gap-1.5">
          <CornerDownRight className="h-3.5 w-3.5 shrink-0 mt-2 text-accent-foreground/70" />
          <textarea
            ref={inputRef}
            value={response}
            onChange={(e) => setNoteResponse(noteText, e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsResponding(false)}
            rows={1}
            placeholder="Type your answer — the chef works it in on the next grill…"
            aria-label="Your response to this note"
            className="flex-1 resize-none overflow-hidden rounded-lg border border-border bg-surface-alt px-2.5 py-1.5 text-sm text-text placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      )}
    </li>
  )
}

interface SuggestionsPanelProps {
  suggestions: string
  onRefine: () => void
}

export function SuggestionsPanel({ suggestions, onRefine }: SuggestionsPanelProps) {
  const [expanded, setExpanded] = useState(true)
  const answeredCount = useAppStore(
    (s) => Object.values(s.noteResponses).filter((r) => r.trim()).length,
  )
  const dismissedCount = useAppStore((s) => s.dismissedNotes.length)

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
          {!expanded && answeredCount > 0 && (
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
              {answeredCount} answered
            </span>
          )}
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

            {answeredCount > 0 && (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent/10 px-3.5 py-2.5">
                <span className="text-xs text-text-muted">
                  <span className="font-medium text-text">
                    {answeredCount} {answeredCount === 1 ? 'note' : 'notes'} answered
                  </span>
                  {dismissedCount > 0 && <> · {dismissedCount} dismissed</>}
                  {` — re-grill to work ${answeredCount === 1 ? 'it' : 'them'} into the prompt`}
                </span>
                <Button
                  size="sm"
                  onClick={onRefine}
                  leftIcon={<Flame className="h-3.5 w-3.5" />}
                >
                  Re-grill
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
