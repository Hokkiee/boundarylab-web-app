import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  UserIcon, 
  PencilIcon, 
  PhotoIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { SparklesIcon as SparklesSolid } from '@heroicons/react/24/solid'
import Sidebar from '../components/Sidebar'
import MobileNavigation from '../components/MobileNavigation'
import MobileSidebar from '../components/MobileSidebar'
import { profileService, forumService } from '../services/api'
import { supabase } from '../services/supabase'

function ProfilePage({ user }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [userReflections, setUserReflections] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editedProfile, setEditedProfile] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    loadProfileData()
  }, [user, navigate])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load profile
      const profileData = await profileService.getOrCreateProfile()
      setProfile(profileData)
      setEditedProfile(profileData)

      // Load user's reflections from database
      const reflectionsData = await profileService.getUserReflections()
      
      // Load scenario reflections from localStorage
      const scenarioReflections = JSON.parse(localStorage.getItem('scenarioReflections') || '{}')
      const scenarioReflectionsList = Object.entries(scenarioReflections).map(([scenarioId, data]) => ({
        id: `scenario_${scenarioId}`,
        reflection_text: data.text,
        created_at: data.completedAt,
        scenario_type: 'scenario',
        scenario_title: data.scenarioTitle,
        is_public: false // scenario reflections are private by default
      }))
      
      // Combine database reflections with scenario reflections
      const allReflections = [...reflectionsData, ...scenarioReflectionsList]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      
      setUserReflections(allReflections)
      
      // Load user's forum posts
      const postsData = await forumService.getUserPosts(user.id)
      setUserPosts(postsData)
      
    } catch (err) {
      console.error('Error loading profile data:', err)
      setError('Failed to load profile data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError(null)
      
      const updatedProfile = await profileService.updateProfile(editedProfile)
      setProfile(updatedProfile)
      setEditMode(false)
      
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setUploadingImage(true)
      setError(null)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath)

      const updatedProfile = await profileService.updateProfile({
        profile_picture_url: data.publicUrl
      })
      
      setProfile(updatedProfile)
      setEditedProfile(updatedProfile)
      
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      console.log('Deleting post with ID:', postId)
      const result = await forumService.deletePost(postId)
      console.log('Delete result:', result)
      
      // Update local state to remove the deleted post
      setUserPosts(prev => {
        const updated = prev.filter(post => post.id !== postId)
        console.log('Updated posts count:', updated.length)
        return updated
      })
      
      console.log('Post deleted successfully from profile page')
    } catch (err) {
      console.error('Error deleting post:', err)
      setError(`Failed to delete post: ${err.message}`)
    }
  }

  const toggleReflectionVisibility = async (reflectionId, isPublic) => {
    try {
      await profileService.updateReflectionVisibility(reflectionId, !isPublic)
      setUserReflections(prev => 
        prev.map(reflection => 
          reflection.id === reflectionId 
            ? { ...reflection, is_public: !isPublic }
            : reflection
        )
      )
    } catch (err) {
      console.error('Error updating reflection visibility:', err)
      setError('Failed to update reflection visibility.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileNavigation user={user}>
          {(handleNavigation) => <MobileSidebar user={user} onNavigate={handleNavigation} />}
        </MobileNavigation>
        <Sidebar user={user} />
        
        <div className="lg:pl-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your profile and view your activity</p>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XMarkIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-6">
              <div className="flex items-start space-x-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {profile?.profile_picture_url ? (
                      <img
                        src={profile.profile_picture_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-12 w-12 text-gray-500" />
                    )}
                  </div>
                  {editMode && (
                    <div className="absolute -bottom-2 -right-2">
                      <label htmlFor="profile-picture" className="cursor-pointer">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                          {uploadingImage ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <PhotoIcon className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </label>
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={editedProfile.display_name || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, display_name: e.target.value }))}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={editedProfile.job_title || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, job_title: e.target.value }))}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Motto
                        </label>
                        <input
                          type="text"
                          value={editedProfile.motto || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, motto: e.target.value }))}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          rows={3}
                          value={editedProfile.bio || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                        >
                          {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          ) : (
                            <CheckIcon className="h-4 w-4 mr-2" />
                          )}
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false)
                            setEditedProfile(profile)
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {profile?.display_name || 'Anonymous User'}
                      </h2>
                      {profile?.job_title && (
                        <p className="text-gray-600 mt-1">{profile.job_title}</p>
                      )}
                      {profile?.motto && (
                        <p className="text-purple-600 italic mt-2">"{profile.motto}"</p>
                      )}
                      {profile?.bio && (
                        <p className="text-gray-700 mt-3">{profile.bio}</p>
                      )}
                      <div className="flex items-center mt-4">
                        <SparklesSolid className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">{profile?.spark_count || 0}</span> sparks received
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reflections */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">My Reflections</h3>
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {userReflections.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {userReflections.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>No reflections yet</p>
                    <p className="text-sm">Start reflecting in the Scenarios section</p>
                  </div>
                ) : (
                  userReflections.map((reflection) => (
                    <div key={reflection.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {reflection.scenario_title && (
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              {reflection.scenario_title}
                            </h4>
                          )}
                          <p className="text-sm text-gray-700 mb-2">{reflection.reflection_text}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{new Date(reflection.created_at).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">
                              {reflection.scenario_type === 'scenario' ? 'Practice Scenario' : reflection.scenario_type}
                            </span>
                          </div>
                        </div>
                        {reflection.scenario_type !== 'scenario' && (
                          <button
                            onClick={() => toggleReflectionVisibility(reflection.id, reflection.is_public)}
                            className="ml-4 p-1 text-gray-400 hover:text-gray-600"
                            title={reflection.is_public ? 'Make private' : 'Make public'}
                          >
                            {reflection.is_public ? (
                              <EyeIcon className="h-4 w-4" />
                            ) : (
                              <EyeSlashIcon className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Forum Posts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">My Forum Posts</h3>
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {userPosts.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {userPosts.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>No forum posts yet</p>
                    <p className="text-sm">Share your thoughts in the Forum</p>
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <div key={post.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{post.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{post.category}</span>
                            <span className="mx-2">•</span>
                            <span>{post.like_count || 0} likes</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="ml-4 p-1 text-gray-400 hover:text-red-600"
                          title="Delete post"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
