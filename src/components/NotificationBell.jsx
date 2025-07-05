import { useState, useEffect } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { notificationService } from '../services/notificationService'
import NotificationModal from './NotificationModal'

function NotificationBell({ user }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (user) {
      loadUnreadCount()
      
      // Subscribe to real-time notification updates
      const subscription = notificationService.subscribeToNotifications(user.id, () => {
        // Refresh unread count when new notification arrives
        loadUnreadCount()
      })

      return () => {
        if (subscription) {
          notificationService.unsubscribeFromNotifications(subscription)
        }
      }
    }
  }, [user])

  const loadUnreadCount = async () => {
    if (!user) return
    
    try {
      const count = await notificationService.getUnreadCount(user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  if (!user) return null

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setShowModal(true)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
        title="View notifications"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold shadow-sm border border-white min-w-[16px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          loadUnreadCount() // Refresh count when modal closes
        }}
        onUnreadCountChange={(newCount) => {
          setUnreadCount(newCount)
        }}
        user={user}
      />
    </>
  )
}

export default NotificationBell
