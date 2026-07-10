import { BurgerIcon } from '../shared/BurgerIcon'

const STEPS = [
  {
    title: 'Drop in The Patty',
    body: "the task you want done. That's all the grill needs. Every Fixing below it is optional, but always helpful.",
  },
  {
    title: 'Fire the Grill',
    body: 'the chef turns your rough idea into a clean, copy-ready prompt.',
  },
  {
    title: "Answer the Chef's Notes",
    body: 'the chef asks about anything unclear or missing. Reply to what matters, then re-grill to work your answers in.',
  },
]

export function CanvasEmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 text-text-muted">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3">
          <BurgerIcon className="h-11 w-11 text-primary" />
          <p className="text-sm font-semibold text-text">
            Grill a prompt in three steps
          </p>
        </div>
        <ol className="mt-6 space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] font-bold text-primary">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">
                <span className="font-medium text-text">{step.title}</span>{' '}
                — {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
