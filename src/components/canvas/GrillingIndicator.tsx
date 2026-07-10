import { useEffect, useState } from 'react'
import { useAppStore } from '../../store'
import { BurgerIcon } from '../shared/BurgerIcon'

const WARMUP_LINE = 'Firing up the grill…'

const THINKING_LINES = [
  'Flipping the patty…',
  'Toasting the buns…',
  'Melting the cheese…',
  'Stacking the layers just right…',
  'Adding the secret sauce…',
  'Seasoning to taste…',
  'Caramelizing the onions…',
  'Letting it sizzle…',
  'Checking the doneness…',
  'Warming the griddle…',
  'Slicing the pickles extra thin…',
  'Buttering the brioche…',
  'Skewering it with a toothpick…',
  'A watched patty never sizzles…',
  'Good burgers take a moment…',
  'Plating with a flourish…',
  'Garnishing the fine print…',
  'Taste-testing in the kitchen…',
]

const LINE_ROTATION_MS = 2600

function shuffle(pool: string[]): string[] {
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

// One deck per session, drawn without replacement: no line repeats until
// every line has been shown, and only then does the deck reshuffle.
let deck: string[] = []
let lastDrawn: string | null = null

function drawLine(): string {
  if (deck.length === 0) {
    deck = shuffle([...THINKING_LINES])
    // A fresh deck must not immediately repeat the last line shown.
    if (deck.length > 1 && deck[deck.length - 1] === lastDrawn) {
      ;[deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]]
    }
  }
  lastDrawn = deck.pop()!
  return lastDrawn
}

/**
 * Fills the dead air between "Fire the Grill" and the first streamed token —
 * most of which is the model's (invisible) thinking phase. Animation is pure
 * CSS transform/opacity keyframes, so it composites on the GPU and costs
 * nothing; the only JS is a slow interval rotating the status line.
 */
// Mounted only while the model is thinking; draws its first line on mount
// and rotates from there.
function ThinkingLine() {
  const [line, setLine] = useState(drawLine)

  useEffect(() => {
    const id = setInterval(() => setLine(drawLine()), LINE_ROTATION_MS)
    return () => clearInterval(id)
  }, [])

  // key remounts the element so the fade-in replays on each rotation
  return (
    <p key={line} className="fade-in text-sm font-medium" aria-hidden="true">
      {line}
    </p>
  )
}

export function GrillingIndicator() {
  const isThinking = useAppStore((s) => s.isThinking)

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
      {isThinking ? (
        <ThinkingLine />
      ) : (
        <p className="text-sm font-medium" aria-hidden="true">
          {WARMUP_LINE}
        </p>
      )}
    </div>
  )
}
