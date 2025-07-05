import { 
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoHorizontal from '../assets/images/logos/logo-horizontal.svg'

function MobileNavigation({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavigation = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="lg:hidden">
      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link to="/glossary" className="flex items-center space-x-2">
          <img 
            src={logoHorizontal} 
            alt="BoundaryLab" 
            className="h-8 w-auto"
          />
        </Link>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex flex-1"></div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Notifications */}
            <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
            </button>

            {/* Profile */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                {/* Pass the handleNavigation function to children */}
                {typeof children === 'function' ? children(handleNavigation) : children}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileNavigation
