import { useEffect, useState } from 'react'
import { Globe, RefreshCw, Server, Network, Link2, Clock } from 'lucide-react'
import { getAttackSurface, refreshAttackSurface } from '../lib/api'

const ASSET_TYPE_CONFIG = {
  domain:     { label: 'Domains', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  subdomain:  { label: 'Subdomains', icon: Link2, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ip_address: { label: 'IP Addresses', icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  endpoint:   { label: 'Endpoints', icon: Server, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
}

export default function AttackSurface() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState('all')

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
  const grouped = assets.reduce((acc, a) => {
    const type = a.asset_type || a.type || 'other'
    if (!acc[type]) acc[type] = []
    acc[type].push(a)
    return acc
  }, {})

  const typeCounts = Object.entries(grouped).map(([type, items]) => ({
    type,
    count: items.length,
    config: ASSET_TYPE_CONFIG[type] || { label: type, icon: Globe, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
  }))

  const filteredGroups = filterType === 'all' ? grouped : { [filterType]: grouped[filterType] || [] }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Attack Surface</h2>
          <p className="text-sm text-gray-500">Discovered assets and endpoints</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-50"
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
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">{error}</div>
      ) : loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-700 border-t-red-500" />
        </div>
      ) : (
        <>
          {/* Count cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {typeCounts.map(({ type, count, config }) => {
              const Icon = config.icon
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(filterType === type ? 'all' : type)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    filterType === type ? 'ring-1 ring-red-500/30 ' : ''
                  }${config.bg}`}
                >
                  <Icon className={`mb-2 h-5 w-5 ${config.color}`} />
                  <p className="text-2xl font-bold tabular-nums text-gray-100">{count}</p>
                  <p className="text-xs capitalize text-gray-500">{config.label}</p>
                </button>
              )
            })}
          </div>

          {/* Asset tables */}
          {Object.entries(filteredGroups).map(([type, items]) => {
            if (!items || items.length === 0) return null
            const config = ASSET_TYPE_CONFIG[type] || { label: type, icon: Globe, color: 'text-gray-400' }
            const Icon = config.icon

            return (
              <div key={type} className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <h3 className="text-sm font-semibold capitalize text-gray-300">{config.label}</h3>
                  <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs tabular-nums text-gray-500">{items.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800/50 text-left text-xs text-gray-500">
                        <th className="px-4 py-2 font-medium">Value</th>
                        <th className="px-4 py-2 font-medium">Technologies</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {items.map((asset, idx) => (
                        <tr key={asset.id || idx} className="hover:bg-gray-800/30">
                          <td className="px-4 py-2 font-mono text-xs text-gray-200">
                            {asset.value || asset.url || asset.hostname || asset.ip_address || '—'}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap gap-1">
                              {(asset.technologies || []).map((tech, i) => (
                                <span key={i} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">
                                  {tech}
                                </span>
                              ))}
                              {(!asset.technologies || asset.technologies.length === 0) && (
                                <span className="text-xs text-gray-600">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-500">{asset.status || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}

          {assets.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 py-16">
              <Globe className="mb-3 h-10 w-10 text-gray-700" />
              <p className="text-sm text-gray-500">No assets discovered yet</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
