import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, CheckCircle, XCircle, Plug } from 'lucide-react'
import { testConnection } from '../lib/api'

export default function Settings() {
  const [projectId, setProjectId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    setProjectId(localStorage.getItem('yqa_project_id') || '')
    setApiKey(localStorage.getItem('yqa_api_key') || '')
  }, [])

  function handleSave(e) {
    e.preventDefault()
    localStorage.setItem('yqa_project_id', projectId)
    localStorage.setItem('yqa_api_key', apiKey)
    setSaved(true)
    setTestResult(null)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleTest() {
    try {
      setTesting(true)
      setTestResult(null)
      localStorage.setItem('yqa_project_id', projectId)
      localStorage.setItem('yqa_api_key', apiKey)
      await testConnection()
      setTestResult({ success: true, message: 'Connection successful!' })
    } catch (e) {
      setTestResult({ success: false, message: e.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Settings</h2>
        <p className="text-sm text-gray-500">Configure API connection to the Y-QA platform</p>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <Plug className="h-4 w-4" />
          API Configuration
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Project ID</label>
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="e.g. 1"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
          />
          <p className="mt-1 text-xs text-gray-600">The project ID from your Y-QA Rails backend</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Bearer token..."
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
          />
          <p className="mt-1 text-xs text-gray-600">Your Y-QA API authentication key</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Save Settings
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || !projectId}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            Settings saved successfully
          </div>
        )}

        {testResult && (
          <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
            testResult.success
              ? 'border-green-500/20 bg-green-500/10 text-green-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
          }`}>
            {testResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {testResult.message}
          </div>
        )}
      </form>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-300">API Endpoint</h3>
        <div className="rounded-lg bg-gray-950 p-3 font-mono text-xs text-gray-400">
          <p>Base URL: <span className="text-gray-200">/api/v1/projects/{'{project_id}'}/pen_testing</span></p>
          <p className="mt-1">Proxy: <span className="text-gray-200">http://localhost:3000</span></p>
        </div>
      </div>
    </div>
  )
}
