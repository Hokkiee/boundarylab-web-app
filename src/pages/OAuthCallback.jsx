import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

function OAuthCallback() {
  const [status, setStatus] = useState('Processing authentication...')
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Processing authentication...')
        
        // Wait a moment for Supabase to process the callback
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check for session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Session error:', error)
          setStatus('Authentication error: ' + error.message)
          setTimeout(() => navigate('/login'), 3000)
          return
        }
        
        if (session?.user) {
          setStatus('Authentication successful! Redirecting...')
          setTimeout(() => navigate('/glossary'), 1000)
        } else {
          setStatus('No authentication session found. Redirecting to login...')
          setTimeout(() => navigate('/login'), 3000)
        }
      } catch (err) {
        console.error('❌ Callback error:', err)
        setStatus('Error processing authentication: ' + err.message)
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">{status}</p>
        <p className="text-gray-400 text-sm mt-2">
          Please wait while we complete your authentication...
        </p>
      </div>
    </div>
  )
}

export default OAuthCallback
