import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { announcementService } from '../services/announcementService'
import { 
  MegaphoneIcon, 
  CalendarDaysIcon, 
  StarIcon, 
  ArrowLeftIcon,
  SparklesIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  BookOpenIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import logoHorizontal from '../assets/images/logos/logo-horizontal.svg'

function AnnouncementPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch announcements on component mount and when category changes
  useEffect(() => {
    fetchAnnouncements()
  }, [selectedCategory])

  const fetchAnnouncements = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await announcementService.getAnnouncements(selectedCategory)
      
      if (error) {
        setError(error.message)
      } else {
        setAnnouncements(data || [])
      }
    } catch (err) {
      setError('Failed to load announcements')
      console.error('Error fetching announcements:', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All Announcements', icon: MegaphoneIcon },
    { id: 'product', name: 'Product Updates', icon: SparklesIcon },
    { id: 'features', name: 'New Features', icon: BoltIcon },
    { id: 'community', name: 'Community', icon: UserGroupIcon },
    { id: 'content', name: 'Content Updates', icon: BookOpenIcon },
    { id: 'technical', name: 'Technical', icon: CheckCircleIcon },
    { id: 'upcoming', name: 'Coming Soon', icon: StarIcon }
  ]

  const filteredAnnouncements = announcements

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      product: 'bg-purple-100 text-purple-800',
      features: 'bg-blue-100 text-blue-800',
      community: 'bg-green-100 text-green-800',
      content: 'bg-yellow-100 text-yellow-800',
      technical: 'bg-gray-100 text-gray-800',
      upcoming: 'bg-pink-100 text-pink-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-white to-accent-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20">
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

            {/* Back to Home */}
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-300 mb-6">
            <MegaphoneIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Announcements
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, features, and updates from BoundaryLab
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Announcements Feed */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading announcements...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <MegaphoneIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Announcements</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchAnnouncements}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <article
                  key={announcement.id}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 transition-all hover:shadow-xl hover:scale-[1.02] ${
                    announcement.featured ? 'ring-2 ring-primary-200' : ''
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {announcement.featured && (
                          <div className="flex items-center space-x-1 bg-gradient-to-r from-primary-500 to-accent-300 text-white px-3 py-1 rounded-full text-xs font-medium">
                            <StarIcon className="h-3 w-3" />
                            <span>Featured</span>
                          </div>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                          {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {announcement.title}
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {announcement.tags && announcement.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>{formatDate(announcement.created_at)}</span>
                      <span>•</span>
                      <span>by {announcement.author_name}</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-12">
                <MegaphoneIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                <p className="text-gray-600">Try selecting a different category to see more announcements.</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-500 to-accent-300 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Boundary Journey?</h2>
            <p className="text-lg mb-6 text-white/90">
              Join thousands of young adults learning to establish healthy boundaries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-white/20 text-white hover:bg-white/30 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementPage
