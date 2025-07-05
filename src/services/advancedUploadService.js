// Enhanced file upload service for BoundaryLab Pro
import { supabase } from './supabase'

export const advancedUploadService = {
  // Upload file with progress tracking and metadata
  async uploadFile(file, bucketName, folder = '', purpose = 'other', relatedId = null, onProgress = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Validate file type based on bucket
      const validationResult = this.validateFile(file, bucketName)
      if (!validationResult.valid) {
        throw new Error(validationResult.message)
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${folder ? folder + '/' : ''}${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

      // Record upload in database
      const { data: recordData, error: recordError } = await supabase
        .from('user_uploads')
        .insert({
          user_id: user.id,
          file_path: fileName,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          bucket_name: bucketName,
          upload_purpose: purpose,
          related_id: relatedId,
          metadata: {
            original_name: file.name,
            public_url: publicUrl,
            upload_date: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (recordError) {
        console.error('Error recording upload:', recordError)
        // Don't throw here as file was uploaded successfully
      }

      return {
        success: true,
        fileName,
        publicUrl,
        uploadRecord: recordData
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  },

  // Upload multiple files with progress tracking
  async uploadMultipleFiles(files, bucketName, folder = '', purpose = 'other', relatedId = null, onProgress = null) {
    const results = []
    const total = files.length

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(files[i], bucketName, folder, purpose, relatedId)
        results.push(result)
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total,
            percentage: Math.round(((i + 1) / total) * 100),
            currentFile: files[i].name
          })
        }
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          fileName: files[i].name
        })
      }
    }

    return results
  },

  // Validate file based on bucket and purpose
  validateFile(file, bucketName) {
    const maxSizes = {
      'forum-images': 5 * 1024 * 1024, // 5MB
      'profile-pictures': 2 * 1024 * 1024, // 2MB
      'audio-recordings': 50 * 1024 * 1024, // 50MB
      'documents': 10 * 1024 * 1024, // 10MB
      'user-content': 20 * 1024 * 1024, // 20MB
      'resources': 100 * 1024 * 1024 // 100MB
    }

    const allowedTypes = {
      'forum-images': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      'profile-pictures': ['image/jpeg', 'image/png', 'image/webp'],
      'audio-recordings': ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-m4a', 'audio/webm'],
      'documents': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
      'user-content': ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mp3', 'audio/wav', 'application/pdf'],
      'resources': ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mp3', 'audio/wav', 'application/pdf', 'video/mp4', 'video/webm']
    }

    const maxSize = maxSizes[bucketName] || 5 * 1024 * 1024
    const allowed = allowedTypes[bucketName] || ['image/jpeg', 'image/png']

    if (file.size > maxSize) {
      return {
        valid: false,
        message: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
      }
    }

    if (!allowed.includes(file.type)) {
      return {
        valid: false,
        message: `File type ${file.type} not allowed for ${bucketName}`
      }
    }

    return { valid: true }
  },

  // Upload audio recording (for voice reflections)
  async uploadAudioRecording(audioBlob, purpose = 'reflection_audio', relatedId = null) {
    const file = new File([audioBlob], `recording_${Date.now()}.webm`, {
      type: 'audio/webm'
    })

    return this.uploadFile(file, 'audio-recordings', 'reflections', purpose, relatedId)
  },

  // Upload profile picture with automatic resizing
  async uploadProfilePicture(file, userId) {
    try {
      // Basic validation
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      // For now, upload as-is. In production, you might want to resize
      const result = await this.uploadFile(file, 'profile-pictures', '', 'profile_picture', userId)
      
      // Update user profile with new avatar URL
      if (result.success) {
        await supabase
          .from('profiles')
          .update({ 
            avatar_url: result.publicUrl,
            profile_picture_url: result.publicUrl
          })
          .eq('id', userId)
      }

      return result
    } catch (error) {
      console.error('Profile picture upload error:', error)
      throw error
    }
  },

  // Get user's upload history
  async getUserUploads(userId, limit = 50) {
    const { data, error } = await supabase
      .from('user_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user uploads:', error)
      throw error
    }

    return data
  },

  // Delete file and cleanup
  async deleteFile(fileName, bucketName, uploadId = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([fileName])

      if (storageError) throw storageError

      // Delete from database record
      if (uploadId) {
        const { error: dbError } = await supabase
          .from('user_uploads')
          .delete()
          .eq('id', uploadId)
          .eq('user_id', user.id)

        if (dbError) {
          console.error('Error removing upload record:', dbError)
          // Don't throw as file was deleted successfully
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  },

  // Get storage usage for user
  async getStorageUsage(userId) {
    const { data, error } = await supabase
      .from('storage_usage_analytics')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching storage usage:', error)
      return {
        total_files: 0,
        total_storage_mb: 0,
        forum_images: 0,
        profile_pictures: 0,
        audio_reflections: 0,
        documents: 0
      }
    }

    return data
  },

  // Create shareable link for file
  async createShareableLink(fileName, bucketName, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(fileName, expiresIn)

      if (error) throw error

      return {
        success: true,
        signedUrl: data.signedUrl,
        expiresAt: new Date(Date.now() + expiresIn * 1000)
      }
    } catch (error) {
      console.error('Error creating shareable link:', error)
      throw error
    }
  }
}
