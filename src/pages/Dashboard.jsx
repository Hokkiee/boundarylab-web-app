import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  AcademicCapIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { 
  BookOpenIcon as BookOpenSolid,
  AcademicCapIcon as AcademicCapSolid 
} from '@heroicons/react/24/solid'
import Sidebar from '../components/Sidebar'
import MobileNavigation from '../components/MobileNavigation'
import MobileSidebar from '../components/MobileSidebar'
import { glossaryService, dashboardService } from '../services/api'

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    glossaryTerms: 0,
    learnedTerms: 0,
    scenariosCompleted: 0,
    forumPosts: 0,
    boundaryScore: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load comprehensive dashboard stats
        const [stats, userProgress] = await Promise.all([
          dashboardService.getDashboardStats(),
          glossaryService.getUserProgress().catch(() => [])
        ])

        setStats(stats)

        // Create recent activity from user progress
        const recentLearned = userProgress
          .sort((a, b) => new Date(b.learned_at) - new Date(a.learned_at))
          .slice(0, 3)
          .map(item => ({
            type: 'glossary',
            title: `Learned "${item.glossary_terms.term}"`,
            description: 'Added to your personal glossary',
            time: formatTimeAgo(item.learned_at),
            icon: BookOpenIcon,
            color: 'primary'
          }))

        // Add achievement if user has learned terms
        if (stats.learnedTerms >= 5) {
          recentLearned.unshift({
            type: 'achievement',
            title: 'Vocabulary Builder Badge',
            description: 'Earned for learning 5+ boundary terms',
            time: 'Recently earned',
            icon: TrophyIcon,
            color: 'yellow'
          })
        }

        setRecentActivity(recentLearned)

      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadDashboardData()
    }
  }, [user])

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
    
    return date.toLocaleDateString()
  }

  const quickActions = [
    {
      title: 'Explore Glossary',
      description: 'Learn boundary terminology',
      icon: BookOpenIcon,
      solidIcon: BookOpenSolid,
      href: '/glossary',
      color: 'primary',
      stats: `${stats.glossaryTerms} terms available`
    },
    {
      title: 'Practice Scenarios',
      description: 'Interactive boundary situations',
      icon: AcademicCapIcon,
      solidIcon: AcademicCapSolid,
      href: '/scenarios',
      color: 'secondary',
      stats: `${stats.scenariosCompleted} completed`
    },
    {
      title: 'Join Community',
      description: 'Share experiences & learn',
      icon: ChatBubbleLeftRightIcon,
      href: '/forum',
      color: 'green',
      stats: 'Active discussions'
    },
    {
      title: 'Take Assessment',
      description: 'Discover your boundary style',
      icon: MagnifyingGlassIcon,
      href: '/assessment',
      color: 'purple',
      stats: 'Personalized insights'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-50 text-primary-700 border-primary-200',
      secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
    return colors[color] || colors.primary
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation user={user}>
        {(handleNavigation) => <MobileSidebar user={user} onNavigate={handleNavigation} />}
      </MobileNavigation>
      <Sidebar user={user} />

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="space-y-8">
              <div className="bg-gray-200 rounded-2xl h-48 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-48 animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {user?.email?.split('@')[0] || 'there'}! 👋
                      </h1>
                      <p className="text-primary-100 text-lg mb-4">
                        Continue your boundary learning journey
                      </p>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <FireIcon className="h-5 w-5" />
                          <span>Active learner</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-5 w-5" />
                          <span>{stats.learnedTerms} terms learned</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <SparklesIcon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="h-6 w-6 text-primary-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.learnedTerms}</span>
              </div>
              <h3 className="font-medium text-gray-900">Terms Learned</h3>
              <p className="text-sm text-gray-600">of {stats.glossaryTerms} available</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-6 w-6 text-secondary-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.scenariosCompleted}</span>
              </div>
              <h3 className="font-medium text-gray-900">Scenarios</h3>
              <p className="text-sm text-gray-600">Practice sessions</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.forumPosts}</span>
              </div>
              <h3 className="font-medium text-gray-900">Forum Posts</h3>
              <p className="text-sm text-gray-600">Community engagement</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.boundaryScore}%</span>
              </div>
              <h3 className="font-medium text-gray-900">Boundary Score</h3>
              <p className="text-sm text-gray-600">Overall progress</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon
                return (
                  <Link
                    key={index}
                    to={action.href}
                    className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 hover:scale-[1.02] transform"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${getColorClasses(action.color)}`}>
                        <IconComponent className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-800">{action.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">{action.stats}</p>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Activity & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => {
                      const IconComponent = activity.icon
                      return (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClasses(activity.color)}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SparklesIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Start your journey!</h4>
                      <p className="text-gray-600 mb-4">Begin by exploring the glossary to learn boundary terminology.</p>
                      <Link
                        to="/glossary"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Explore Glossary
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress & Goals */}
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Progress</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Boundary Knowledge</span>
                      <span>{Math.round((stats.learnedTerms / Math.max(stats.glossaryTerms, 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.round((stats.learnedTerms / Math.max(stats.glossaryTerms, 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Scenario Practice</span>
                      <span>{stats.scenariosCompleted > 0 ? Math.min(stats.scenariosCompleted * 20, 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-secondary-500 to-secondary-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.scenariosCompleted > 0 ? Math.min(stats.scenariosCompleted * 20, 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Community Engagement</span>
                      <span>{stats.forumPosts > 0 ? Math.min(stats.forumPosts * 25, 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.forumPosts > 0 ? Math.min(stats.forumPosts * 25, 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Next Steps</h3>
                <div className="space-y-3">
                  <Link
                    to="/scenarios"
                    className="block p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <AcademicCapIcon className="h-5 w-5 text-secondary-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Try a Scenario</p>
                        <p className="text-xs text-gray-600">Practice workplace boundaries</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/assessment"
                    className="block p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Take Assessment</p>
                        <p className="text-xs text-gray-600">Discover your boundary style</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
