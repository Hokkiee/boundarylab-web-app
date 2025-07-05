import { Link } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../services/supabase'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import SignOutModal from './SignOutModal'
import logoHorizontal from '../assets/images/logos/logo-horizontal.svg'

function Navigation({ user }) {
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  
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

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logoHorizontal} 
              alt="BoundaryLab" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-accent-300 hover:bg-accent-400 text-black px-4 py-2 rounded-2xl text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-accent-300 hover:bg-accent-400 text-black px-4 py-2 rounded-2xl text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleConfirmSignOut}
      />
    </nav>
  )
}

export default Navigation
