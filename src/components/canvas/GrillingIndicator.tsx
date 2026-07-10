import { useEffect, useState } from 'react'
import { useAppStore } from '../../store'
import { BurgerIcon } from '../shared/BurgerIcon'

const WARMUP_LINE = 'Firing up the grill…'

const THINKING_LINES = [
  'The chef is reading your braindump…',
  'Picking the freshest ingredients…',
  'Seasoning the details…',
  'Plating the perfect prompt…',
]

const LINE_ROTATION_MS = 2600

/**
 * Fills the dead air between "Fire the Grill" and the first streamed token —
 * most of which is the model's (invisible) thinking phase. Animation is pure
 * CSS transform/opacity keyframes, so it composites on the GPU and costs
 * nothing; the only JS is a slow interval rotating the status line.
 */
export function GrillingIndicator() {
  const isThinking = useAppStore((s) => s.isThinking)
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    if (!isThinking) return
    const id = setInterval(() => {
      setLineIndex((i) => (i + 1) % THINKING_LINES.length)
    }, LINE_ROTATION_MS)
    return () => clearInterval(id)
  }, [isThinking])

  const line = isThinking ? THINKING_LINES[lineIndex] : WARMUP_LINE

  return (
    <div
      role="status"
      aria-label="Grilling your prompt"
      className="flex flex-1 flex-col items-center justify-center gap-4 text-text-muted"
    >
      <div className="relative" aria-hidden="true">
        <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="steam-wisp"
              style={{ animationDelay: `${i * 0.55}s` }}
            />
          ))}
        </div>
        <BurgerIcon className="burger-bob h-14 w-14 text-primary" />
      </div>
      {/* key remounts the line so the fade-in replays on each rotation */}
      <p key={line} className="fade-in text-sm font-medium" aria-hidden="true">
        {line}
      </p>
    </div>
  )
}
