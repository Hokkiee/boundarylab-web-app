import { supabase } from './supabase'

export const notificationService = {
  // Create a new notification
  async createNotification(userId, type, title, message, data = {}) {
    try {
      const insertData = {
        user_id: userId,
        type,
        title,
        message
      }
      
      // Only include data if the column exists
      // For now, we'll skip the data column
      
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  },

  // Get all notifications for a user
  async getUserNotifications(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  },

  // Get unread notification count
  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return false
    }
  },

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting notification:', error)
      return false
    }
  },

  // Listen for real-time notifications
  subscribeToNotifications(userId, callback) {
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new)
        }
      )
      .subscribe()

    return subscription
  },

  // Unsubscribe from notifications
  unsubscribeFromNotifications(subscription) {
    supabase.removeChannel(subscription)
  },

  // Helper functions for creating specific notification types
  async createSparkNotification(recipientId, senderName, postTitle = null) {
    const title = 'You received a spark! ✨'
    const message = postTitle 
      ? `${senderName} sent you a spark on "${postTitle}"`
      : `${senderName} sent you a spark`
    
    return this.createNotification(recipientId, 'spark', title, message)
  },

  async createForumReplyNotification(recipientId, replierName, postTitle) {
    const title = 'New Reply'
    const message = `${replierName} replied to your post "${postTitle}"`
    
    return this.createNotification(recipientId, 'forum_reply', title, message)
  },

  async createSystemNotification(userId, title, message) {
    return this.createNotification(userId, 'system', title, message)
  },

  async createAchievementNotification(userId, achievement) {
    const title = 'Achievement Unlocked! 🏆'
    const message = `You've ${achievement}!`
    
    return this.createNotification(userId, 'achievement', title, message)
  }
}
