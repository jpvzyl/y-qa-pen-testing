import { ChevronDown, FolderOpen } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../lib/auth'

export default function ProjectSelector() {
  const { projects, selectedProject, selectProject } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!projects.length) return null

  return (
    <div ref={ref} className="relative px-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-left text-sm transition-colors hover:border-gray-700"
      >
        <FolderOpen className="h-3.5 w-3.5 shrink-0 text-gray-500" />
        <span className="flex-1 truncate text-gray-300">
          {selectedProject?.name || 'Select project'}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-3 right-3 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-800 bg-gray-900 py-1 shadow-xl">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => { selectProject(p); setOpen(false) }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-800 ${
                selectedProject?.id === p.id ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              <FolderOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
