import { 
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { profileService } from '../services/api'
import SignOutModal from './SignOutModal'
import NotificationBell from './NotificationBell'
import logoHorizontal from '../assets/images/logos/logo-horizontal.svg'

const navigation = [
  { name: 'Glossary', href: '/glossary', icon: BookOpenIcon, current: false },
  { name: 'Scenarios', href: '/scenarios', icon: AcademicCapIcon, current: false },
  { name: 'Forum', href: '/forum', icon: ChatBubbleLeftRightIcon, current: false },
  { name: 'Profile', href: '/profile', icon: UserIcon, current: false },
  { name: 'Feedback', href: '/feedback', icon: ChatBubbleBottomCenterTextIcon, current: false },
]

function Sidebar({ user }) {
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const profileData = await profileService.getProfile()
          setProfile(profileData)
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      }
      
      fetchProfile()
    }
  }, [user])
  
  const handleLogout = () => {
    setShowSignOutModal(true)
  }

  const handleConfirmSignOut = async () => {
    try {
      await supabase.auth.signOut()
      // Redirect to landing page
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
    setShowSignOutModal(false)
  }

  // Helper function to generate Gravatar URL
  const getGravatarUrl = (email) => {
    if (!email) return null
    const hash = btoa(email.toLowerCase()).replace(/=/g, '')
    return `https://www.gravatar.com/avatar/${hash}?d=404&s=80`
  }

  // Helper function to get profile picture URL with fallbacks
  const getProfilePictureUrl = (profile, user) => {
    return profile?.avatar_url || 
           profile?.profile_picture_url || 
           user?.user_metadata?.avatar_url ||
           getGravatarUrl(user?.email)
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      {/* Sidebar component */}
      <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-gray-200">
          <Link to="/glossary" className="flex items-center space-x-3">
            <img 
              src={logoHorizontal} 
              alt="BoundaryLab" 
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col overflow-y-auto pt-8">
          <nav className="flex-1 space-y-2 px-4">
            {navigation.map((item) => {
              const current = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    current
                      ? 'bg-accent-50 text-accent-700 shadow-sm'
                      : 'text-gray-700 hover:text-accent-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                      current ? 'text-accent-600' : 'text-gray-400 group-hover:text-accent-500'
                    }`}
                  />
                  {item.name}
                  {current && (
                    <div className="absolute right-0 w-1 h-8 bg-accent-500 rounded-l-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                {profile?.avatar_url || profile?.profile_picture_url || user?.user_metadata?.avatar_url ? (
                  <img
                    src={getProfilePictureUrl(profile, user)}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {profile?.display_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.display_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <div className="flex-shrink-0 ml-2">
                <NotificationBell user={user} />
              </div>
            </div>
            
            <div className="space-y-1">
              <Link 
                to="/settings"
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Cog6ToothIcon className="mr-3 h-4 w-4 text-gray-400" />
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4 text-gray-400" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleConfirmSignOut}
      />
    </div>
  )
}

export default Sidebar
