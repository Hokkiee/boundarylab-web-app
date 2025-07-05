import { useState, useEffect } from 'react'
import { announcementService } from '../services/announcementService'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  StarIcon, 
  EyeIcon, 
  EyeSlashIcon,
  MegaphoneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

function AdminAnnouncementPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'product',
    featured: false,
    published: true,
    author_name: '',
    tags: ''
  })

  useEffect(() => {
    checkAdminStatus()
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchAllAnnouncements()
    }
  }, [isAdmin])

  const checkAdminStatus = async () => {
    try {
      const adminStatus = await announcementService.isAdmin()
      setIsAdmin(adminStatus)
      
      if (!adminStatus) {
        setError('Access denied. Admin privileges required.')
      }
    } catch (err) {
      setError('Failed to verify admin status')
      console.error('Error checking admin status:', err)
    }
  }

  const fetchAllAnnouncements = async () => {
    setLoading(true)
    try {
      const { data, error } = await announcementService.getAllAnnouncements()
      
      if (error) {
        setError(error.message)
      } else {
        setAnnouncements(data || [])
      }
    } catch (err) {
      setError('Failed to load announcements')
      console.error('Error fetching announcements:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const announcementData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    try {
      if (editingAnnouncement) {
        await announcementService.updateAnnouncement(editingAnnouncement.id, announcementData)
      } else {
        await announcementService.createAnnouncement(announcementData)
      }
      
      setShowCreateForm(false)
      setEditingAnnouncement(null)
      setFormData({
        title: '',
        content: '',
        category: 'product',
        featured: false,
        published: true,
        author_name: '',
        tags: ''
      })
      
      await fetchAllAnnouncements()
    } catch (err) {
      setError('Failed to save announcement')
      console.error('Error saving announcement:', err)
    }
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      featured: announcement.featured,
      published: announcement.published,
      author_name: announcement.author_name,
      tags: announcement.tags?.join(', ') || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.deleteAnnouncement(id)
        await fetchAllAnnouncements()
      } catch (err) {
        setError('Failed to delete announcement')
        console.error('Error deleting announcement:', err)
      }
    }
  }

  const toggleFeatured = async (id, featured) => {
    try {
      await announcementService.toggleFeatured(id, !featured)
      await fetchAllAnnouncements()
    } catch (err) {
      setError('Failed to update featured status')
      console.error('Error toggling featured:', err)
    }
  }

  const togglePublished = async (id, published) => {
    try {
      await announcementService.togglePublished(id, !published)
      await fetchAllAnnouncements()
    } catch (err) {
      setError('Failed to update published status')
      console.error('Error toggling published:', err)
    }
  }

  const categories = [
    { id: 'product', name: 'Product' },
    { id: 'features', name: 'Features' },
    { id: 'community', name: 'Community' },
    { id: 'content', name: 'Content' },
    { id: 'technical', name: 'Technical' },
    { id: 'upcoming', name: 'Upcoming' }
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Announcement Management</h1>
              <p className="text-gray-600 mt-2">Create and manage announcements for your users</p>
            </div>
            <button
              onClick={() => {
                setShowCreateForm(true)
                setEditingAnnouncement(null)
                setFormData({
                  title: '',
                  content: '',
                  category: 'product',
                  featured: false,
                  published: true,
                  author_name: '',
                  tags: ''
                })
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Announcement</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="BoundaryLab Team"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Launch, Beta, Features"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Published</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {editingAnnouncement ? 'Update' : 'Create'} Announcement
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingAnnouncement(null)
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Announcements List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Announcements</h3>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <MegaphoneIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
              <p className="text-gray-600">Create your first announcement to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {announcement.title}
                        </h4>
                        {announcement.featured && (
                          <StarIcon className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {announcement.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {announcement.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>By {announcement.author_name}</span>
                        <span>{formatDate(announcement.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleFeatured(announcement.id, announcement.featured)}
                        className={`p-2 rounded-lg transition-colors ${
                          announcement.featured 
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={announcement.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <StarIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => togglePublished(announcement.id, announcement.published)}
                        className={`p-2 rounded-lg transition-colors ${
                          announcement.published 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={announcement.published ? 'Unpublish' : 'Publish'}
                      >
                        {announcement.published ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminAnnouncementPage
