import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './services/supabase'
import { profileService } from './services/api'
import { NotificationProvider } from './contexts/NotificationContext'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AnnouncementPage from './pages/AnnouncementPage'
import AdminAnnouncementPage from './pages/AdminAnnouncementPage'
import OAuthCallback from './pages/OAuthCallback'
import GlossaryPage from './pages/GlossaryPage'
import ScenariosPage from './pages/ScenariosPage'
import TestPage from './pages/TestPage'
import ForumPage from './pages/ForumPage'
import FeedbackPage from './pages/FeedbackPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

// Components
import Navigation from './components/Navigation'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Create profile if user exists
      if (session?.user) {
        console.log('User found, creating profile for:', session.user.id)
        profileService.getOrCreateProfile().catch(console.error)
      } else {
        console.log('No user session found')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', event)
        console.log('👤 Session user:', session?.user?.email)
        console.log('🌐 Current URL:', window.location.href)
        
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Create profile for new users
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in, creating profile...')
          profileService.getOrCreateProfile().catch(console.error)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading BoundaryLab...</p>
        </div>
      </div>
    )
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NotificationProvider user={user}>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes with Navigation */}
            <Route path="/" element={
              <>
                <Navigation user={user} />
                <LandingPage user={user} />
              </>
            } />
            <Route path="/login" element={
              user ? <Navigate to="/glossary" replace /> : (
                <>
                  <Navigation user={user} />
                  <LoginPage />
                </>
              )
            } />
            <Route path="/register" element={
              user ? <Navigate to="/glossary" replace /> : (
                <>
                  <Navigation user={user} />
                  <RegisterPage />
                </>
              )
            } />
            
            {/* Announcements route - accessible to all users */}
            <Route path="/announcements" element={<AnnouncementPage />} />
            
            {/* Admin announcements route - protected */}
            <Route path="/admin/announcements" element={
              user ? <AdminAnnouncementPage /> : <Navigate to="/login" replace />
            } />
            
            {/* OAuth callback routes */}
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/auth/v1/callback" element={<OAuthCallback />} />
            
            {/* App routes without Navigation (they have their own sidebar) */}
            <Route path="/glossary" element={
              user ? <GlossaryPage user={user} /> : <Navigate to="/login" replace />
            } />
            <Route path="/scenarios" element={
              user ? <ScenariosPage user={user} /> : <Navigate to="/login" replace />
            } />
            <Route path="/forum" element={
              user ? <ForumPage user={user} /> : <Navigate to="/login" replace />
            } />
            <Route path="/feedback" element={
              user ? <FeedbackPage user={user} /> : <Navigate to="/login" replace />
            } />
            <Route path="/profile" element={
              user ? <ProfilePage user={user} /> : <Navigate to="/login" replace />
            } />
            <Route path="/settings" element={
              user ? <SettingsPage user={user} /> : <Navigate to="/login" replace />
            } />
            
            {/* Catch-all route for unmatched paths */}
            <Route path="*" element={
              user ? <Navigate to="/glossary" replace /> : <Navigate to="/" replace />
            } />
          </Routes>
        </div>
      </NotificationProvider>
    </Router>
  )
}

export default App
