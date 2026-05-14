import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Toaster } from '@/components/ui/sonner'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import HomePage from '@/pages/home/HomePage'

// Jastip Pages
import JastipListingsPage from '@/pages/jastip/JastipListingsPage'
import JastipRequestsPage from '@/pages/jastip/JastipRequestsPage'
import JastipCreatePage from '@/pages/jastip/JastipCreatePage'
import JastipRequestCreatePage from '@/pages/jastip/JastipRequestCreatePage'
import JastipMinePage from '@/pages/jastip/JastipMinePage'
import JastipDetailPage from '@/pages/jastip/JastipDetailPage'

// Preloved Pages
import PrelovedListingsPage from '@/pages/preloved/PrelovedListingsPage'
import PrelovedCreatePage from '@/pages/preloved/PrelovedCreatePage'
import PrelovedRequestsPage from '@/pages/preloved/PrelovedRequestsPage'
import PrelovedRequestCreatePage from '@/pages/preloved/PrelovedRequestCreatePage'
import PrelovedMinePage from '@/pages/preloved/PrelovedMinePage'
import PrelovedDetailPage from '@/pages/preloved/PrelovedDetailPage'

// Search Page
import SearchPage from '@/pages/search/SearchPage'

// Profile Page
import ProfilePage from '@/pages/profile/ProfilePage'

import { MainLayout } from '@/components/layout/MainLayout'

// Guard untuk route yang butuh login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Guard untuk route auth (redirect kalau sudah login)
function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout><HomePage /></MainLayout></ProtectedRoute>} />

        {/* Jastip Routes */}
        <Route path="/jastip" element={<Navigate to="/jastip/listings" replace />} />
        <Route path="/jastip/listings" element={<ProtectedRoute><MainLayout><JastipListingsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/jastip/listings/create" element={<ProtectedRoute><MainLayout><JastipCreatePage /></MainLayout></ProtectedRoute>} />
        <Route path="/jastip/listings/:id" element={<ProtectedRoute><MainLayout><JastipDetailPage /></MainLayout></ProtectedRoute>} />
        <Route path="/jastip/requests" element={<ProtectedRoute><MainLayout><JastipRequestsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/jastip/requests/create" element={<ProtectedRoute><MainLayout><JastipRequestCreatePage /></MainLayout></ProtectedRoute>} />
        <Route path="/jastip/mine" element={<ProtectedRoute><MainLayout><JastipMinePage /></MainLayout></ProtectedRoute>} />

        {/* Preloved Routes */}
        <Route path="/preloved" element={<Navigate to="/preloved/listings" replace />} />
        <Route path="/preloved/listings" element={<ProtectedRoute><MainLayout><PrelovedListingsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/preloved/listings/create" element={<ProtectedRoute><MainLayout><PrelovedCreatePage /></MainLayout></ProtectedRoute>} />
        <Route path="/preloved/listings/:id" element={<ProtectedRoute><MainLayout><PrelovedDetailPage /></MainLayout></ProtectedRoute>} />
        <Route path="/preloved/requests" element={<ProtectedRoute><MainLayout><PrelovedRequestsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/preloved/requests/create" element={<ProtectedRoute><MainLayout><PrelovedRequestCreatePage /></MainLayout></ProtectedRoute>} />
        <Route path="/preloved/mine" element={<ProtectedRoute><MainLayout><PrelovedMinePage /></MainLayout></ProtectedRoute>} />

        {/* Search Route */}
        <Route path="/search" element={<ProtectedRoute><MainLayout><SearchPage /></MainLayout></ProtectedRoute>} />

        {/* Profile Routes */}
        <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}
