import { Shield, CheckCircle2, AlertTriangle, Clock, ArrowRight, ArrowDown, TrendingDown, Wrench, FileWarning, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import GlassCard from '../components/GlassCard'
import { DEMO_REMEDIATION } from '../lib/mockData'

const SEV_COLORS = {
  critical: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', bar: '#ef4444' },
  high: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: '#f97316' },
  medium: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: '#eab308' },
  low: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', bar: '#3b82f6' },
  info: { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', bar: '#6b7280' },
}

function SeverityPill({ severity }) {
  const c = SEV_COLORS[severity]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${c.text} ${c.bg} border ${c.border}`}>
      {severity}
    </span>
  )
}

function ComparisonBar({ label, before, after, color }) {
  const max = Math.max(before, after, 1)
  const reduction = before > 0 ? Math.round(((before - after) / before) * 100) : 0
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider capitalize" style={{ color }}>{label}</span>
        <span className="text-xs font-bold text-gray-400">
          {before} <ArrowRight className="inline h-3 w-3 text-gray-600" /> {after}
          {reduction > 0 && <span className="text-emerald-400 ml-2">-{reduction}%</span>}
        </span>
      </div>
      <div className="flex gap-1.5 h-3">
        <div className="flex-1 rounded-full overflow-hidden bg-white/[0.04]">
          <div className="h-full rounded-full opacity-40 transition-all duration-1000" style={{ width: `${(before / max) * 100}%`, backgroundColor: color }} />
        </div>
        <div className="flex-1 rounded-full overflow-hidden bg-white/[0.04]">
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(after / max) * 100}%`, backgroundColor: color }} />
        </div>
      </div>
      <div className="flex text-[9px] font-bold uppercase tracking-wider text-gray-600">
        <span className="flex-1">Before</span>
        <span className="flex-1">After</span>
      </div>
    </div>
  )
}

function ExpandableItem({ item, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const c = SEV_COLORS[item.severity]
  return (
    <div className={`border ${c.border} rounded-xl overflow-hidden transition-all ${open ? c.bg : 'bg-transparent hover:bg-white/[0.02]'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-gray-500 font-mono">{item.id}</span>
            <span className="text-sm font-semibold text-gray-200 truncate">{item.title}</span>
          </div>
        </div>
        <SeverityPill severity={item.severity} />
        {open ? <ChevronUp className="h-4 w-4 text-gray-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-white/[0.04] space-y-2 animate-slide-down">
          <p className="text-xs text-gray-300 leading-relaxed">{item.fix}</p>
          <p className="text-[11px] text-gray-500 font-mono">{item.file}</p>
        </div>
      )}
    </div>
  )
}

function RemainingItem({ item }) {
  const c = SEV_COLORS[item.severity]
  return (
    <div className={`flex items-start gap-3 px-4 py-3 border ${c.border} rounded-xl`}>
      <FileWarning className={`h-4 w-4 shrink-0 mt-0.5 ${c.text}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-gray-500 font-mono">{item.id}</span>
          <span className="text-sm font-semibold text-gray-200">{item.title}</span>
          <SeverityPill severity={item.severity} />
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.reason}</p>
      </div>
    </div>
  )
}

export default function Remediation() {
  const { before, after, items, remaining } = DEMO_REMEDIATION
  const totalFixed = items.length
  const totalRemaining = remaining.length
  const totalOriginal = totalFixed + totalRemaining
  const reductionPct = Math.round((totalFixed / totalOriginal) * 100)

  const fixedBySev = items.reduce((acc, i) => { acc[i.severity] = (acc[i.severity] || 0) + 1; return acc }, {})
  const remainBySev = remaining.reduce((acc, i) => { acc[i.severity] = (acc[i.severity] || 0) + 1; return acc }, {})

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#060a14] p-8 md:p-10 hero-gradient">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/20">
              <Wrench className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Remediation Summary</h2>
              <p className="text-sm text-gray-500 mt-0.5">Post-remediation re-assessment of ISO 27001 pen test findings</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-400">
              {totalFixed} of {totalOriginal} findings resolved
            </span>
            <span className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-4 py-2 text-sm font-bold text-gray-400">
              {reductionPct}% reduction
            </span>
            <span className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-4 py-2 text-sm font-bold text-orange-400">
              {totalRemaining} remaining
            </span>
          </div>
        </div>
      </div>

      {/* Big number cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="text-center animate-slide-up stagger-1">
          <div className="text-4xl font-extrabold text-emerald-400">{totalFixed}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-1">Resolved</div>
        </GlassCard>
        <GlassCard className="text-center animate-slide-up stagger-2">
          <div className="text-4xl font-extrabold text-orange-400">{totalRemaining}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-1">Remaining</div>
        </GlassCard>
        <GlassCard className="text-center animate-slide-up stagger-3">
          <div className="text-4xl font-extrabold gradient-text">{reductionPct}%</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-1">Reduction</div>
        </GlassCard>
        <GlassCard className="text-center animate-slide-up stagger-4">
          <div className="text-4xl font-extrabold text-red-400">
            {before.critical} <ArrowRight className="inline h-5 w-5 text-gray-600" /> {remainBySev.critical || 0}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-1">Critical</div>
        </GlassCard>
      </div>

      {/* Before / After comparison */}
      <GlassCard className="animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <TrendingDown className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-300">Before vs After — By Severity</h3>
        </div>
        <div className="space-y-5">
          {['critical', 'high', 'medium', 'low', 'info'].map((sev) => (
            <ComparisonBar
              key={sev}
              label={sev}
              before={before[sev]}
              after={remainBySev[sev] || 0}
              color={SEV_COLORS[sev].bar}
            />
          ))}
        </div>
      </GlassCard>

      {/* Resolved findings */}
      <div className="animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-extrabold text-white">{totalFixed} Resolved Findings</h3>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <ExpandableItem key={item.id} item={item} defaultOpen={i === 0} />
          ))}
        </div>
      </div>

      {/* Remaining findings */}
      <div className="animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
          <h3 className="text-lg font-extrabold text-white">{totalRemaining} Remaining Items</h3>
          <span className="text-xs text-gray-500">(require manual/architectural changes)</span>
        </div>
        <div className="space-y-2">
          {remaining.map((item) => (
            <RemainingItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Deploy checklist */}
      <GlassCard glow="blue" className="animate-slide-up">
        <div className="flex items-center gap-3 mb-5">
          <Clock className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-bold text-gray-300">Deploy Checklist</h3>
        </div>
        <div className="space-y-3">
          {[
            'Run bin/rails db:migrate (AddLockableToUsers)',
            'Set DEVISE_SECRET_KEY in production',
            'Set DEVISE_JWT_SECRET_KEY in production',
            'Set DEVISE_MAILER_SENDER for email delivery',
            'Set EXPLORATORY_TEST_USERNAME / PASSWORD if using exploratory testing',
            'Set CORS_ORIGINS for API CORS',
            'Rotate all previously committed or default secrets',
            'Remove .env and cookies.txt from git history (BFG Repo-Cleaner)',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-500/10 border border-blue-500/15 text-[10px] font-bold text-blue-400 mt-0.5">
                {i + 1}
              </div>
              <span className="text-sm text-gray-300">{step}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
