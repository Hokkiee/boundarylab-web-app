import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import logoHorizontal from '../assets/images/logos/logo-horizontal.svg'
import logoWhite from '../assets/images/logos/logo-white.svg'
import { 
  ChevronDownIcon, 
  StarIcon, 
  CheckCircleIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  CheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  MegaphoneIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

function LandingPage({ user }) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalContent, setAuthModalContent] = useState({ title: '', description: '', targetUrl: '' })
  const [showLegalModal, setShowLegalModal] = useState(false)
  const [legalModalContent, setLegalModalContent] = useState({ title: '', content: '' })
  const navigate = useNavigate()

  // Check if user is authenticated and redirect to app
  useEffect(() => {
    if (user) {
      console.log('User authenticated on landing page, redirecting to app...')
      navigate('/glossary')
    }
  }, [user, navigate])

  const handleProtectedLinkClick = (title, description, targetUrl) => {
    // Check if user is authenticated by checking for token or user session
    const isAuthenticated = localStorage.getItem('supabase.auth.token') || 
                          sessionStorage.getItem('supabase.auth.token');
    
    if (isAuthenticated) {
      window.location.href = targetUrl;
    } else {
      setAuthModalContent({ title, description, targetUrl });
      setShowAuthModal(true);
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
      case 'community':
        title = 'Community Guidelines';
        content = `
          <h3 class="text-lg font-semibold mb-4">Community Guidelines</h3>
          <p class="mb-4">Last updated: July 4, 2025</p>
          
          <h4 class="font-semibold mb-2">Our Mission</h4>
          <p class="mb-4">We're building a supportive community where young adults can learn, share, and grow together in understanding personal boundaries.</p>
          
          <h4 class="font-semibold mb-2">1. Be Respectful</h4>
          <p class="mb-4">Treat all community members with kindness and respect. We have zero tolerance for harassment, discrimination, or abusive behavior.</p>
          
          <h4 class="font-semibold mb-2">2. Keep It Safe</h4>
          <p class="mb-4">This is a safe space for sharing experiences. Do not share others' personal information without consent, and be mindful of privacy when sharing your own stories.</p>
          
          <h4 class="font-semibold mb-2">3. Stay On Topic</h4>
          <p class="mb-4">Keep discussions focused on boundary-related topics, personal growth, and supportive community interaction.</p>
          
          <h4 class="font-semibold mb-2">4. No Spam or Self-Promotion</h4>
          <p class="mb-4">Avoid posting repetitive content, spam, or promotional material unrelated to our community's mission.</p>
          
          <h4 class="font-semibold mb-2">5. Support, Don't Diagnose</h4>
          <p class="mb-4">While we encourage supportive discussion, please avoid giving medical or psychological advice. Encourage professional help when appropriate.</p>
          
          <h4 class="font-semibold mb-2">6. Report Concerns</h4>
          <p class="mb-4">If you encounter content or behavior that violates these guidelines, please report it to our moderation team.</p>
          
          <h4 class="font-semibold mb-2">7. Consequences</h4>
          <p class="mb-4">Violations of these guidelines may result in content removal, temporary suspension, or permanent ban from the community.</p>
          
          <h4 class="font-semibold mb-2">Questions?</h4>
          <p class="mb-4">Contact us at info.boundarylab@gmail.com if you have questions about these guidelines.</p>
        `;
        break;
    }
    
    setLegalModalContent({ title, content });
    setShowLegalModal(true);
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Landing Page Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={logoHorizontal} 
                alt="BoundaryLab" 
                className="h-8 w-auto"
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => {
                  document.getElementById('mission-section')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              >
                Mission
              </button>
              <button
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              >
                Features
              </button>
              <Link
                to="/announcements"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Announcements
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-2xl text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-2xl text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background-primary via-white to-[#f8ceb9]/30 pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#f8ceb9] rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-300 to-[#f8ceb9] rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="opacity-100">
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
              Where <span className="text-primary-600">shared stories</span> shaped meaningful{' '}
              <span className="text-primary-600">boundaries</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              Empowering young adults to identify, define, and reinforce personal boundaries 
              through real-life education, story-driven tools, and community-led learning.
            </p>
            
            {/* Modern CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary-500 to-[#f8ceb9] hover:from-primary-600 hover:to-[#f8ceb9]/80 text-white font-semibold py-3 px-6 rounded-2xl text-base transition-colors duration-300 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold py-3 px-6 rounded-2xl border border-gray-300 hover:border-primary-300 text-base transition-colors duration-300 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">Soft launching now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => {
            document.getElementById('mission-section')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-primary-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full p-2"
          aria-label="Scroll to mission section"
        >
          <ChevronDownIcon className="w-6 h-6" />
        </button>
      </section>

      {/* Mission Section */}
      <section id="mission-section" className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50 to-[#f8ceb9]/20 opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Our <span className="bg-gradient-to-r from-primary-500 to-[#f8ceb9] bg-clip-text text-transparent">Mission</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To empower young adults, starting with young women, to identify, define, and reinforce 
                their personal boundaries in response to subtle mistreatments often normalised in daily life.
              </p>
              
              {/* Mission Points */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    <ArrowRightIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-gray-700">Evidence-based tools and resources for boundary setting</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    <ArrowRightIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-gray-700">Safe community spaces for sharing and validation</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    <ArrowRightIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-gray-700">Real-world scenario practice and reflection</p>
                </div>
              </div>
            </div>

            {/* Creative Values Showcase */}
            <div className="lg:pl-12">                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 overflow-hidden relative">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500 to-[#f8ceb9]"></div>
                  <div className="absolute top-4 right-4 w-16 h-16 border-2 border-primary-300 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-[#f8ceb9] rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Our Values</h3>
                  
                  {/* Values Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Authenticity */}
                    <div className="p-4 bg-gradient-to-br from-primary-50 to-white rounded-xl hover:from-primary-100 hover:to-primary-50 transition-colors duration-300 cursor-pointer">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-500 hover:bg-primary-600 rounded-full mb-3 mx-auto transition-colors">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-center text-sm mb-1">Authenticity</h4>
                      <p className="text-gray-600 text-xs text-center leading-relaxed">Real stories, real growth</p>
                    </div>
                    
                    {/* Community */}
                    <div className="p-4 bg-gradient-to-br from-accent-50 to-white rounded-xl hover:from-accent-100 hover:to-accent-50 transition-colors duration-300 cursor-pointer">
                      <div className="flex items-center justify-center w-8 h-8 bg-accent-400 hover:bg-accent-500 rounded-full mb-3 mx-auto transition-colors">
                        <span className="text-white text-sm font-bold">C</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-center text-sm mb-1">Community</h4>
                      <p className="text-gray-600 text-xs text-center leading-relaxed">Learning together</p>
                    </div>
                    
                    {/* Empowerment */}
                    <div className="p-4 bg-gradient-to-br from-primary-50 to-white rounded-xl hover:from-primary-100 hover:to-primary-50 transition-colors duration-300 cursor-pointer">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-500 hover:bg-primary-600 rounded-full mb-3 mx-auto transition-colors">
                        <span className="text-white text-sm font-bold">E</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-center text-sm mb-1">Empowerment</h4>
                      <p className="text-gray-600 text-xs text-center leading-relaxed">Building confidence</p>
                    </div>
                    
                    {/* Safety */}
                    <div className="p-4 bg-gradient-to-br from-accent-50 to-white rounded-xl hover:from-accent-100 hover:to-accent-50 transition-colors duration-300 cursor-pointer">
                      <div className="flex items-center justify-center w-8 h-8 bg-accent-400 hover:bg-accent-500 rounded-full mb-3 mx-auto transition-colors">
                        <span className="text-white text-sm font-bold">S</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-center text-sm mb-1">Safety</h4>
                      <p className="text-gray-600 text-xs text-center leading-relaxed">Judgment-free space</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-16 bg-gradient-to-br from-white via-gray-50 to-[#f8ceb9]/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#f8ceb9]/60 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform <span className="bg-gradient-to-r from-primary-500 to-[#f8ceb9] bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover tools designed to help you understand and strengthen your boundaries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Boundary Glossary */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-500 hover:bg-primary-600 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
                <BookOpenIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Boundary Glossary</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn to articulate complex feelings and identify subtle mistreatments through our comprehensive dictionary.
              </p>
            </div>

            {/* Community Forum */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-accent-400 hover:bg-accent-500 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Community Forum</h3>
              <p className="text-gray-600 leading-relaxed">
                Share and validate experiences through community stories in a safe, supportive environment.
              </p>
            </div>

            {/* Real-Life Scenarios */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-500 hover:bg-primary-600 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300">
                <PlayIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Real-Life Scenarios</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive situations to practice how you'd respond and reflect on boundary-setting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Movement Section */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#f8ceb9]/60 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Be Part of <span className="bg-gradient-to-r from-primary-500 to-[#f8ceb9] bg-clip-text text-transparent">This</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us in creating a space where boundaries are understood, respected, and celebrated
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Your Voice Matters */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-accent-300 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-500 ml-2">Your Voice</span>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Share your experiences and help shape a platform that truly understands the complexities of boundary-setting in real life."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <MegaphoneIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Matters</div>
                  <div className="text-sm text-gray-500">Community Builder</div>
                </div>
              </div>
            </div>

            {/* Your Story */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-accent-300 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-500 ml-2">Your Story</span>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Every boundary challenge you've faced could be the validation someone else needs. Together, we're building a library of shared wisdom."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-400 rounded-full flex items-center justify-center">
                  <DocumentTextIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Empowers</div>
                  <div className="text-sm text-gray-500">Story Weaver</div>
                </div>
              </div>
            </div>

            {/* Your Growth */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-accent-300 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-500 ml-2">Your Growth</span>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "As you practice and strengthen your boundaries, you're not just growing—you're inspiring others to do the same. That's the ripple effect we're creating."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Inspires</div>
                  <div className="text-sm text-gray-500">Growth Catalyst</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-gray-100 to-[#f8ceb9]/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/50 to-gray-50/70 opacity-80"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#f8ceb9] rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Ready to Start Your
            <br />
            <span className="text-gray-700">Boundary Journey?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Join our community and begin building stronger, healthier boundaries today. 
            Your journey to empowerment starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-2xl text-base transition-colors duration-300 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-2xl text-base transition-colors duration-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-200"
            >
              Sign In
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span className="font-medium">Soft Launch Community</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-medium">Free to Join</span>
            </div>
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5" />
              <span className="font-medium">Growing Together</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#f8ceb9] rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <img 
                  src={logoWhite} 
                  alt="BoundaryLab" 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Building a community where young adults can learn, grow, and strengthen their boundaries together. 
                We're just getting started, and we'd love for you to be part of our journey.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/boundary.lab" 
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/boundary-lab/" 
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleProtectedLinkClick(
                      'Access Boundary Glossary',
                      'Our comprehensive glossary helps you articulate complex feelings and identify subtle mistreatments. Sign up to start exploring.',
                      '/glossary'
                    )}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Glossary
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleProtectedLinkClick(
                      'Join Community Forum',
                      'Connect with others, share experiences, and find validation in our safe community space. Create your account to participate.',
                      '/forum'
                    )}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Forum
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleProtectedLinkClick(
                      'Practice Real-Life Scenarios',
                      'Interactive boundary-setting practice scenarios to help you build confidence. Sign up to access these powerful tools.',
                      '/scenarios'
                    )}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Scenarios
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleLegalClick('privacy')}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLegalClick('terms')}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLegalClick('community')}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Community Guidelines
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2025 BoundaryLab. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Made with</span>
                <span className="text-red-400">❤</span>
                <span className="text-gray-400 text-sm">for stronger boundaries</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Required Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={() => setShowAuthModal(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                    {authModalContent.title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-4">
                      {authModalContent.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                <Link
                  to="/register"
                  className="w-full inline-flex justify-center rounded-2xl border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  onClick={() => setShowAuthModal(false)}
                >
                  Sign Up Free
                </Link>
                <Link
                  to="/login"
                  className="mt-3 w-full inline-flex justify-center rounded-2xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                  onClick={() => setShowAuthModal(false)}
                >
                  Sign In
                </Link>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={() => setShowLegalModal(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 max-h-[80vh]">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {legalModalContent.title}
                </h3>
                <button
                  onClick={() => setShowLegalModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="overflow-y-auto max-h-[60vh] pr-2">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: legalModalContent.content }}
                />
              </div>
              
              {/* Action button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowLegalModal(false)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-2xl text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage
