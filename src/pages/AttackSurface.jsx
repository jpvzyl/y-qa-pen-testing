import { useEffect, useState, useMemo } from 'react'
import { Globe, RefreshCw, Server, Network, Link2, Clock, Search, Eye, Shield, Wifi } from 'lucide-react'
import { getAttackSurface, refreshAttackSurface } from '../lib/api'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'

const ASSET_TYPE_CONFIG = {
  domain:     { label: 'Domains', icon: Globe, color: '#3b82f6', glow: 'blue' },
  subdomain:  { label: 'Subdomains', icon: Link2, color: '#8b5cf6', glow: 'purple' },
  ip_address: { label: 'IP Addresses', icon: Network, color: '#10b981', glow: 'green' },
  endpoint:   { label: 'Endpoints', icon: Server, color: '#f97316', glow: 'orange' },
  port:       { label: 'Open Ports', icon: Wifi, color: '#ec4899', glow: 'red' },
  technology: { label: 'Technologies', icon: Shield, color: '#06b6d4', glow: 'blue' },
}

export default function AttackSurface() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const scanId = localStorage.getItem('yqa_last_scan_id')
      if (!scanId) {
        setError('No scan selected. Visit a scan first to view its attack surface.')
        return
      }
      const res = await getAttackSurface(scanId)
      setData(res.data?.attack_surface || res.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true)
      const scanId = localStorage.getItem('yqa_last_scan_id')
      if (scanId) {
        await refreshAttackSurface(scanId)
        await loadData()
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setRefreshing(false)
    }
  }

  const assets = data?.assets || data?.attack_surface_assets || []

  const grouped = useMemo(() => {
    return assets.reduce((acc, a) => {
      const type = a.asset_type || a.type || 'other'
      if (!acc[type]) acc[type] = []
      acc[type].push(a)
      return acc
    }, {})
  }, [assets])

  const filtered = useMemo(() => {
    if (!searchQuery && filterType === 'all') return grouped
    const result = {}
    const typesToShow = filterType === 'all' ? Object.keys(grouped) : [filterType]
    for (const type of typesToShow) {
      const items = grouped[type] || []
      result[type] = searchQuery
        ? items.filter((a) => {
            const searchable = `${a.value} ${a.url} ${a.hostname} ${a.ip_address} ${(a.technologies || []).join(' ')}`.toLowerCase()
            return searchable.includes(searchQuery.toLowerCase())
          })
        : items
    }
    return result
  }, [grouped, filterType, searchQuery])

  const totalAssets = assets.length
  const typeCounts = Object.entries(grouped).map(([type, items]) => ({
    type,
    count: items.length,
    config: ASSET_TYPE_CONFIG[type] || { label: type, icon: Globe, color: '#6b7280', glow: undefined },
  }))

  const allTechnologies = useMemo(() => {
    const techs = new Set()
    assets.forEach((a) => (a.technologies || []).forEach((t) => techs.add(t)))
    return [...techs].sort()
  }, [assets])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">
            Attack <span className="gradient-text-blue">Surface</span>
          </h2>
          <p className="text-sm text-gray-500">Discovered assets, endpoints, and technology fingerprints</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {data?.last_scanned_at && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          Last scanned: {new Date(data.last_scanned_at).toLocaleString()}
        </div>
      )}

      {error ? (
        <GlassCard glow="red" className="text-center">
          <p className="text-sm text-red-400">{error}</p>
        </GlassCard>
      ) : loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-800 border-t-blue-500" />
        </div>
      ) : (
        <>
          {/* Asset count cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <GlassCard glow="blue" className="cursor-pointer" onClick={() => setFilterType('all')}>
              <Eye className="mb-2 h-5 w-5 text-blue-400" />
              <AnimatedCounter value={totalAssets} className="text-2xl font-bold text-gray-100" />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total Assets</p>
            </GlassCard>
            {typeCounts.map(({ type, count, config }) => {
              const Icon = config.icon
              return (
                <GlassCard
                  key={type}
                  glow={config.glow}
                  className={`cursor-pointer transition-all ${filterType === type ? 'ring-1 ring-red-500/30' : ''}`}
                  onClick={() => setFilterType(filterType === type ? 'all' : type)}
                >
                  <Icon className="mb-2 h-5 w-5" style={{ color: config.color }} />
                  <AnimatedCounter value={count} className="text-2xl font-bold text-gray-100" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{config.label}</p>
                </GlassCard>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search assets, domains, IPs, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-blue-500/30"
            />
          </div>

          {/* Technologies */}
          {allTechnologies.length > 0 && (
            <GlassCard>
              <h3 className="mb-3 text-sm font-semibold text-gray-300">Detected Technologies</h3>
              <div className="flex flex-wrap gap-1.5">
                {allTechnologies.map((tech) => (
                  <span key={tech} className="rounded-md border border-gray-800 bg-gray-900 px-2.5 py-1 text-xs text-gray-400 hover:border-gray-700 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Asset tables */}
          {Object.entries(filtered).map(([type, items]) => {
            if (!items || items.length === 0) return null
            const config = ASSET_TYPE_CONFIG[type] || { label: type, icon: Globe, color: '#6b7280' }
            const Icon = config.icon

            return (
              <GlassCard key={type} padding={false} className="overflow-hidden">
                <div className="flex items-center gap-2 border-b border-gray-800/50 px-5 py-3.5">
                  <Icon className="h-4 w-4" style={{ color: config.color }} />
                  <h3 className="text-sm font-semibold text-gray-300">{config.label}</h3>
                  <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs tabular-nums text-gray-500">{items.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800/30 text-left text-[11px] font-medium uppercase tracking-wider text-gray-600">
                        <th className="px-5 py-2.5">Value</th>
                        <th className="px-5 py-2.5">Technologies</th>
                        <th className="px-5 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/20">
                      {items.map((asset, idx) => (
                        <tr key={asset.id || idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-2.5 font-mono text-xs text-gray-200">
                            {asset.value || asset.url || asset.hostname || asset.ip_address || '—'}
                          </td>
                          <td className="px-5 py-2.5">
                            <div className="flex flex-wrap gap-1">
                              {(asset.technologies || []).map((tech, i) => (
                                <span key={i} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">{tech}</span>
                              ))}
                              {(!asset.technologies || asset.technologies.length === 0) && (
                                <span className="text-xs text-gray-600">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-2.5 text-xs text-gray-500">{asset.status || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )
          })}

          {assets.length === 0 && (
            <GlassCard className="text-center py-12">
              <Globe className="mx-auto mb-3 h-10 w-10 text-gray-700" />
              <p className="text-sm text-gray-500">No assets discovered yet</p>
              <p className="text-xs text-gray-600 mt-1">Run a scan to discover the attack surface</p>
            </GlassCard>
          )}
        </>
      )}
    </div>
  )
}
