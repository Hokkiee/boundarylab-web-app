import { useState, useEffect } from 'react'
import { 
  ExclamationTriangleIcon, 
  LightBulbIcon, 
  HeartIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import Sidebar from '../components/Sidebar'
import MobileNavigation from '../components/MobileNavigation'
import MobileSidebar from '../components/MobileSidebar'
import { feedbackService } from '../services/feedbackService'

const typeIcons = {
  bug: ExclamationTriangleIcon,
  feature: LightBulbIcon,
  general: ChatBubbleLeftRightIcon,
  appreciation: HeartIcon
}

const typeColors = {
  bug: 'text-red-600 bg-red-50 border-red-200',
  feature: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  general: 'text-blue-600 bg-blue-50 border-blue-200',
  appreciation: 'text-pink-600 bg-pink-50 border-pink-200'
}

const statusColors = {
  new: 'text-blue-600 bg-blue-50',
  reviewed: 'text-yellow-600 bg-yellow-50',
  in_progress: 'text-purple-600 bg-purple-50',
  resolved: 'text-green-600 bg-green-50',
  closed: 'text-gray-600 bg-gray-50'
}

const priorityColors = {
  low: 'text-gray-600 bg-gray-50',
  medium: 'text-blue-600 bg-blue-50',
  high: 'text-orange-600 bg-orange-50',
  urgent: 'text-red-600 bg-red-50'
}

function AdminFeedbackPage({ user }) {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', type: '', priority: '' })
  const [stats, setStats] = useState(null)
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  useEffect(() => {
    loadFeedback()
    loadStats()
  }, [filters])

  const loadFeedback = async () => {
    try {
      setLoading(true)
      const data = await feedbackService.getAllFeedback(filters)
      setFeedbacks(data)
    } catch (error) {
      console.error('Error loading feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await feedbackService.getFeedbackStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const updateStatus = async (feedbackId, newStatus) => {
    try {
      await feedbackService.updateFeedbackStatus(feedbackId, newStatus)
      loadFeedback() // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const updatePriority = async (feedbackId, newPriority) => {
    try {
      await feedbackService.updateFeedbackPriority(feedbackId, newPriority)
      loadFeedback() // Refresh the list
    } catch (error) {
      console.error('Error updating priority:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Feedback Dashboard</h1>
            
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Feedback</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.byStatus?.new || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Resolved</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.byStatus?.resolved || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">This Week</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.recent}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-300 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-300 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="general">General Feedback</option>
                <option value="appreciation">Appreciation</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-300 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Feedback List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading feedback...</p>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="p-8 text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No feedback found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {feedbacks.map((feedback) => {
                  const TypeIcon = typeIcons[feedback.feedback_type]
                  return (
                    <div key={feedback.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-2 rounded-lg border ${typeColors[feedback.feedback_type]}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[feedback.status]}`}>
                                {feedback.status.replace('_', ' ')}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[feedback.priority]}`}>
                                {feedback.priority}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(feedback.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-900 mb-2">{feedback.feedback_text}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>From: {feedback.display_name || feedback.user_email}</span>
                              {feedback.contact_email && (
                                <span>Contact: {feedback.contact_email}</span>
                              )}
                              {feedback.response_count > 0 && (
                                <span>{feedback.response_count} responses</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <select
                            value={feedback.status}
                            onChange={(e) => updateStatus(feedback.id, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-accent-300"
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                          <select
                            value={feedback.priority}
                            onChange={(e) => updatePriority(feedback.id, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-accent-300"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminFeedbackPage
