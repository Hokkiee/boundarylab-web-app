import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon,
  TagIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'
import { 
  BookmarkIcon,
  SparklesIcon 
} from '@heroicons/react/24/solid'
import { glossaryService } from '../services/api'
import Sidebar from '../components/Sidebar'
import MobileNavigation from '../components/MobileNavigation'
import MobileSidebar from '../components/MobileSidebar'

const categories = [
  { id: 'all', name: 'All Terms', icon: BookOpenIcon },
  { id: 'manipulation', name: 'Manipulation', icon: SparklesIcon },
  { id: 'violation', name: 'Boundary Violations', icon: BookmarkIcon },
  { id: 'subtle-harm', name: 'Subtle Harm', icon: TagIcon },
  { id: 'exploitation', name: 'Exploitation', icon: AcademicCapIcon }
]

function GlossaryPage({ user }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [allTerms, setAllTerms] = useState([])
  const [filteredTerms, setFilteredTerms] = useState([])
  const [learnedTerms, setLearnedTerms] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all terms from database
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true)
        const terms = await glossaryService.getAllTerms()
        setAllTerms(terms)
        setFilteredTerms(terms)
        
        // Fetch user's learned terms if authenticated
        if (user) {
          const progress = await glossaryService.getUserProgress()
          const learned = new Set(progress.map(p => p.term_id))
          setLearnedTerms(learned)
        }
      } catch (err) {
        setError('Failed to load glossary terms. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTerms()
  }, [user])

  // Filter terms based on search and category
  useEffect(() => {
    let filtered = allTerms

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (term.tags && term.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    }

    setFilteredTerms(filtered)
  }, [allTerms, searchTerm, selectedCategory])

  const markAsLearned = async (termId) => {
    if (!user) return
    
    try {
      await glossaryService.markTermAsLearned(termId)
      setLearnedTerms(prev => new Set([...prev, termId]))
      console.log('Term marked as learned!')
    } catch (err) {
      console.error('Failed to mark term as learned:', err)
    }
  }

  const isTermLearned = (termId) => {
    return learnedTerms.has(termId)
  }

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpenIcon className="h-8 w-8 text-accent-400" />
              <h1 className="text-3xl font-bold text-text-primary">Boundary Glossary</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl">
              Learn to articulate complex feelings and identify subtle mistreatments. 
              Understanding these terms helps you recognize patterns and communicate your experiences.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search terms, definitions, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700 border-primary-300'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Terms List */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading terms...</p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Terms</h3>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {filteredTerms.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No terms found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTerms.map((term) => (
                        <div
                          key={term.id}
                          onClick={() => setSelectedTerm(term)}
                          className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer border-2 transition-all hover:shadow-md ${
                            selectedTerm?.id === term.id ? 'border-primary-300 bg-primary-50' : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{term.term}</h3>
                              <p className="text-gray-600 line-clamp-2">{term.definition}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {term.difficulty && (
                                <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(term.difficulty)}`}>
                                  {term.difficulty}
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsLearned(term.id)
                                }}
                                disabled={isTermLearned(term.id)}
                                className={`p-1 rounded transition-colors ${
                                  isTermLearned(term.id) 
                                    ? 'text-green-500 cursor-default' 
                                    : 'text-gray-400 hover:text-green-500 hover:bg-gray-100'
                                }`}
                                title={isTermLearned(term.id) ? 'Already learned' : 'Mark as learned'}
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          
                          {term.tags && term.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {term.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  {tag}
                                </span>
                              ))}
                              {term.tags.length > 3 && (
                                <span className="px-2 py-1 text-xs text-gray-500">
                                  +{term.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Term Detail */}
            <div className="space-y-6">
              {selectedTerm ? (
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{selectedTerm.term}</h3>
                    {selectedTerm.difficulty && (
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(selectedTerm.difficulty)}`}>
                        {selectedTerm.difficulty} difficulty
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Definition</h4>
                      <p className="text-gray-700">{selectedTerm.definition}</p>
                    </div>

                    {selectedTerm.example && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Example</h4>
                        <p className="text-gray-700 italic bg-gray-50 p-3 rounded">{selectedTerm.example}</p>
                      </div>
                    )}

                    {selectedTerm.tags && selectedTerm.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Related Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTerm.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => markAsLearned(selectedTerm.id)}
                      disabled={isTermLearned(selectedTerm.id)}
                      className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                        isTermLearned(selectedTerm.id)
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>{isTermLearned(selectedTerm.id) ? 'Already Learned' : 'Mark as Learned'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a term</h3>
                  <p className="text-gray-600">Click on any term to see detailed information and examples.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlossaryPage
