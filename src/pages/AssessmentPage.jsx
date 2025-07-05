import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Sidebar from '../components/Sidebar'
import MobileNavigation from '../components/MobileNavigation'
import MobileSidebar from '../components/MobileSidebar'

function AssessmentPage({ user }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation user={user}>
        {(handleNavigation) => <MobileSidebar user={user} onNavigate={handleNavigation} />}
      </MobileNavigation>
      <Sidebar user={user} />

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">Boundary Assessment</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl">
              Discover your boundary style and get personalized insights. Understand your patterns 
              and receive tailored recommendations for growth.
            </p>
          </div>

          {/* Coming Soon */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Assessment Coming Soon</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We're developing a comprehensive assessment to help you understand your unique boundary patterns and style.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg">
              <span className="text-sm font-medium">In Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentPage
