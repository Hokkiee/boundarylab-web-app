import { supabase } from './supabase'

export const feedbackService = {
  // Submit new feedback
  async submitFeedback(feedbackData) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert([{
          user_id: feedbackData.userId,
          feedback_type: feedbackData.type,
          feedback_text: feedbackData.feedback,
          contact_email: feedbackData.email || null
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error submitting feedback:', error)
      throw error
    }
  },

  // Get user's own feedback
  async getUserFeedback(userId) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          feedback_responses!inner(
            id,
            response_text,
            created_at,
            is_public
          )
        `)
        .eq('user_id', userId)
        .eq('feedback_responses.is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user feedback:', error)
      throw error
    }
  },

  // Admin functions (require admin privileges)
  async getAllFeedback(filters = {}) {
    try {
      let query = supabase
        .from('feedback_with_user_details')
        .select('*')

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.type) {
        query = query.eq('feedback_type', filters.type)
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching all feedback:', error)
      throw error
    }
  },

  async updateFeedbackStatus(feedbackId, status, adminNotes = null) {
    try {
      const updateData = { 
        status,
        updated_at: new Date().toISOString()
      }
      
      if (adminNotes) {
        updateData.admin_notes = adminNotes
      }
      
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('feedback')
        .update(updateData)
        .eq('id', feedbackId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating feedback status:', error)
      throw error
    }
  },

  async updateFeedbackPriority(feedbackId, priority) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .update({ 
          priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', feedbackId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating feedback priority:', error)
      throw error
    }
  },

  async addFeedbackResponse(feedbackId, adminUserId, responseText, isPublic = false) {
    try {
      const { data, error } = await supabase
        .from('feedback_responses')
        .insert([{
          feedback_id: feedbackId,
          admin_user_id: adminUserId,
          response_text: responseText,
          is_public: isPublic
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding feedback response:', error)
      throw error
    }
  },

  async getFeedbackStats() {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('feedback_type, status, priority, created_at')

      if (error) throw error

      // Calculate stats
      const stats = {
        total: data.length,
        byType: {},
        byStatus: {},
        byPriority: {},
        recent: data.filter(f => {
          const createdAt = new Date(f.created_at)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return createdAt >= weekAgo
        }).length
      }

      // Group by type
      data.forEach(feedback => {
        stats.byType[feedback.feedback_type] = (stats.byType[feedback.feedback_type] || 0) + 1
        stats.byStatus[feedback.status] = (stats.byStatus[feedback.status] || 0) + 1
        stats.byPriority[feedback.priority] = (stats.byPriority[feedback.priority] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error('Error fetching feedback stats:', error)
      throw error
    }
  }
}
