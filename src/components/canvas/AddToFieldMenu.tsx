import { useState, useRef, useEffect } from 'react'
import { Plus, Check } from 'lucide-react'
import { useAppStore } from '../../store'

type FieldKey = 'context' | 'taskBraindump' | 'constraints' | 'examples'

const FIELD_OPTIONS: { key: FieldKey; label: string }[] = [
  { key: 'context', label: 'The Bun' },
  { key: 'taskBraindump', label: 'The Patty' },
  { key: 'constraints', label: 'Special Instructions' },
  { key: 'examples', label: 'Secret Sauce' },
]

interface AddToFieldMenuProps {
  getText: () => string
}

export function AddToFieldMenu({ getText }: AddToFieldMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [flipUp, setFlipUp] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  const handleSelect = (key: FieldKey) => {
    const text = getText().trim()
    if (!text) return

    const state = useAppStore.getState()
    const current = state[key]
    const separator = current.trim() ? '\n' : ''

    const setters: Record<FieldKey, (v: string) => void> = {
      context: state.setContext,
      taskBraindump: state.setTaskBraindump,
      constraints: state.setConstraints,
      examples: state.setExamples,
    }

    setters[key](current + separator + text)

    setIsOpen(false)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        onClick={() => {
          if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            setFlipUp(spaceBelow < 160)
          }
          setIsOpen(!isOpen)
        }}
        className={
          justAdded
            ? 'h-5 w-5 flex items-center justify-center rounded text-success'
            : 'h-5 w-5 flex items-center justify-center rounded transition-colors text-text-muted/0 group-hover:text-text-muted hover:!text-text hover:bg-surface-raised'
        }
        aria-label="Add suggestion to field"
        type="button"
      >
        {justAdded ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Plus className="h-3.5 w-3.5" />
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 z-10 min-w-[180px] rounded-lg border border-border bg-surface-alt shadow-lg py-1 animate-in fade-in zoom-in-95 ${flipUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
          {FIELD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              className="w-full text-left px-3 py-1.5 text-sm text-text hover:bg-surface-raised transition-colors"
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
