import { useState, useEffect } from 'react'
import { 
  XMarkIcon, 
  SparklesIcon,
  UserIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { SparklesIcon as SparklesSolid } from '@heroicons/react/24/solid'
import { profileService, sparkService, forumService } from '../services/api'
import { supabase } from '../services/supabase'
import { useNotifications } from '../contexts/NotificationContext'

function ProfileModal({ userId, isOpen, onClose, currentUser }) {
  console.log('ProfileModal render - props:', { userId, isOpen, currentUser: !!currentUser })
  
  const [profile, setProfile] = useState(null)
  const [publicReflections, setPublicReflections] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sparkSent, setSparkSent] = useState(false)
  const [sendingSpark, setSendingSpark] = useState(false)
  const { createSparkNotification } = useNotifications()

  useEffect(() => {
    console.log('ProfileModal useEffect - isOpen:', isOpen, 'userId:', userId)
    if (isOpen && userId) {
      loadUserProfile()
    }
  }, [isOpen, userId])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      
      // Check if this is a demo user (demo-user-1, demo-user-2, etc.)
      if (userId && userId.startsWith('demo-user-')) {
        // Handle demo mode with sample data
        const demoProfiles = {
          'demo-user-1': {
            id: 'demo-user-1',
            display_name: 'Sarah M.',
            avatar_url: null,
            profile_picture_url: null,
            bio: 'Learning to set healthy boundaries one day at a time.',
            job_title: 'Marketing Coordinator',
            motto: 'Your boundaries are your responsibility.',
            spark_count: 15
          },
          'demo-user-2': {
            id: 'demo-user-2',
            display_name: 'Alex Chen',
            avatar_url: null,
            profile_picture_url: null,
            bio: 'Software developer who believes in work-life balance.',
            job_title: 'Senior Software Engineer',
            motto: 'Work to live, don\'t live to work.',
            spark_count: 28
          }
        }
        
        const demoProfile = demoProfiles[userId]
        if (demoProfile) {
          setProfile(demoProfile)
          setPublicReflections([
            {
              id: 'demo-reflection-1',
              reflection: 'This scenario really helped me understand the importance of being direct but kind when setting boundaries.',
              completed_at: new Date().toISOString(),
              scenarios: { title: 'Workplace Boundary Setting' }
            }
          ])
          setUserPosts([])
        }
      } else {
        // Handle real database mode
        // Load user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        setProfile(profileData)

        // Load public reflections
        try {
          const reflectionsData = await profileService.getPublicReflections(userId)
          setPublicReflections(reflectionsData || [])
        } catch (reflectionError) {
          console.error('Error loading reflections:', reflectionError)
          setPublicReflections([])
        }

        // Load user's forum posts
        try {
          const allPosts = await forumService.getAllPosts()
          const myPosts = allPosts.filter(post => post.author_id === userId)
          setUserPosts(myPosts.slice(0, 3)) // Show only recent 3 posts
        } catch (postsError) {
          console.error('Error loading user posts:', postsError)
          setUserPosts([])
        }
      }
      
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendSpark = async () => {
    if (!currentUser || sparkSent) return
    
    try {
      setSendingSpark(true)
      
      // Handle demo mode
      if (userId && userId.startsWith('demo-user-')) {
        // Simulate sending a spark in demo mode
        setTimeout(() => {
          setSparkSent(true)
          setProfile(prev => prev ? {...prev, spark_count: (prev.spark_count || 0) + 1} : null)
          setSendingSpark(false)
        }, 1000)
        return
      }
      
      // For real database mode, send spark for their most recent post
      const recentPost = userPosts[0]
      if (recentPost) {
        await sparkService.sendSpark(userId, recentPost.id)
        setSparkSent(true)
        
        // Update the profile spark count optimistically
        setProfile(prev => prev ? {...prev, spark_count: (prev.spark_count || 0) + 1} : null)
        
        // Create notification for the recipient
        const senderName = currentUser.email?.split('@')[0] || 'Someone'
        await createSparkNotification(userId, senderName, recentPost.title)
      }
    } catch (error) {
      console.error('Error sending spark:', error)
      if (error.message.includes('already sparked')) {
        setSparkSent(true)
      }
    } finally {
      setSendingSpark(false)
    }
  }

  if (!isOpen) {
    console.log('ProfileModal - not open, returning null')
    return null
  }

  console.log('ProfileModal - rendering modal, loading:', loading, 'profile:', !!profile)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header - More subtle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-medium text-gray-700">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
            <div className="text-gray-500">Loading profile...</div>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Profile Info - Less crowded */}
            <div className="bg-gray-50 p-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-md">
                  {profile?.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-10 w-10 text-white" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {profile?.display_name || 'Anonymous User'}
                </h3>
                
                {profile?.job_title && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                    <BriefcaseIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{profile.job_title}</span>
                  </div>
                )}

                {/* Spark Count - Simplified */}
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                    <SparklesSolid className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900">{profile?.spark_count || 0}</span>
                    <span className="text-sm text-gray-600">sparks</span>
                  </div>
                </div>

                {/* Send Spark Button - Better spacing */}
                {currentUser && currentUser.id !== userId && (
                  <div className="flex justify-center">
                    <button
                        onClick={handleSendSpark}
                        disabled={sparkSent || sendingSpark}
                        className={`inline-flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
                          sparkSent 
                            ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                            : 'bg-yellow-400 hover:bg-yellow-500 text-white hover:shadow-md'
                        }`}
                      >
                      {sparkSent ? (
                        <>
                          <SparklesSolid className="h-4 w-4 mr-2" />
                          Spark Sent ✨
                        </>
                      ) : sendingSpark ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-4 w-4 mr-2" />
                          Send a Spark
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Note when viewing own profile */}
                {currentUser && currentUser.id === userId && (
                  <div className="text-xs text-gray-500 mt-2">
                    This is your profile
                  </div>
                )}
              </div>
            </div>

            {/* Content Section - More readable spacing */}
            <div className="p-6 space-y-6">
              {/* Bio & Motto Section */}
              {(profile?.motto || profile?.bio) && (
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                  {profile?.motto && (
                    <blockquote className="text-gray-700 italic border-l-4 border-green-500 pl-4 mb-3 text-base">
                      "{profile.motto}"
                    </blockquote>
                  )}
                  {profile?.bio && (
                    <p className="text-gray-600 leading-relaxed text-sm">{profile.bio}</p>
                  )}
                </div>
              )}

              {/* Shared Reflections - Cleaner */}
              {publicReflections.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center mr-2">
                      <SparklesIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    Shared Reflections
                  </h4>
                  <div className="space-y-3">
                    {publicReflections.map((reflection) => (
                      <div key={reflection.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h5 className="font-medium text-gray-900 mb-2 text-sm">{reflection.scenarios?.title}</h5>
                        <p className="text-gray-700 leading-relaxed mb-2 text-sm">{reflection.reflection}</p>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {new Date(reflection.completed_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Posts - Cleaner */}
              {userPosts.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center mr-2">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-green-600" />
                    </div>
                    Recent Posts
                  </h4>
                  <div className="space-y-3">
                    {userPosts.map((post) => (
                      <div key={post.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-2 text-sm">{post.title}</h5>
                            <p className="text-gray-700 leading-relaxed mb-3 text-sm line-clamp-2">{post.content}</p>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                                {post.category}
                              </span>
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                {post.upvotes} upvotes
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State - Cleaner */}
              {publicReflections.length === 0 && userPosts.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">No Public Content</h3>
                  <p className="text-gray-500 text-sm">This user hasn't shared any public content yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileModal
