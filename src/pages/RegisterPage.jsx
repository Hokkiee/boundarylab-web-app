import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, CheckIcon } from '@heroicons/react/24/outline'
import LegalModal from '../components/LegalModal'

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showLegalModal, setShowLegalModal] = useState(false)
  const [legalModalContent, setLegalModalContent] = useState({ title: '', content: '' })
  const navigate = useNavigate()

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    strength = Object.values(checks).filter(Boolean).length
    return { strength, checks }
  }

  const passwordAnalysis = calculatePasswordStrength(password)
  const passwordStrengthColor = 
    passwordAnalysis.strength <= 2 ? 'bg-red-500' :
    passwordAnalysis.strength <= 3 ? 'bg-yellow-500' :
    passwordAnalysis.strength <= 4 ? 'bg-blue-500' : 'bg-green-500'

  const passwordStrengthText = 
    passwordAnalysis.strength <= 2 ? 'Weak' :
    passwordAnalysis.strength <= 3 ? 'Fair' :
    passwordAnalysis.strength <= 4 ? 'Good' : 'Strong'

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/glossary')
      }, 2000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLegalClick = (type) => {
    let title, content;
    switch(type) {
      case 'privacy':
        title = 'Privacy Policy';
        content = `
          <h3 class="text-lg font-semibold mb-4">Privacy Policy</h3>
          <p class="mb-4">Last updated: July 4, 2025</p>
          <h4 class="font-semibold mb-2">1. Information We Collect</h4>
          <p class="mb-4">We collect information you provide directly to us, such as when you create an account, participate in our community forum, or contact us for support.</p>
          <h4 class="font-semibold mb-2">2. How We Use Your Information</h4>
          <p class="mb-4">We use the information we collect to provide, maintain, and improve our services, including our boundary education tools and community features.</p>
          <h4 class="font-semibold mb-2">3. Information Sharing</h4>
          <p class="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information in certain limited circumstances as outlined in this policy.</p>
          <h4 class="font-semibold mb-2">4. Data Security</h4>
          <p class="mb-4">We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          <h4 class="font-semibold mb-2">5. Your Rights</h4>
          <p class="mb-4">You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.</p>
          <h4 class="font-semibold mb-2">6. Contact Us</h4>
          <p class="mb-4">If you have any questions about this Privacy Policy, please contact us at info.boundarylab@gmail.com</p>
        `;
        break;
      case 'terms':
        title = 'Terms & Conditions';
        content = `
          <h3 class="text-lg font-semibold mb-4">Terms & Conditions</h3>
          <p class="mb-4">Last updated: July 4, 2025</p>
          <h4 class="font-semibold mb-2">1. Acceptance of Terms</h4>
          <p class="mb-4">By accessing and using BoundaryLab, you accept and agree to be bound by the terms and provision of this agreement.</p>
          <h4 class="font-semibold mb-2">2. Description of Service</h4>
          <p class="mb-4">BoundaryLab is a platform designed to help young adults learn about personal boundaries through educational content, community discussions, and interactive scenarios.</p>
          <h4 class="font-semibold mb-2">3. User Responsibilities</h4>
          <p class="mb-4">Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
          <h4 class="font-semibold mb-2">4. Prohibited Uses</h4>
          <p class="mb-4">You may not use our service for any illegal purposes or to transmit any content that is harmful, threatening, abusive, or otherwise objectionable.</p>
          <h4 class="font-semibold mb-2">5. Content Guidelines</h4>
          <p class="mb-4">All content shared on our platform must be respectful, constructive, and aligned with our mission of creating a safe space for boundary education.</p>
          <h4 class="font-semibold mb-2">6. Limitation of Liability</h4>
          <p class="mb-4">BoundaryLab shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
          <h4 class="font-semibold mb-2">7. Contact Information</h4>
          <p class="mb-4">For questions about these Terms & Conditions, please contact us at info.boundarylab@gmail.com</p>
        `;
        break;
    }
    setLegalModalContent({ title, content });
    setShowLegalModal(true);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-primary via-white to-accent-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to BoundaryLab!</h3>
            <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
              <span className="text-sm text-gray-500">Redirecting to glossary...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-primary via-white to-accent-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative">
        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join BoundaryLab
            </h1>
            <p className="text-gray-600 mb-8">
              Start your journey to stronger boundaries
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl animate-shake">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-700 transition-colors" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-700 transition-colors" />
                    )}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Password strength:</span>
                      <span className={`text-sm font-semibold ${
                        passwordAnalysis.strength <= 2 ? 'text-red-500' :
                        passwordAnalysis.strength <= 3 ? 'text-yellow-500' :
                        passwordAnalysis.strength <= 4 ? 'text-blue-500' : 'text-green-500'
                      }`}>
                        {passwordStrengthText}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrengthColor}`}
                        style={{ width: `${(passwordAnalysis.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center ${passwordAnalysis.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckIcon className="h-3 w-3 mr-1" />
                        8+ characters
                      </div>
                      <div className={`flex items-center ${passwordAnalysis.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Lowercase
                      </div>
                      <div className={`flex items-center ${passwordAnalysis.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Uppercase
                      </div>
                      <div className={`flex items-center ${passwordAnalysis.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Number
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-700 transition-colors" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-700 transition-colors" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Create account button */}
            <div>
              <button
                type="submit"
                disabled={loading || (password && confirmPassword && password !== confirmPassword)}
                className="w-full bg-gradient-to-r from-primary-500 to-accent-300 hover:from-primary-600 hover:to-accent-400 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Google Auth button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-xl py-3 px-6 text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition-all duration-200 mb-2"
              disabled={loading}
              aria-label="Continue with Google"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.93 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.09c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.89 15.36 0 19.55 0 24c0 4.45.89 8.64 2.69 12.44l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.13 0 11.64-2.03 15.54-5.52l-7.19-5.6c-2.01 1.35-4.59 2.15-8.35 2.15-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              Continue with Google
            </button>

            {/* Terms and conditions */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <button type="button" className="text-primary-500 hover:text-primary-600 underline" onClick={() => handleLegalClick('terms')}>
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-primary-500 hover:text-primary-600 underline" onClick={() => handleLegalClick('privacy')}>
                  Privacy Policy
                </button>
              </p>
            </div>

            {/* Sign in link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-primary-500 hover:text-primary-600 transition-colors hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <LegalModal
        open={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        title={legalModalContent.title}
        content={legalModalContent.content}
      />
    </div>
  )
}

export default RegisterPage
