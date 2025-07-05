import { createContext, useContext, useState, useEffect } from 'react'
import { notificationService } from '../services/notificationService'
import NotificationToast from '../components/NotificationToast'

const NotificationContext = createContext()

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children, user }) {
  const [toasts, setToasts] = useState([])
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    if (user) {
      // Subscribe to real-time notifications
      const sub = notificationService.subscribeToNotifications(user.id, (newNotification) => {
        // Show toast notification
        showToast(newNotification)
      })
      
      setSubscription(sub)
      
      return () => {
        if (sub) {
          notificationService.unsubscribeFromNotifications(sub)
        }
      }
    }
  }, [user])

  const showToast = (notification) => {
    const toastId = `toast-${Date.now()}-${Math.random()}`
    const toast = { ...notification, toastId }
    
    setToasts(prev => [...prev, toast])
  }

  const hideToast = (toastId) => {
    setToasts(prev => prev.filter(toast => toast.toastId !== toastId))
  }

  const createNotification = async (userId, type, title, message, data = {}) => {
    try {
      const notification = await notificationService.createNotification(userId, type, title, message, data)
      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  const createSparkNotification = async (recipientId, senderName, postTitle = null) => {
    try {
      const notification = await notificationService.createSparkNotification(recipientId, senderName, postTitle)
      return notification
    } catch (error) {
      console.error('Error creating spark notification:', error)
      throw error
    }
  }

  const createForumReplyNotification = async (recipientId, replierName, postTitle) => {
    try {
      const notification = await notificationService.createForumReplyNotification(recipientId, replierName, postTitle)
      return notification
    } catch (error) {
      console.error('Error creating forum reply notification:', error)
      throw error
    }
  }

  const createSystemNotification = async (userId, title, message) => {
    try {
      const notification = await notificationService.createSystemNotification(userId, title, message)
      return notification
    } catch (error) {
      console.error('Error creating system notification:', error)
      throw error
    }
  }

  const createAchievementNotification = async (userId, achievement) => {
    try {
      const notification = await notificationService.createAchievementNotification(userId, achievement)
      return notification
    } catch (error) {
      console.error('Error creating achievement notification:', error)
      throw error
    }
  }

  const value = {
    showToast,
    createNotification,
    createSparkNotification,
    createForumReplyNotification,
    createSystemNotification,
    createAchievementNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-[70] flex flex-col-reverse space-y-reverse space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast, index) => (
          <div
            key={toast.toastId}
            className="pointer-events-auto"
            style={{
              transform: `translateY(${index * -8}px)`,
              zIndex: 50 - index
            }}
          >
            <NotificationToast
              notification={toast}
              onClose={() => hideToast(toast.toastId)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
