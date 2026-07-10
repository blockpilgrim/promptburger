export function FixingsDivider() {
  return (
    <div
      className="flex items-center gap-2 pt-1"
      role="separator"
      aria-label="The Fixings — optional"
    >
      <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        The Fixings
      </span>
      <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
        optional
      </span>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  )
}
