import { useState, useEffect } from 'react'
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  TrophyIcon, 
  InformationCircleIcon,
  EyeIcon 
} from '@heroicons/react/24/solid'
import { notificationService } from '../services/notificationService'

function NotificationModal({ isOpen, onClose, onUnreadCountChange, user }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      loadNotifications()
      loadUnreadCount()
    }
  }, [isOpen, user])

  const loadNotifications = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const data = await notificationService.getUserNotifications(user.id)
      setNotifications(data)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    if (!user) return
    
    try {
      const count = await notificationService.getUnreadCount(user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      )
      const newUnreadCount = Math.max(0, unreadCount - 1)
      setUnreadCount(newUnreadCount)
      
      // Update the bell's unread count immediately
      if (onUnreadCountChange) {
        onUnreadCountChange(newUnreadCount)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user.id)
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      )
      setUnreadCount(0)
      
      // Update the bell's unread count immediately
      if (onUnreadCountChange) {
        onUnreadCountChange(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'spark':
        return <SparklesIcon className="h-5 w-5 text-yellow-500" />
      case 'forum_reply':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />
      case 'achievement':
        return <TrophyIcon className="h-5 w-5 text-green-500" />
      case 'profile_view':
        return <EyeIcon className="h-5 w-5 text-purple-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BellIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1.5 hover:bg-green-50 rounded-lg transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 px-6 text-gray-500">
              <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-sm text-gray-500">When you receive sparks or replies, they'll appear here.</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg mb-1 ${
                    !notification.is_read ? 'bg-green-50/50 border border-green-200' : ''
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      handleMarkAsRead(notification.id)
                    }
                  }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-1.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationModal
