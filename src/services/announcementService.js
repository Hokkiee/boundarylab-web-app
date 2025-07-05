import { supabase } from './supabase'

export const announcementService = {
  // Get all published announcements
  async getAnnouncements(category = null) {
    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching announcements:', error)
      return { data: null, error }
    }
  },

  // Get all announcements (admin only)
  async getAllAnnouncements() {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching all announcements:', error)
      return { data: null, error }
    }
  },

  // Get single announcement
  async getAnnouncement(id) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching announcement:', error)
      return { data: null, error }
    }
  },

  // Create new announcement (admin only)
  async createAnnouncement(announcement) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Authentication required')
      }

      const { data, error } = await supabase
        .from('announcements')
        .insert([
          {
            ...announcement,
            author_id: user.id,
            author_name: announcement.author_name || 'BoundaryLab Team'
          }
        ])
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating announcement:', error)
      return { data: null, error }
    }
  },

  // Update announcement (admin only)
  async updateAnnouncement(id, updates) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating announcement:', error)
      return { data: null, error }
    }
  },

  // Delete announcement (admin only)
  async deleteAnnouncement(id) {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      return { error }
    }
  },

  // Toggle featured status (admin only)
  async toggleFeatured(id, featured) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update({ featured })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error toggling featured status:', error)
      return { data: null, error }
    }
  },

  // Toggle published status (admin only)
  async togglePublished(id, published) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update({ published })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error toggling published status:', error)
      return { data: null, error }
    }
  },

  // Check if user is admin
  async isAdmin() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return false

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (error) throw error

      return data?.is_admin || false
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }
}

export default announcementService
