import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Scans from './pages/Scans'
import NewScan from './pages/NewScan'
import ScanDetail from './pages/ScanDetail'
import Findings from './pages/Findings'
import FindingDetail from './pages/FindingDetail'
import Reports from './pages/Reports'
import AttackSurface from './pages/AttackSurface'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="scans" element={<Scans />} />
        <Route path="scans/new" element={<NewScan />} />
        <Route path="scans/:id" element={<ScanDetail />}>
          <Route path="findings" element={<Findings />} />
          <Route path="findings/:findingId" element={<FindingDetail />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="attack-surface" element={<AttackSurface />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
