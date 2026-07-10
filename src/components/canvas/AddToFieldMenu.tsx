import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Check } from 'lucide-react'
import { useAppStore } from '../../store'

type FieldKey = 'context' | 'taskBraindump' | 'constraints' | 'examples'

const FIELD_OPTIONS: { key: FieldKey; label: string }[] = [
  { key: 'context', label: 'The Bun' },
  { key: 'taskBraindump', label: 'The Patty' },
  { key: 'constraints', label: 'Special Instructions' },
  { key: 'examples', label: 'Secret Sauce' },
]

const MENU_WIDTH = 184
const MENU_GAP = 6
const VIEWPORT_MARGIN = 8

interface AddToFieldMenuProps {
  getText: () => string
}

export function AddToFieldMenu({ getText }: AddToFieldMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // The menu is rendered in a portal with fixed positioning so it can never be
  // clipped by an overflow-hidden/scroll ancestor (e.g. the Chef's Notes panel).
  // Position it against the viewport, flipping up or clamping as needed.
  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight ?? FIELD_OPTIONS.length * 33 + 8

    const spaceBelow = window.innerHeight - rect.bottom
    const flipUp = spaceBelow < menuHeight + MENU_GAP && rect.top > menuHeight + MENU_GAP

    let top = flipUp ? rect.top - menuHeight - MENU_GAP : rect.bottom + MENU_GAP
    top = Math.max(
      VIEWPORT_MARGIN,
      Math.min(top, window.innerHeight - menuHeight - VIEWPORT_MARGIN),
    )

    // Right-align to the button, then keep the whole menu inside the viewport.
    let left = rect.right - MENU_WIDTH
    left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN),
    )

    setCoords({ top, left })
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }
    // A fixed menu detaches from its anchor on scroll/resize — close it rather
    // than let it drift away from the button.
    const close = () => setIsOpen(false)

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
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

  const buttonState = justAdded
    ? 'bg-success'
    : `bg-primary hover:bg-primary-hover ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        className={`h-5 w-5 shrink-0 flex items-center justify-center rounded-md text-white transition-all ${buttonState}`}
        aria-label="Add suggestion to a field"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        type="button"
      >
        {justAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ position: 'fixed', top: coords.top, left: coords.left, width: MENU_WIDTH }}
            className="z-50 rounded-lg border border-border bg-surface-alt shadow-lg py-1 animate-in fade-in zoom-in-95"
          >
            {FIELD_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                className="w-full text-left px-3 py-1.5 text-sm text-text hover:bg-surface-raised transition-colors whitespace-nowrap"
                role="menuitem"
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
