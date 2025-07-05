// Real-time service for live forum updates
import { supabase } from './supabase'

export const realtimeService = {
  // Subscribe to live forum post updates
  subscribeToForumPosts(callback) {
    const subscription = supabase
      .channel('forum_posts')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes
          schema: 'public',
          table: 'forum_posts'
        },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return subscription
  },

  // Subscribe to live comments for a specific post
  subscribeToPostComments(postId, callback) {
    const subscription = supabase
      .channel(`post_comments_${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          callback(payload.new)
        }
      )
      .subscribe()

    return subscription
  },

  // Subscribe to live likes/sparks
  subscribeToPostLikes(postId, callback) {
    const subscription = supabase
      .channel(`post_likes_${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_likes',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return subscription
  },

  // Subscribe to user presence (who's online)
  subscribeToUserPresence(callback) {
    const subscription = supabase
      .channel('presence')
      .on('presence', { event: 'sync' }, () => {
        const newState = subscription.presenceState()
        callback(newState)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        callback({ event: 'join', key, newPresences })
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        callback({ event: 'leave', key, leftPresences })
      })
      .subscribe()

    return subscription
  },

  // Track user presence
  trackUserPresence(userId, userData) {
    const subscription = supabase
      .channel('presence')
      .on('presence', { event: 'sync' }, () => {
        // User is now tracked
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await subscription.track({
            user_id: userId,
            ...userData,
            online_at: new Date().toISOString()
          })
        }
      })

    return subscription
  },

  // Unsubscribe from real-time updates
  unsubscribe(subscription) {
    supabase.removeChannel(subscription)
  }
}
