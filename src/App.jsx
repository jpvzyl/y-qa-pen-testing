import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
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
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
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
    </AuthProvider>
  )
}
