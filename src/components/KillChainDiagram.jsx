import { KILL_CHAIN_PHASES } from '../lib/constants'
import { Search, Wrench, Send, Zap, Download, Radio, Target } from 'lucide-react'

const ICONS = {
  search: Search,
  wrench: Wrench,
  send: Send,
  zap: Zap,
  download: Download,
  radio: Radio,
  target: Target,
}

export default function KillChainDiagram({ activePhases = [], findings = {} }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300">Cyber Kill Chain Coverage</h3>
      <div className="flex items-start gap-0 overflow-x-auto pb-2">
        {KILL_CHAIN_PHASES.map((phase, idx) => {
          const isActive = activePhases.includes(phase.id)
          const findingCount = findings[phase.id] || 0
          const Icon = ICONS[phase.icon] || Target

          return (
            <div key={phase.id} className="flex items-center">
              <div className="flex flex-col items-center group relative">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all duration-300"
                  style={{
                    borderColor: isActive ? phase.color : '#1f2937',
                    backgroundColor: isActive ? `${phase.color}20` : '#111827',
                    boxShadow: isActive ? `0 0 16px ${phase.color}30` : 'none',
                  }}
                >
                  <Icon
                    className="h-5 w-5 transition-colors"
                    style={{ color: isActive ? phase.color : '#4b5563' }}
                  />
                </div>
                {findingCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: phase.color }}
                  >
                    {findingCount}
                  </span>
                )}
                <span className="mt-1.5 max-w-[70px] text-center text-[10px] leading-tight text-gray-500">
                  {phase.name}
                </span>
                <div className="pointer-events-none absolute bottom-full mb-8 hidden w-48 rounded-lg border border-gray-700 bg-gray-900 p-2.5 text-xs text-gray-400 shadow-xl group-hover:block z-10">
                  {phase.description}
                </div>
              </div>
              {idx < KILL_CHAIN_PHASES.length - 1 && (
                <div
                  className="mx-0.5 mt-[-14px] h-0.5 w-4 transition-colors duration-300"
                  style={{
                    backgroundColor: isActive ? `${phase.color}50` : '#1f2937',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
