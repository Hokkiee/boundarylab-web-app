import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import MobileNavigation from '../components/MobileNavigation'
import MobileSidebar from '../components/MobileSidebar'

function ProfilePageSimple({ user }) {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('ProfilePageSimple loaded, user:', user)
    if (!user) {
      console.log('No user, redirecting to login')
      navigate('/login')
    }
  }, [user, navigate])

  console.log('ProfilePageSimple rendering, user:', user)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation user={user}>
        {(handleNavigation) => <MobileSidebar user={user} onNavigate={handleNavigation} />}
      </MobileNavigation>
      <div className="lg:pl-72">
        <Sidebar user={user} />
        <div className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Page - Simple Test</h1>
              <p className="text-gray-600 mb-4">This is a simplified version to test if the page loads.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">User Information</h2>
                <p><strong>User ID:</strong> {user?.id || 'Not available'}</p>
                <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
                <p><strong>User Object:</strong> {JSON.stringify(user, null, 2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePageSimple
