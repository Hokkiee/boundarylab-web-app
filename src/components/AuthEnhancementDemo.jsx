// Demo component to showcase the enhanced auth design
import React from 'react'
import { Link } from 'react-router-dom'

const AuthEnhancementDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-white to-accent-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Authentication Design
          </h1>
          <p className="text-lg text-gray-600">
            Modern, engaging login and registration experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Features List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ New Features</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Beautiful Visual Design</h3>
                  <p className="text-sm text-gray-600">Gradient backgrounds, glass morphism effects, and floating animations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Enhanced UX</h3>
                  <p className="text-sm text-gray-600">Password visibility toggles, input icons, and smooth transitions</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Password Strength Indicator</h3>
                  <p className="text-sm text-gray-600">Real-time feedback on password security with visual indicators</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Validation</h3>
                  <p className="text-sm text-gray-600">Inline validation with helpful error messages and animations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Loading States</h3>
                  <p className="text-sm text-gray-600">Engaging loading animations and button states</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Social Login Ready</h3>
                  <p className="text-sm text-gray-600">Placeholder buttons for future Google/social authentication</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Brand Consistency</h3>
                  <p className="text-sm text-gray-600">Aligned with BoundaryLab's color palette and typography</p>
                </div>
              </div>
            </div>
          </div>

          {/* Try It Out */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Try It Out</h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Experience the enhanced authentication flow
                </p>
                
                <div className="space-y-4">
                  <Link 
                    to="/login"
                    className="block w-full bg-gradient-to-r from-primary-500 to-accent-300 hover:from-primary-600 hover:to-accent-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    View Enhanced Login
                  </Link>
                  
                  <Link 
                    to="/register"
                    className="block w-full bg-gradient-to-r from-accent-300 to-primary-500 hover:from-accent-400 hover:to-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    View Enhanced Registration
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Design Highlights:</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Animated gradient backgrounds</li>
                  <li>• Glass morphism card effects</li>
                  <li>• Floating logo with glow effect</li>
                  <li>• Password strength visualization</li>
                  <li>• Shake animation for errors</li>
                  <li>• Smooth success transitions</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔧 Technical Implementation</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Visual Enhancements</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CSS gradient backgrounds</li>
                <li>• Backdrop blur effects</li>
                <li>• Custom animations</li>
                <li>• Heroicons integration</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">UX Improvements</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time validation</li>
                <li>• Password visibility toggle</li>
                <li>• Loading state management</li>
                <li>• Error handling animations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Code Quality</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Accessible form design</li>
                <li>• Responsive layout</li>
                <li>• Performance optimized</li>
                <li>• Maintainable CSS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthEnhancementDemo
