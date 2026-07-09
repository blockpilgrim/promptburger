import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { AlertTriangle, LogOut, RefreshCw } from 'lucide-react'
import { BurgerIcon } from '../components/shared/BurgerIcon'
import { Button } from '../components/shared/Button'
import type { AdminStats, UsageStatus } from '../types'

const PASSWORD_STORAGE_KEY = 'pb-admin-password'

function formatNumber(n: number): string {
  return n.toLocaleString()
}

function formatCost(n: number): string {
  if (n === 0) return '$0.00'
  return n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(4)}`
}

function formatTime(ts: number | null): string {
  if (!ts) return '—'
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function shortModel(model: string): string {
  return model.replace(/^claude-/, '').replace(/-\d{8}$/, '')
}

const STATUS_STYLES: Record<UsageStatus, string> = {
  ok: 'bg-success/15 text-success',
  rate_limited: 'bg-accent/20 text-accent-foreground',
  error: 'bg-danger/15 text-danger',
}

function StatusBadge({ status }: { status: UsageStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {status === 'rate_limited' ? 'limited' : status}
    </span>
  )
}

function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-alt p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold text-text">{value}</p>
      {detail && <p className="mt-1 text-xs text-text-muted/80">{detail}</p>}
    </div>
  )
}

function SectionTable({ title, headers, rows, emptyMessage }: {
  title: string
  headers: string[]
  rows: ReactNode[][]
  emptyMessage: string
}) {
  return (
    <section className="rounded-xl border border-border bg-surface-alt">
      <h2 className="border-b border-border px-4 py-3 text-sm font-semibold text-text">{title}</h2>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-text-muted">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60">
                {headers.map((h) => (
                  <th key={h} className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/30 last:border-b-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 font-mono text-xs text-text">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState('')
  const [password, setPassword] = useState<string | null>(
    () => sessionStorage.getItem(PASSWORD_STORAGE_KEY),
  )
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (pw: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${pw}` },
      })
      if (res.status === 401) {
        sessionStorage.removeItem(PASSWORD_STORAGE_KEY)
        setPassword(null)
        setStats(null)
        setError('Wrong password.')
        return
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null
        throw new Error(body?.message ?? `Request failed (${res.status})`)
      }
      const data = (await res.json()) as AdminStats
      sessionStorage.setItem(PASSWORD_STORAGE_KEY, pw)
      setPassword(pw)
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (password) void fetchStats(password)
  }, [password, fetchStats])

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    if (passwordInput.trim()) void fetchStats(passwordInput.trim())
  }

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_STORAGE_KEY)
    setPassword(null)
    setStats(null)
    setPasswordInput('')
  }

  if (!password || !stats) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-border bg-surface-alt p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <BurgerIcon className="h-6 w-6 text-primary" />
            <h1 className="font-mono text-lg font-semibold text-text">PromptBurger Admin</h1>
          </div>
          <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-text-muted">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          <Button type="submit" className="mt-4 w-full" isLoading={isLoading}>
            Open the kitchen
          </Button>
        </form>
      </div>
    )
  }

  const today = stats.daily[0]
  const last7Requests = stats.daily.slice(0, 7).reduce((sum, d) => sum + d.requests, 0)
  const activeDays = stats.daily.filter(
    (d) => d.requests || d.rateLimited || d.errors,
  )

  return (
    <div className="mx-auto min-h-full max-w-5xl space-y-5 p-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BurgerIcon className="h-6 w-6 text-primary" />
          <h1 className="font-mono text-lg font-semibold text-text">PromptBurger Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void fetchStats(password)}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut className="h-3.5 w-3.5" />}>
            Log out
          </Button>
        </div>
      </header>

      {stats.storage === 'memory' && (
        <div className="flex items-start gap-2.5 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm text-text">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
          <p>
            <strong>Ephemeral storage:</strong> Redis is not configured, so these numbers reset
            whenever the server recycles and rate limits are best-effort. Add an Upstash Redis
            database (free) in the Vercel dashboard to make tracking persistent.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total prompts"
          value={formatNumber(stats.totals.requests)}
          detail={`${formatNumber(today?.requests ?? 0)} today · ${formatNumber(last7Requests)} last 7 days`}
        />
        <StatCard
          label="Est. total cost"
          value={formatCost(stats.totals.cost)}
          detail={`${formatCost(today?.cost ?? 0)} today`}
        />
        <StatCard
          label="Tokens"
          value={formatNumber(stats.totals.inputTokens + stats.totals.outputTokens)}
          detail={`${formatNumber(stats.totals.inputTokens)} in · ${formatNumber(stats.totals.outputTokens)} out`}
        />
        <StatCard
          label="Limited / errors"
          value={`${formatNumber(stats.totals.rateLimited)} / ${formatNumber(stats.totals.errors)}`}
          detail={`Limits: ${stats.limits.perIpHourly}/hr · ${stats.limits.perIpDaily}/day per IP · ${stats.limits.globalDaily}/day global`}
        />
      </div>

      <SectionTable
        title="Last 14 days"
        headers={['Date', 'Prompts', 'Tokens in', 'Tokens out', 'Est. cost', 'Limited', 'Errors']}
        emptyMessage="No activity yet."
        rows={activeDays.map((d) => [
          d.date,
          formatNumber(d.requests),
          formatNumber(d.inputTokens),
          formatNumber(d.outputTokens),
          formatCost(d.cost),
          formatNumber(d.rateLimited),
          formatNumber(d.errors),
        ])}
      />

      <SectionTable
        title="Visitors (by IP)"
        headers={['IP', 'Requests', 'Last seen']}
        emptyMessage="No visitors yet."
        rows={stats.ips.map((v) => [v.ip, formatNumber(v.requests), formatTime(v.lastSeenAt)])}
      />

      <SectionTable
        title="Recent activity"
        headers={['Time', 'IP', 'Model', 'Status', 'Tokens', 'Duration', 'Cost']}
        emptyMessage="No requests yet."
        rows={stats.events.map((e) => [
          formatTime(e.ts),
          e.ip,
          shortModel(e.model),
          <StatusBadge key="status" status={e.status} />,
          e.inputTokens != null ? `${formatNumber(e.inputTokens)} / ${formatNumber(e.outputTokens ?? 0)}` : '—',
          e.durationMs != null ? `${(e.durationMs / 1000).toFixed(1)}s` : '—',
          e.cost != null ? formatCost(e.cost) : '—',
        ])}
      />

      <p className="pb-4 text-center text-xs text-text-muted/70">
        Updated {new Date(stats.generatedAt).toLocaleString()} · storage: {stats.storage}
      </p>
    </div>
  )
}
