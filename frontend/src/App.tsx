import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import AdminRoute from './components/AdminRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Wait for Supabase to restore the session from localStorage
    supabase.auth.getSession().then(() => setReady(true))
  }, [])

  // Don't render routes until session is restored
  // otherwise AdminRoute will redirect before the session loads
  if (!ready) return <div>Loading...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />
        {/* Redirect root to dashboard, AdminRoute handles the rest */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}