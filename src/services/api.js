import { supabase, isSupabaseConfigured } from './supabase'

// Glossary Terms API
export const glossaryService = {
  // Get all published glossary terms
  async getAllTerms() {
    const { data, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .eq('is_published', true)
      .order('term', { ascending: true })

    if (error) {
      console.error('Error fetching glossary terms:', error)
      throw error
    }

    return data
  },

  // Get terms by category
  async getTermsByCategory(category) {
    const { data, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .eq('is_published', true)
      .eq('category', category)
      .order('term', { ascending: true })

    if (error) {
      console.error('Error fetching terms by category:', error)
      throw error
    }

    return data
  },

  // Search terms
  async searchTerms(searchQuery) {
    const { data, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .eq('is_published', true)
      .or(`term.ilike.%${searchQuery}%,definition.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
      .order('term', { ascending: true })

    if (error) {
      console.error('Error searching terms:', error)
      throw error
    }

    return data
  },

  // Mark term as learned by user
  async markTermAsLearned(termId, notes = '') {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_glossary_progress')
      .upsert({
        user_id: user.id,
        term_id: termId,
        is_learned: true,
        learned_at: new Date().toISOString(),
        notes
      })

    if (error) {
      console.error('Error marking term as learned:', error)
      throw error
    }

    return data
  },

  // Get user's learning progress
  async getUserProgress() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_glossary_progress')
      .select(`
        *,
        glossary_terms (
          id,
          term,
          category
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching user progress:', error)
      throw error
    }

    return data
  }
}

// Scenarios API
export const scenariosService = {
  // Get all published scenarios
  async getAllScenarios() {
    const { data, error } = await supabase
      .from('scenarios')
      .select(`
        *,
        scenario_choices (*)
      `)
      .eq('is_published', true)
      .order('title', { ascending: true })

    if (error) {
      console.error('Error fetching scenarios:', error)
      throw error
    }

    return data
  },

  // Get scenario by ID with choices
  async getScenarioById(scenarioId) {
    const { data, error } = await supabase
      .from('scenarios')
      .select(`
        *,
        scenario_choices (*)
      `)
      .eq('id', scenarioId)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching scenario:', error)
      throw error
    }

    return data
  },

  // Complete a scenario
  async completeScenario(scenarioId, choiceId, reflection = '') {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_scenario_completions')
      .upsert({
        user_id: user.id,
        scenario_id: scenarioId,
        choice_id: choiceId,
        reflection
      })

    if (error) {
      console.error('Error completing scenario:', error)
      throw error
    }

    return data
  },

  // Get user's completed scenarios
  async getUserCompletions() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_scenario_completions')
      .select('scenario_id, completed_at')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching user completions:', error)
      throw error
    }

    return data || []
  }
}

// Forum API
export const forumService = {
  // Get all published posts
  async getAllPosts() {
    if (!isSupabaseConfigured || !supabase) {
      console.log('Supabase not configured - returning empty array for forum posts')
      return []
    }

    try {
      // First try to get posts with profiles
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url,
            profile_picture_url
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching forum posts:', error)
        
        // If it's a 406 error or RLS issue, try without profiles join
        if (error.code === '42501' || error.message.includes('RLS') || error.message.includes('406')) {
          console.log('Trying to fetch posts without profiles join due to RLS restrictions')
          
          const { data: postsOnly, error: postsError } = await supabase
            .from('forum_posts')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })

          if (postsError) {
            console.error('Error fetching posts without profiles:', postsError)
            throw postsError
          }

          // Add empty profile data for posts without profiles
          const postsWithEmptyProfiles = postsOnly.map(post => ({
            ...post,
            profiles: null
          }))

          console.log('Successfully fetched posts without profiles')
          return await this.addLikeDataToPosts(postsWithEmptyProfiles)
        }
        
        throw error
      }

      console.log('Successfully fetched posts with profiles')
      return await this.addLikeDataToPosts(data)
    } catch (error) {
      console.error('Error in getAllPosts:', error)
      throw error
    }
  },

  // Helper method to add like data to posts
  async addLikeDataToPosts(posts) {
    // Get current user's liked posts
    const { data: { user } } = await supabase.auth.getUser()
    let likedPosts = []
    
    if (user) {
      try {
        likedPosts = await this.getUserLikedPosts(user.id)
      } catch (error) {
        console.error('Error fetching user liked posts:', error)
        // Don't throw here, just continue without liked posts info
      }
    }

    // Add isLiked property to each post
    const postsWithLikes = posts.map(post => ({
      ...post,
      isLiked: likedPosts.includes(post.id)
    }))

    return postsWithLikes
  },

  // Create a new post
  async createPost(title, content, category = 'general', isAnonymous = false, imageFiles = []) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Database not configured - cannot create posts in demo mode')
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    // Ensure user profile exists before creating post
    await profileService.getOrCreateProfile()

    let imageUrls = []
    
    // Upload images to Supabase Storage if any
    if (imageFiles && imageFiles.length > 0) {
      console.log('🚀 Uploading images to Supabase Storage:', imageFiles.length)
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}_${i}.${fileExt}`
        
        console.log(`📤 Uploading file ${i + 1}/${imageFiles.length}: ${fileName}`)
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('forum-images')
          .upload(fileName, file)
        
        if (uploadError) {
          console.error('❌ Error uploading image:', uploadError)
          throw new Error(`Failed to upload image ${file.name}: ${uploadError.message}`)
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('forum-images')
          .getPublicUrl(fileName)
        
        imageUrls.push(publicUrl)
        console.log(`✅ Image uploaded successfully: ${publicUrl}`)
      }
      
      console.log('🎨 All images uploaded:', imageUrls)
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        title,
        content,
        author_id: user.id,
        category,
        is_anonymous: isAnonymous,
        images: imageUrls
      })
      .select(`
        *,
        profiles (
          display_name,
          avatar_url
        )
      `)

    if (error) {
      console.error('Error creating post:', error)
      throw error
    }

    return data[0]
  },

  // Get posts by user
  async getUserPosts(userId) {
    if (!isSupabaseConfigured || !supabase) {
      console.log('Supabase not configured - returning empty array for user posts')
      return []
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        profiles (
          display_name,
          avatar_url,
          profile_picture_url
        )
      `)
      .eq('author_id', userId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user posts:', error)
      throw error
    }

    return data
  },

  // Delete a post (only by the author)
  async deletePost(postId) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', user.id) // Ensure user can only delete their own posts

    if (error) {
      console.error('Error deleting post:', error)
      throw error
    }

    return { success: true }
  },

  // Like a post
  async likePost(postId) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Database not configured - cannot like posts in demo mode')
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    try {
      // Check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('forum_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // If the table doesn't exist, provide a helpful error
        if (checkError.message.includes('does not exist')) {
          throw new Error('Forum likes table does not exist. Please run the database setup script.')
        }
        console.error('Error checking existing like:', checkError)
        throw new Error(`Failed to check like status: ${checkError.message}`)
      }

      if (existingLike) {
        throw new Error('Post already liked')
      }

      // Add the like
      const { error: likeError } = await supabase
        .from('forum_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        })

      if (likeError) {
        console.error('Error liking post:', likeError)
        throw new Error(`Failed to like post: ${likeError.message}`)
      }

      // Update the post's upvotes count
      const { error: updateError } = await supabase
        .rpc('increment_post_upvotes', { post_id: postId })

      if (updateError) {
        console.error('Error updating upvotes count:', updateError)
        // Don't throw here as the like was already recorded
      }

      return { success: true }
    } catch (error) {
      console.error('Error in likePost:', error)
      throw error
    }
  },

  // Unlike a post
  async unlikePost(postId) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Database not configured - cannot unlike posts in demo mode')
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    try {
      // Remove the like
      const { error: unlikeError } = await supabase
        .from('forum_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)

      if (unlikeError) {
        // If the table doesn't exist, provide a helpful error
        if (unlikeError.message.includes('does not exist')) {
          throw new Error('Forum likes table does not exist. Please run the database setup script.')
        }
        console.error('Error unliking post:', unlikeError)
        throw new Error(`Failed to unlike post: ${unlikeError.message}`)
      }

      // Update the post's upvotes count
      const { error: updateError } = await supabase
        .rpc('decrement_post_upvotes', { post_id: postId })

      if (updateError) {
        console.error('Error updating upvotes count:', updateError)
        // Don't throw here as the unlike was already recorded
      }

      return { success: true }
    } catch (error) {
      console.error('Error in unlikePost:', error)
      throw error
    }
  },

  // Get user's liked posts
  async getUserLikedPosts(userId) {
    if (!isSupabaseConfigured || !supabase) {
      console.log('Supabase not configured - returning empty array for user liked posts')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('forum_likes')
        .select('post_id')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching user liked posts:', error)
        
        // If the table doesn't exist, return empty array
        if (error.message.includes('does not exist')) {
          console.log('forum_likes table does not exist - please run the database setup script')
          return []
        }
        
        throw error
      }

      return data.map(like => like.post_id)
    } catch (error) {
      console.error('Error in getUserLikedPosts:', error)
      return []
    }
  },

  // Get comments for a post
  async getPostComments(postId) {
    if (!isSupabaseConfigured || !supabase) {
      console.log('Supabase not configured - returning empty array for comments')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url,
            profile_picture_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
        
        // If the table doesn't exist, return empty array
        if (error.message.includes('does not exist')) {
          console.log('forum_comments table does not exist')
          return []
        }
        
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getPostComments:', error)
      return []
    }
  },

  // Create a new comment
  async createComment(postId, content, isAnonymous = false) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Database not configured - cannot create comments in demo mode')
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    // Ensure user profile exists
    await profileService.getOrCreateProfile()

    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          content,
          author_id: user.id,
          is_anonymous: isAnonymous
        })
        .select(`
          *,
          profiles (
            display_name,
            avatar_url,
            profile_picture_url
          )
        `)

      if (error) {
        console.error('Error creating comment:', error)
        throw error
      }

      return data[0]
    } catch (error) {
      console.error('Error in createComment:', error)
      throw error
    }
  },

  // Delete a comment (only by the author)
  async deleteComment(commentId) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Database not configured - cannot delete comments in demo mode')
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    try {
      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', user.id) // Ensure user can only delete their own comments

      if (error) {
        console.error('Error deleting comment:', error)
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error in deleteComment:', error)
      throw error
    }
  }
}

// Profile API
export const profileService = {
  // Get user profile (alias for getOrCreateProfile for compatibility)
  async getProfile() {
    return this.getOrCreateProfile()
  },

  // Get or create user profile
  async getOrCreateProfile() {
    console.log('getOrCreateProfile called')
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Auth user from getOrCreateProfile:', user?.id)
    
    if (!user) throw new Error('User not authenticated')

    // Try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    console.log('Existing profile query result:', { existingProfile, fetchError })

    if (existingProfile) {
      return existingProfile
    }

    // If profile doesn't exist, create new one
    if (fetchError && fetchError.code === 'PGRST116') {
      console.log('Profile not found, creating new profile for user:', user.id)
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Anonymous User',
          avatar_url: user.user_metadata?.avatar_url || null,
          profile_picture_url: user.user_metadata?.profile_picture_url || null
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        throw new Error(`Failed to create user profile: ${error.message}`)
      }

      console.log('Profile created successfully:', data)
      return data
    }

    // If there's a different error, throw it
    if (fetchError) {
      console.error('Error fetching profile:', fetchError)
      throw new Error(`Failed to fetch user profile: ${fetchError.message}`)
    }

    return null
  },

  // Update profile
  async updateProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    // Filter out undefined/null values and only include allowed fields
    const allowedFields = ['display_name', 'bio', 'avatar_url', 'job_title', 'motto', 'profile_picture_url']
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key) && updates[key] !== undefined && updates[key] !== null)
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {})

    // Add updated_at timestamp
    filteredUpdates.updated_at = new Date().toISOString()

    if (Object.keys(filteredUpdates).length === 1) { // Only updated_at
      console.log('No valid fields to update')
      return await this.getOrCreateProfile() // Return current profile
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(filteredUpdates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      
      // If error is about missing columns, try updating with basic fields only
      if (error.message?.includes('column') && error.message?.includes('does not exist')) {
        console.log('Attempting to update with basic fields only')
        const basicUpdates = Object.keys(filteredUpdates)
          .filter(key => ['display_name', 'bio', 'avatar_url', 'updated_at'].includes(key))
          .reduce((obj, key) => {
            obj[key] = filteredUpdates[key]
            return obj
          }, {})

        if (Object.keys(basicUpdates).length > 1) { // More than just updated_at
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .update(basicUpdates)
            .eq('id', user.id)
            .select()
            .single()

          if (retryError) {
            console.error('Error updating profile with basic fields:', retryError)
            throw retryError
          }

          return retryData
        }
      }
      
      throw error
    }

    return data
  },

  // Get user's reflections with privacy settings
  async getUserReflections() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_scenario_completions')
      .select(`
        *,
        scenarios (
          title,
          category
        ),
        user_reflections (
          is_public
        )
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching user reflections:', error)
      throw error
    }

    return data
  },

  // Update reflection privacy
  async updateReflectionPrivacy(completionId, isPublic) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_reflections')
      .upsert({
        user_id: user.id,
        scenario_completion_id: completionId,
        is_public: isPublic
      })
      .select()

    if (error) {
      console.error('Error updating reflection privacy:', error)
      throw error
    }

    return data
  },

  // Update reflection visibility
  async updateReflectionVisibility(reflectionId, isPublic) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_reflections')
      .update({ is_public: isPublic })
      .eq('id', reflectionId)
      .eq('user_id', user.id) // Ensure user can only update their own reflections
      .single()

    if (error) {
      console.error('Error updating reflection visibility:', error)
      throw error
    }

    return data
  },

  // Get public reflections for a user (for viewing other profiles)
  async getPublicReflections(userId) {
    try {
      const { data, error } = await supabase
        .from('user_scenario_completions')
        .select(`
          *,
          scenarios (
            title,
            category
          )
        `)
        .eq('user_id', userId)
        .not('reflection', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(5) // Show only recent 5 reflections with content

      if (error) {
        console.error('Error fetching public reflections:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getPublicReflections:', error)
      return [] // Return empty array if there's an error
    }
  },

  // Delete user account and all associated data
  async deleteAccount() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    try {
      // Call the database function to delete all user data
      const { error } = await supabase
        .rpc('request_account_deletion', {
          user_id: user.id
        })

      if (error) {
        console.error('Error deleting account:', error)
        throw error
      }

      // Sign out the user after successful deletion
      await supabase.auth.signOut()

      return { success: true }
    } catch (error) {
      console.error('Error in deleteAccount:', error)
      throw error
    }
  }
}

// Dashboard API
export const dashboardService = {
  // Get comprehensive dashboard stats for user
  async getDashboardStats() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    try {
      // Get all stats in parallel
      const [
        allTerms,
        userProgress,
        userScenarios,
        userPosts
      ] = await Promise.all([
        supabase.from('glossary_terms').select('id').eq('is_published', true),
        supabase.from('user_glossary_progress').select('id').eq('user_id', user.id),
        supabase.from('user_scenario_completions').select('id').eq('user_id', user.id),
        supabase.from('forum_posts').select('id').eq('author_id', user.id).eq('is_published', true)
      ])

      const totalTerms = allTerms.data?.length || 0
      const learnedTerms = userProgress.data?.length || 0
      const completedScenarios = userScenarios.data?.length || 0
      const forumPosts = userPosts.data?.length || 0

      // Calculate boundary score (weighted average)
      const glossaryWeight = 0.4
      const scenarioWeight = 0.4
      const forumWeight = 0.2

      const glossaryScore = totalTerms > 0 ? (learnedTerms / totalTerms) * 100 : 0
      const scenarioScore = Math.min(completedScenarios * 20, 100) // Each scenario worth 20%
      const forumScore = Math.min(forumPosts * 25, 100) // Each post worth 25%

      const boundaryScore = Math.round(
        (glossaryScore * glossaryWeight) + 
        (scenarioScore * scenarioWeight) + 
        (forumScore * forumWeight)
      )

      return {
        glossaryTerms: totalTerms,
        learnedTerms,
        scenariosCompleted: completedScenarios,
        forumPosts,
        boundaryScore: Math.max(boundaryScore, 10) // Minimum 10% to encourage users
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }
}

// Spark API
export const sparkService = {
  // Send a spark to a user for a specific post
  async sendSpark(recipientId, postId) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_sparks')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        post_id: postId
      })
      .select()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('You have already sparked this post')
      }
      console.error('Error sending spark:', error)
      throw error
    }

    return data[0]
  },

  // Remove a spark (unspark)
  async removeSpark(postId) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('user_sparks')
      .delete()
      .eq('sender_id', user.id)
      .eq('post_id', postId)

    if (error) {
      console.error('Error removing spark:', error)
      throw error
    }

    return true
  },

  // Check if user has sparked a post
  async hasUserSparkedPost(postId) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const { data, error } = await supabase
      .from('user_sparks')
      .select('id')
      .eq('sender_id', user.id)
      .eq('post_id', postId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking spark status:', error)
      return false
    }

    return !!data
  },

  // Get sparks for a post with sender details
  async getPostSparks(postId) {
    const { data, error } = await supabase
      .from('user_sparks')
      .select(`
        *,
        sender:profiles!sender_id (
          display_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching post sparks:', error)
      throw error
    }

    return data
  }
}

// Notification API
export const notificationService = {
  // Get user's notifications
  async getUserNotifications() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        sender:profiles!sender_id (
          display_name,
          avatar_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }

    return data
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }

    return true
  },

  // Get unread notification count
  async getUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return 0

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (error) {
      console.error('Error getting unread count:', error)
      return 0
    }

    return count || 0
  }
}
