import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Toaster } from '@/components/ui/sonner'
import LandingPage from '@/pages/landing/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import HomePage from '@/pages/home/HomePage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import GoogleCallbackPage from '@/pages/auth/GoogleCallbackPage'
import EmailVerificationPage from '@/pages/auth/EmailVerificationPage'

// Jastip Pages
import JastipListingsPage from '@/pages/jastip/JastipListingsPage'
import JastipRequestsPage from '@/pages/jastip/JastipRequestsPage'
import JastipCreatePage from '@/pages/jastip/JastipCreatePage'
import JastipRequestCreatePage from '@/pages/jastip/JastipRequestCreatePage'
import JastipMinePage from '@/pages/jastip/JastipMinePage'
import JastipDetailPage from '@/pages/jastip/JastipDetailPage'
import JastipRequestDetailPage from '@/pages/jastip/JastipRequestDetailPage'

// Preloved Pages
import PrelovedListingsPage from '@/pages/preloved/PrelovedListingsPage'
import PrelovedCreatePage from '@/pages/preloved/PrelovedCreatePage'
import PrelovedRequestsPage from '@/pages/preloved/PrelovedRequestsPage'
import PrelovedRequestCreatePage from '@/pages/preloved/PrelovedRequestCreatePage'
import PrelovedMinePage from '@/pages/preloved/PrelovedMinePage'
import PrelovedDetailPage from '@/pages/preloved/PrelovedDetailPage'
import PrelovedRequestDetailPage from '@/pages/preloved/PrelovedRequestDetailPage'

// Search Page
import SearchPage from '@/pages/search/SearchPage'

// Profile Page
import ProfilePage from '@/pages/profile/ProfilePage'
import SetupProfilePage from '@/pages/profile/SetupProfilePage'

// About Page
import AboutPage from '@/pages/about/AboutPage'

// Android Page
import AndroidPage from '@/pages/android/AndroidPage'

import { MainLayout } from '@/components/layout/MainLayout'
import { ScrollToTop } from '@/components/ScrollToTop'
import { GlobalAuthErrorListener } from '@/components/auth/GlobalAuthErrorListener'
import { RequireWaVerification } from '@/components/auth/RequireWaVerification'

// Guard untuk route yang butuh login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/landing" replace />
  return <>{children}</>
}

// Guard untuk route auth (redirect kalau sudah login)
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  if (isAuthenticated) {
    if (user && (!user.status || !user.avatar_url)) {
      return <Navigate to="/setup-profile" replace />
    }
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <GlobalAuthErrorListener />
      <Routes>
        {/* Landing page — public, first impression */}
        <Route path="/landing" element={<GuestRoute><LandingPage /></GuestRoute>} />

        {/* About page — public, no auth required */}
        <Route path="/about" element={<AboutPage />} />

        {/* Android download page — public */}
        <Route path="/android" element={<AndroidPage />} />

        {/* Auth routes */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
        <Route path="/auth/google/callback" element={<GuestRoute><GoogleCallbackPage /></GuestRoute>} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />

        {/* Protected routes — dashboard home */}
        <Route path="/" element={<ProtectedRoute><MainLayout><HomePage /></MainLayout></ProtectedRoute>} />

        {/* Jastip Routes */}
        <Route path="/jastip" element={<Navigate to="/jastip/listings" replace />} />
        <Route path="/jastip/listings" element={<ProtectedRoute><MainLayout><JastipListingsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/jastip/listings/create" element={<ProtectedRoute><RequireWaVerification><MainLayout><JastipCreatePage /></MainLayout></RequireWaVerification></ProtectedRoute>} />
        <Route path="/jastip/listings/edit/:id" element={<ProtectedRoute><RequireWaVerification><MainLayout><JastipCreatePage /></MainLayout></RequireWaVerification></ProtectedRoute>} />
        <Route path="/jastip/listings/:id" element={<ProtectedRoute><MainLayout><JastipDetailPage /></MainLayout></ProtectedRoute>} />
        <Route path="/jastip/requests" element={<ProtectedRoute><MainLayout><JastipRequestsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/jastip/requests/create" element={<ProtectedRoute><RequireWaVerification><MainLayout><JastipRequestCreatePage /></MainLayout></RequireWaVerification></ProtectedRoute>} />
        <Route path="/jastip/requests/edit/:id" element={<ProtectedRoute><RequireWaVerification><MainLayout><JastipRequestCreatePage /></MainLayout></RequireWaVerification></ProtectedRoute>} />
        <Route path="/jastip/requests/:id" element={<ProtectedRoute><MainLayout><JastipRequestDetailPage /></MainLayout></ProtectedRoute>} />
        <Route path="/jastip/mine" element={<ProtectedRoute><MainLayout><JastipMinePage /></MainLayout></ProtectedRoute>} />

        {/* Preloved Routes */}
        <Route path="/preloved" element={<Navigate to="/preloved/listings" replace />} />
        <Route path="/preloved/listings" element={<ProtectedRoute><MainLayout><PrelovedListingsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/preloved/listings/create" element={<ProtectedRoute><RequireWaVerification><MainLayout><PrelovedCreatePage /></MainLayout></RequireWaVerification></ProtectedRoute>} />
        <Route path="/preloved/listings/edit/:id" element={<ProtectedRoute><RequireWaVerification><MainLayout><PrelovedCreatePage /></MainLayout></RequireWaVerification></ProtectedRoute>} />
        <Route path="/preloved/listings/:id" element={<ProtectedRoute><MainLayout><PrelovedDetailPage /></MainLayout></ProtectedRoute>} />
        <Route path="/preloved/requests" element={<ProtectedRoute><MainLayout><PrelovedRequestsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/preloved/requests/create" element={<ProtectedRoute><RequireWaVerification><MainLayout><PrelovedRequestCreatePage /></MainLayout></RequireWaVerification></ProtectedRoute>} />
        <Route path="/preloved/requests/edit/:id" element={<ProtectedRoute><RequireWaVerification><MainLayout><PrelovedRequestCreatePage /></MainLayout></RequireWaVerification></ProtectedRoute>} />
        <Route path="/preloved/requests/:id" element={<ProtectedRoute><MainLayout><PrelovedRequestDetailPage /></MainLayout></ProtectedRoute>} />
        <Route path="/preloved/mine" element={<ProtectedRoute><MainLayout><PrelovedMinePage /></MainLayout></ProtectedRoute>} />

        {/* Search Route */}
        <Route path="/search" element={<ProtectedRoute><MainLayout><SearchPage /></MainLayout></ProtectedRoute>} />

        {/* Profile Routes */}
        <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
        <Route path="/setup-profile" element={<ProtectedRoute><MainLayout><SetupProfilePage /></MainLayout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}
