import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  TrophyIcon, 
  InformationCircleIcon,
  EyeIcon 
} from '@heroicons/react/24/solid'

function NotificationToast({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Show animation
    const timer = setTimeout(() => setIsVisible(true), 50)
    
    // Auto-dismiss after 6 seconds
    const dismissTimer = setTimeout(() => {
      handleClose()
    }, 6000)

    return () => {
      clearTimeout(timer)
      clearTimeout(dismissTimer)
    }
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'spark':
        return <SparklesIcon className="h-6 w-6 text-yellow-500" />
      case 'forum_reply':
        return <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500" />
      case 'achievement':
        return <TrophyIcon className="h-6 w-6 text-green-500" />
      case 'profile_view':
        return <EyeIcon className="h-6 w-6 text-purple-500" />
      default:
        return <InformationCircleIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case 'spark':
        return 'bg-yellow-50 border-yellow-200'
      case 'forum_reply':
        return 'bg-blue-50 border-blue-200'
      case 'achievement':
        return 'bg-green-50 border-green-200'
      case 'profile_view':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div
      className={`
        w-full max-w-sm
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
      `}
    >
      <div className={`
        ${getBgColor()} 
        rounded-xl border shadow-lg p-4
        backdrop-blur-sm hover:shadow-xl transition-shadow
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1.5">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {notification.message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-white/80"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationToast
