import { useState, useEffect, useRef } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  PlusIcon,
  HeartIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import Sidebar from '../components/Sidebar'
import MobileNavigation from '../components/MobileNavigation'
import MobileSidebar from '../components/MobileSidebar'
import ProfileModal from '../components/ProfileModal'
import { forumService } from '../services/api'
import { isSupabaseConfigured, supabase } from '../services/supabase'

function ForumPage({ user }) {
  const [posts, setPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showReplies, setShowReplies] = useState({}) // Track which posts have replies visible
  const [postComments, setPostComments] = useState({}) // Store comments for each post
  const [loadingComments, setLoadingComments] = useState({}) // Track loading state for comments
  const [showShareMenu, setShowShareMenu] = useState({}) // Track which posts have share menu visible
  const [notification, setNotification] = useState(null) // For showing copy notifications
  const [selectedPost, setSelectedPost] = useState(null) // For showing post modal
  const [showPostModal, setShowPostModal] = useState(false) // Track post modal visibility

  const categories = [
    { id: 'all', name: 'All Posts', color: 'gray' },
    { id: 'support', name: 'Support', color: 'blue' },
    { id: 'workplace', name: 'Workplace', color: 'purple' },
    { id: 'celebration', name: 'Celebrations', color: 'green' },
    { id: 'general', name: 'General', color: 'gray' }
  ]

  useEffect(() => {
    loadPosts()
  }, [])

  // Check for URL parameters to open specific post
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const postId = urlParams.get('post')
    
    if (postId && posts.length > 0) {
      const post = posts.find(p => p.id === postId)
      if (post) {
        handleOpenPostModal(post)
      }
    }
  }, [posts])

  // Refresh posts when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadPosts()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Also refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      loadPosts()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      console.log('🔍 Loading posts...')
      const data = await forumService.getAllPosts()
      console.log('📊 Posts loaded:', data?.length || 0)
      if (data && data.length > 0) {
        setPosts(data)
        setIsDemoMode(false)
        console.log('✅ Using real posts from database')
      } else {
        console.log('⚠️ No posts from database - using sample data for demo')
        setPosts(getSamplePosts())
        setIsDemoMode(true)
      }
    } catch (error) {
      console.error('❌ Error loading posts:', error)
      console.log('🎯 Using sample data for demo')
      setPosts(getSamplePosts())
      setIsDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  // Sample data for demo
  const getSamplePosts = () => [
    {
      id: '1',
      title: 'How do you handle guilt after setting boundaries?',
      content: 'I finally told my friend I couldn\'t be their free therapist anymore, but I feel so guilty. They\'re going through a hard time and I feel like I\'m abandoning them. How do you deal with the guilt that comes after setting a necessary boundary?',
      category: 'support',
      is_anonymous: false,
      author_id: 'demo-user-1',
      created_at: new Date().toISOString(),
      upvotes: 12,
      isLiked: false,
      images: [],
      profiles: {
        id: 'demo-user-1',
        display_name: 'Sarah M.',
        avatar_url: null,
        profile_picture_url: null,
        bio: 'Learning to set healthy boundaries one day at a time.',
        job_title: 'Marketing Coordinator',
        motto: 'Your boundaries are your responsibility.',
        spark_count: 15
      }
    },
    {
      id: '2', 
      title: 'Workplace boundaries during remote work',
      content: 'My boss expects me to be available 24/7 just because I work from home. They send messages at all hours and get annoyed if I don\'t respond immediately. How do I set boundaries without seeming unprofessional?',
      category: 'workplace',
      is_anonymous: true,
      author_id: null,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      upvotes: 8,
      isLiked: false,
      images: [],
      profiles: null
    },
    {
      id: '3',
      title: 'Small victory: I said no to overtime!',
      content: 'For the first time in months, I told my manager I couldn\'t work overtime this weekend because I had plans. They weren\'t happy but they found someone else. I\'m proud of myself for prioritizing my personal time!',
      category: 'celebration',
      is_anonymous: false,
      author_id: 'demo-user-2',
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      upvotes: 25,
      isLiked: true,
      images: [],
      profiles: {
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
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  const handleProfileClick = (userId) => {
    console.log('Profile click - userId:', userId)
    console.log('Profile click - isDemoMode:', isDemoMode)
    if (userId) {
      console.log('Setting selectedProfileUserId:', userId)
      setSelectedProfileUserId(userId)
      setShowProfileModal(true)
      console.log('Profile modal should be showing now')
    }
  }

  const handleLikePost = async (postId, isCurrentlyLiked) => {
    if (isDemoMode) {
      // In demo mode, just update the local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: !isCurrentlyLiked,
                upvotes: isCurrentlyLiked ? (post.upvotes || 1) - 1 : (post.upvotes || 0) + 1
              }
            : post
        )
      )
      return
    }

    try {
      if (isCurrentlyLiked) {
        await forumService.unlikePost(postId)
      } else {
        await forumService.likePost(postId)
      }
      
      // Update the local state optimistically
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: !isCurrentlyLiked,
                upvotes: isCurrentlyLiked ? (post.upvotes || 1) - 1 : (post.upvotes || 0) + 1
              }
            : post
        )
      )
    } catch (error) {
      console.error('Error toggling like:', error)
      // Only show error if it's not about already liking/unliking
      if (!error.message.includes('already liked')) {
        alert(`Failed to ${isCurrentlyLiked ? 'unlike' : 'like'} post: ${error.message}`)
      }
    }
  }

  const handleToggleReplies = async (postId) => {
    const isCurrentlyShowing = showReplies[postId]
    
    if (isCurrentlyShowing) {
      // Hide replies
      setShowReplies(prev => ({ ...prev, [postId]: false }))
    } else {
      // Show replies and load comments if not already loaded
      setShowReplies(prev => ({ ...prev, [postId]: true }))
      
      if (!postComments[postId]) {
        await loadCommentsForPost(postId)
      }
    }
  }

  const loadCommentsForPost = async (postId) => {
    if (isDemoMode) {
      // In demo mode, show sample comments
      setPostComments(prev => ({
        ...prev,
        [postId]: getSampleComments(postId)
      }))
      return
    }

    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }))
      const comments = await forumService.getPostComments(postId)
      setPostComments(prev => ({ ...prev, [postId]: comments }))
    } catch (error) {
      console.error('Error loading comments:', error)
      setPostComments(prev => ({ ...prev, [postId]: [] }))
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }))
    }
  }

  const handleCreateComment = async (postId, content, isAnonymous = false) => {
    if (isDemoMode) {
      // In demo mode, add a sample comment using current user data if available
      const newComment = {
        id: Date.now().toString(),
        content,
        author_id: user?.id || 'demo-user',
        is_anonymous: isAnonymous,
        created_at: new Date().toISOString(),
        profiles: isAnonymous ? null : {
          display_name: user?.email?.split('@')[0] || user?.user_metadata?.display_name || 'Demo User',
          avatar_url: user?.user_metadata?.avatar_url || null,
          profile_picture_url: user?.user_metadata?.profile_picture_url || null
        }
      }
      
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }))
      return
    }

    try {
      const newComment = await forumService.createComment(postId, content, isAnonymous)
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }))
    } catch (error) {
      console.error('Error creating comment:', error)
      alert(`Failed to create comment: ${error.message}`)
    }
  }

  const getSampleComments = (postId) => {
    // Return sample comments based on post ID
    const sampleComments = {
      '1': [
        {
          id: 'c1',
          content: 'I totally understand this feeling! The guilt can be overwhelming, but remember that setting boundaries is an act of self-care, not selfishness.',
          author_id: 'user1',
          is_anonymous: false,
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          profiles: {
            display_name: 'Maya R.',
            avatar_url: null,
            profile_picture_url: null
          }
        },
        {
          id: 'c2',
          content: 'What helped me was reminding myself that I can\'t help others effectively if I\'m burnt out. You\'re not abandoning your friend, you\'re taking care of yourself so you can be a better friend.',
          author_id: 'user2',
          is_anonymous: true,
          created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          profiles: null
        }
      ],
      '3': [
        {
          id: 'c3',
          content: 'Congratulations! That\'s a huge step. The first time saying no is always the hardest.',
          author_id: 'user3',
          is_anonymous: false,
          created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          profiles: {
            display_name: 'Jordan K.',
            avatar_url: null,
            profile_picture_url: null
          }
        }
      ]
    }
    
    return sampleComments[postId] || []
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const getCategoryColor = (category) => {
    const categoryInfo = categories.find(cat => cat.id === category)
    const color = categoryInfo?.color || 'gray'
    
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800', 
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800'
    }
    
    return colors[color] || colors.gray
  }

  const handleToggleShareMenu = (postId) => {
    setShowShareMenu(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const handleCopyLink = async (postId) => {
    const postUrl = `${window.location.origin}/forum?post=${postId}`
    try {
      await navigator.clipboard.writeText(postUrl)
      showNotification('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = postUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      showNotification('Link copied to clipboard!')
    }
    setShowShareMenu(prev => ({ ...prev, [postId]: false }))
  }

  const handleCopyContent = async (post) => {
    const content = `${post.title}\n\n${post.content}\n\n- Shared from BoundaryLab Forum`
    try {
      await navigator.clipboard.writeText(content)
      showNotification('Post content copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy content:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = content
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      showNotification('Post content copied to clipboard!')
    }
    setShowShareMenu(prev => ({ ...prev, [post.id]: false }))
  }

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleOpenPostModal = async (post) => {
    setSelectedPost(post)
    setShowPostModal(true)
    
    // Load comments for this post if not already loaded
    if (!postComments[post.id]) {
      await loadCommentsForPost(post.id)
    }
  }

  const handleClosePostModal = () => {
    setSelectedPost(null)
    setShowPostModal(false)
  }

  // Function to truncate content for preview
  const truncateContent = (content, maxLength = 300) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // Check if content needs truncation
  const shouldTruncate = (content) => content.length > 300

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.share-menu-container')) {
        setShowShareMenu({})
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileNavigation user={user}>
          {(handleNavigation) => <MobileSidebar user={user} onNavigate={handleNavigation} />}
        </MobileNavigation>
        <Sidebar user={user} />
        <div className="lg:pl-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        userId={selectedProfileUserId}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={user}
      />
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
          
          {!showCreatePost ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
                  </div>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>New Post</span>
                  </button>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl">
                  Connect with others on their boundary journey. Share experiences, ask questions, 
                  and learn from a supportive community.
                </p>
              </div>

              {/* Demo Mode Banner */}
              {isDemoMode && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">Demo Mode</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        You're viewing sample forum posts. To see and create real posts, set up your Supabase database 
                        and add your credentials to a <code className="bg-amber-100 px-1 rounded">.env</code> file.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => !post.is_anonymous && handleProfileClick(post.author_id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 ${
                            !post.is_anonymous ? 'hover:ring-2 hover:ring-green-500 cursor-pointer' : 'cursor-default'
                          } transition-all`}
                          disabled={post.is_anonymous}
                        >
                          {post.is_anonymous ? (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                          ) : post.profiles?.profile_picture_url || post.profiles?.avatar_url ? (
                            <img
                              src={post.profiles.profile_picture_url || post.profiles.avatar_url}
                              alt="Profile"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {post.profiles?.display_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          )}
                        </button>
                        <div>
                          <button
                            onClick={() => !post.is_anonymous && handleProfileClick(post.author_id)}
                            className={`font-medium text-gray-900 ${
                              !post.is_anonymous ? 'hover:text-green-600 cursor-pointer' : 'cursor-default'
                            }`}
                            disabled={post.is_anonymous}
                          >
                            {post.is_anonymous ? 'Anonymous' : (post.profiles?.display_name || 'Community Member')}
                          </button>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatTimeAgo(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {categories.find(cat => cat.id === post.category)?.name || post.category}
                      </span>
                    </div>

                    {/* Post Content */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {post.title}
                    </h3>
                    <div className="text-gray-700 leading-relaxed mb-4">
                      <p>
                        {shouldTruncate(post.content) ? truncateContent(post.content) : post.content}
                      </p>
                      {shouldTruncate(post.content) && (
                        <button
                          onClick={() => handleOpenPostModal(post)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm mt-2 inline-flex items-center"
                        >
                          Read more
                          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="mb-4">
                        <div className={`grid gap-2 ${
                          post.images.length === 1 ? 'grid-cols-1' : 
                          post.images.length === 2 ? 'grid-cols-2' : 
                          'grid-cols-2 md:grid-cols-3'
                        }`}>
                          {post.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(image, '_blank')}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleLikePost(post.id, post.isLiked)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.isLiked 
                            ? 'text-red-500' 
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        {post.isLiked ? (
                          <HeartSolid className="h-5 w-5" />
                        ) : (
                          <HeartIcon className="h-5 w-5" />
                        )}
                        <span className="text-sm">{post.upvotes || 0}</span>
                      </button>
                      <button 
                        onClick={() => handleToggleReplies(post.id)}
                        className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        <span>
                          {showReplies[post.id] ? 'Hide Replies' : 'View Replies'}
                          {(postComments[post.id] || []).length > 0 && (
                            <span className="ml-1 text-xs text-gray-400">
                              ({(postComments[post.id] || []).length})
                            </span>
                          )}
                        </span>
                      </button>
                      <div className="relative share-menu-container">
                        <button 
                          onClick={() => handleToggleShareMenu(post.id)}
                          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <ShareIcon className="h-5 w-5" />
                          <span>Share</span>
                        </button>
                        
                        {/* Share Menu */}
                        {showShareMenu[post.id] && (
                          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleCopyLink(post.id)}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <LinkIcon className="h-4 w-4" />
                              <span>Copy Link</span>
                            </button>
                            <button
                              onClick={() => handleCopyContent(post)}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <ClipboardDocumentIcon className="h-4 w-4" />
                              <span>Copy Content</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Replies (Comments) */}
                    {showReplies[post.id] && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        {/* Comments Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Replies {(postComments[post.id] || []).length > 0 && (
                              <span className="text-gray-500 font-normal">
                                ({(postComments[post.id] || []).length})
                              </span>
                            )}
                          </h4>
                        </div>

                        {/* New Comment Form */}
                        <div className="mb-6 bg-gray-50 rounded-lg p-4">
                          <CreateCommentForm 
                            onSubmit={(content, isAnonymous) => handleCreateComment(post.id, content, isAnonymous)}
                            isDemoMode={isDemoMode}
                          />
                        </div>

                        {/* Existing Comments */}
                        {loadingComments[post.id] ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                          </div>
                        ) : (postComments[post.id] || []).length === 0 ? (
                          <div className="text-center py-8">
                            <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No replies yet. Be the first to reply!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {(postComments[post.id] || []).map(comment => (
                              <div key={comment.id} className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-gray-100">
                                {/* Commenter Avatar */}
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 flex-shrink-0">
                                  {comment.is_anonymous ? (
                                    <UserIcon className="h-5 w-5 text-gray-500" />
                                  ) : comment.profiles?.avatar_url || comment.profiles?.profile_picture_url ? (
                                    <img
                                      src={comment.profiles.avatar_url || comment.profiles.profile_picture_url}
                                      alt="Avatar"
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                      <span className="text-white font-medium text-xs">
                                        {comment.profiles?.display_name?.charAt(0) || 'U'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Comment Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-gray-900">
                                        {comment.is_anonymous ? 'Anonymous' : comment.profiles?.display_name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatTimeAgo(comment.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No posts found in this category.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <CreatePostForm 
              onCancel={() => setShowCreatePost(false)}
              onSubmit={() => {
                setShowCreatePost(false)
                loadPosts()
              }}
              categories={categories.filter(cat => cat.id !== 'all')}
              isDemoMode={isDemoMode}
            />
          )}
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && selectedPost && (
        <PostModal 
          post={selectedPost}
          comments={postComments[selectedPost.id] || []}
          loadingComments={loadingComments[selectedPost.id]}
          onClose={handleClosePostModal}
          onCreateComment={(content, isAnonymous) => handleCreateComment(selectedPost.id, content, isAnonymous)}
          onLikePost={(isCurrentlyLiked) => handleLikePost(selectedPost.id, isCurrentlyLiked)}
          onSharePost={() => handleToggleShareMenu(selectedPost.id)}
          showShareMenu={showShareMenu[selectedPost.id]}
          onCopyLink={() => handleCopyLink(selectedPost.id)}
          onCopyContent={() => handleCopyContent(selectedPost)}
          formatTimeAgo={formatTimeAgo}
          getCategoryColor={getCategoryColor}
          categories={categories}
          isDemoMode={isDemoMode}
          user={user}
          handleProfileClick={handleProfileClick}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          userId={selectedProfileUserId}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={user}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 max-w-xs w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-900">{notification}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// CreateCommentForm Component
function CreateCommentForm({ onSubmit, isDemoMode }) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  // Auto-focus when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      setLoading(true)
      await onSubmit(content, isAnonymous)
      setContent('')
      setIsAnonymous(false)
      // Re-focus after successful submission
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    } catch (error) {
      console.error('Error creating comment:', error)
      alert(`Failed to create comment: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Demo Mode Warning */}
      {isDemoMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-amber-700">
                Demo mode: Your reply won't be saved to a real database.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Content */}
        <div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your reply... (Ctrl+Enter to submit)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm placeholder-gray-500"
            required
          />
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="comment-anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="comment-anonymous" className="text-sm text-gray-600">
              Reply anonymously
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Posting...</span>
              </div>
            ) : (
              'Post Reply'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

// CreatePostForm Component
function CreatePostForm({ onCancel, onSubmit, categories, isDemoMode }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      setLoading(true)
      
      // Create post without images
      const newPost = await forumService.createPost(title, content, category, isAnonymous)
      console.log('✅ Post created successfully:', newPost)
      onSubmit()
    } catch (error) {
      console.error('❌ Error creating post:', error)
      alert(`Failed to create post: ${error.message}`)
      
      // If it's a demo mode or configuration error, show demo message
      if (error.message.includes('Demo mode') || error.message.includes('not configured')) {
        console.log('🎯 Demo mode - post creation simulated')
        setTimeout(() => {
          onSubmit()
        }, 1000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onCancel}
          className="mb-4 text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to forum
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-600 mt-2">Share your thoughts, ask questions, or celebrate your victories.</p>
      </div>

      {/* Demo Mode Warning */}
      {isDemoMode && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Demo Mode</h3>
              <p className="text-sm text-amber-700 mt-1">
                Post creation is simulated in demo mode. Your post won't be saved to a real database.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to discuss?"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, experiences, or questions..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Anonymous option */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Post anonymously
            </label>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// PostModal Component
function PostModal({ 
  post, 
  comments, 
  loadingComments, 
  onClose, 
  onCreateComment, 
  onLikePost, 
  onSharePost, 
  showShareMenu, 
  onCopyLink, 
  onCopyContent, 
  formatTimeAgo, 
  getCategoryColor, 
  categories, 
  isDemoMode, 
  user, 
  handleProfileClick 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Post Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => !post.is_anonymous && handleProfileClick(post.author_id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 ${
                    !post.is_anonymous ? 'hover:ring-2 hover:ring-green-500 cursor-pointer' : 'cursor-default'
                  } transition-all`}
                  disabled={post.is_anonymous}
                >
                  {post.is_anonymous ? (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  ) : post.profiles?.profile_picture_url || post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.profile_picture_url || post.profiles.avatar_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {post.profiles?.display_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </button>
                <div>
                  <button
                    onClick={() => !post.is_anonymous && handleProfileClick(post.author_id)}
                    className={`font-medium text-gray-900 ${
                      !post.is_anonymous ? 'hover:text-green-600 cursor-pointer' : 'cursor-default'
                    }`}
                    disabled={post.is_anonymous}
                  >
                    {post.is_anonymous ? 'Anonymous' : (post.profiles?.display_name || 'Community Member')}
                  </button>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatTimeAgo(post.created_at)}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                {categories.find(cat => cat.id === post.category)?.name || post.category}
              </span>
            </div>

            {/* Post Content */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {post.title}
            </h3>
            <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {post.content}
            </div>
            
            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-6">
                <div className={`grid gap-3 ${
                  post.images.length === 1 ? 'grid-cols-1' : 
                  post.images.length === 2 ? 'grid-cols-2' : 
                  'grid-cols-2 md:grid-cols-3'
                }`}>
                  {post.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(image, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center space-x-4 py-4 border-t border-b border-gray-100">
              <button 
                onClick={() => onLikePost(post.isLiked)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.isLiked 
                    ? 'text-red-500' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                {post.isLiked ? (
                  <HeartSolid className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span className="text-sm">{post.upvotes || 0}</span>
              </button>
              <span className="flex items-center space-x-2 text-sm text-gray-500">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span>
                  {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
                </span>
              </span>
              <div className="relative share-menu-container">
                <button 
                  onClick={onSharePost}
                  className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
                
                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={onCopyLink}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={onCopyContent}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                      <span>Copy Content</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              {/* Comments Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Replies {comments.length > 0 && (
                    <span className="text-gray-500 font-normal">
                      ({comments.length})
                    </span>
                  )}
                </h4>
              </div>

              {/* New Comment Form */}
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <CreateCommentForm 
                  onSubmit={onCreateComment}
                  isDemoMode={isDemoMode}
                />
              </div>

              {/* Existing Comments */}
              {loadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No replies yet. Be the first to reply!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-gray-100">
                      {/* Commenter Avatar */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 flex-shrink-0">
                        {comment.is_anonymous ? (
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        ) : comment.profiles?.avatar_url || comment.profiles?.profile_picture_url ? (
                          <img
                            src={comment.profiles.avatar_url || comment.profiles.profile_picture_url}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-xs">
                              {comment.profiles?.display_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.is_anonymous ? 'Anonymous' : comment.profiles?.display_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(comment.created_at)}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumPage