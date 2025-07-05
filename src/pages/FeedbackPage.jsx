import { useState } from 'react'
import { ChatBubbleLeftRightIcon, ExclamationTriangleIcon, LightBulbIcon, HeartIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Sidebar from '../components/Sidebar'
import MobileNavigation from '../components/MobileNavigation'
import MobileSidebar from '../components/MobileSidebar'
import { feedbackService } from '../services/feedbackService'

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

function FeedbackPage({ user }) {
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
      // Submit feedback to database
      await feedbackService.submitFeedback({
        userId: user?.id,
        type: selectedType,
        feedback: feedback.trim(),
        email: email.trim() || null
      })

      setIsSubmitted(true)
      
      // Reset form after showing success message
      setTimeout(() => {
        setSelectedType('')
        setFeedback('')
        setEmail(user?.email || '')
        setIsSubmitted(false)
      }, 3000)
      
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Sorry, there was an error submitting your feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation user={user}>
        {(handleNavigation) => <MobileSidebar user={user} onNavigate={handleNavigation} />}
      </MobileNavigation>
      <Sidebar user={user} />

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-accent-600" />
              <h1 className="text-3xl font-bold text-gray-900">Share Your Feedback</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl">
              Your thoughts and suggestions help us improve BoundaryLab. Whether you've found a bug, have an idea for a new feature, or just want to share your experience, we'd love to hear from you.
            </p>
          </div>

          {!isSubmitted ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Feedback Type Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    What type of feedback would you like to share?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-lg border-2 transition-colors text-left ${
                          selectedType === type.id
                            ? `${type.borderColor} ${type.bgColor}`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <type.icon className={`h-6 w-6 ${selectedType === type.id ? type.color : 'text-gray-400'}`} />
                          <span className={`text-base font-medium ${selectedType === type.id ? type.color : 'text-gray-700'}`}>
                            {type.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Content */}
                <div>
                  <label htmlFor="feedback" className="block text-lg font-semibold text-gray-900 mb-3">
                    Tell us more
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts, describe the issue, or tell us about your idea..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-300 focus:border-transparent resize-none text-gray-900"
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Be as detailed as you'd like. The more context you provide, the better we can understand and address your feedback.
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-lg font-semibold text-gray-900 mb-3">
                    Contact email (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-300 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    We'll only use this to follow up on your feedback if needed. You can also leave this blank if you prefer.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedType || !feedback.trim()}
                    className="px-8 py-3 bg-accent-300 hover:bg-accent-400 text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Feedback</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Success Message */
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Thank you for your feedback!
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  We appreciate you taking the time to help us improve BoundaryLab. Your input helps us create a better experience for everyone.
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    We review all feedback carefully and will follow up if we need more information.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 bg-accent-300 hover:bg-accent-400 text-black rounded-lg font-medium transition-colors"
                  >
                    Submit More Feedback
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
            <div className="space-y-2 text-blue-800">
              <p>• We review all feedback within 2-3 business days</p>
              <p>• Bug reports are prioritized and addressed quickly</p>
              <p>• Feature requests are considered for future updates</p>
              <p>• We may reach out for clarification if needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage
