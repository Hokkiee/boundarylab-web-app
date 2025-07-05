import { useState } from 'react'
import { XMarkIcon, ChatBubbleLeftRightIcon, ExclamationTriangleIcon, LightBulbIcon, HeartIcon } from '@heroicons/react/24/outline'

const feedbackTypes = [
  {
    id: 'bug',
    name: 'Bug Report',
    icon: ExclamationTriangleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Report an issue or something that\'s not working'
  },
  {
    id: 'feature',
    name: 'Feature Request',
    icon: LightBulbIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: 'Suggest a new feature or improvement'
  },
  {
    id: 'general',
    name: 'General Feedback',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Share your thoughts or suggestions'
  },
  {
    id: 'appreciation',
    name: 'Appreciation',
    icon: HeartIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Share what you love about the app'
  }
]

function FeedbackModal({ isOpen, onClose, user }) {
  const [selectedType, setSelectedType] = useState('')
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState(user?.email || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedType || !feedback.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would typically send the feedback to your backend
      // For now, we'll just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Log the feedback for now (in a real app, this would go to your backend)
      console.log('Feedback submitted:', {
        type: selectedType,
        feedback: feedback.trim(),
        email: email.trim(),
        userId: user?.id,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })

      setIsSubmitted(true)
      
      // Reset form after showing success message
      setTimeout(() => {
        setSelectedType('')
        setFeedback('')
        setEmail(user?.email || '')
        setIsSubmitted(false)
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Sorry, there was an error submitting your feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedType('')
      setFeedback('')
      setEmail(user?.email || '')
      setIsSubmitted(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-accent-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Share Your Feedback</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of feedback would you like to share?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded-lg border-2 transition-colors text-left ${
                        selectedType === type.id
                          ? `${type.borderColor} ${type.bgColor}`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <type.icon className={`h-4 w-4 ${selectedType === type.id ? type.color : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${selectedType === type.id ? type.color : 'text-gray-700'}`}>
                          {type.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Your feedback
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-300 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-300 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll only use this to follow up on your feedback if needed
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedType || !feedback.trim()}
                  className="flex-1 bg-accent-300 hover:bg-accent-400 text-black px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thank you for your feedback!
              </h3>
              <p className="text-gray-600">
                We appreciate you taking the time to help us improve BoundaryLab.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
