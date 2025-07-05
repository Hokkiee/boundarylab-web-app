import { useState, useEffect } from 'react'
import { AcademicCapIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Sidebar from '../components/Sidebar'
import MobileNavigation from '../components/MobileNavigation'
import MobileSidebar from '../components/MobileSidebar'

function ScenariosPage({ user }) {
  const [scenarios, setScenarios] = useState([])
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showContentWarning, setShowContentWarning] = useState(false)
  const [pendingScenario, setPendingScenario] = useState(null)
  const [completedScenarios, setCompletedScenarios] = useState(new Set())

  // Sample data
  const getSampleScenarios = () => [
    {
      id: '1',
      title: 'Workplace Boundary Setting',
      description: 'Practice setting boundaries with colleagues who overstep',
      situation: 'Your coworker keeps asking you to cover their shifts at the last minute, making you feel guilty when you say no. They say things like "I thought we were friends" and "You\'re the only one I can count on."',
      category: 'workplace',
      difficulty: 'beginner',
      estimated_time: 3,
      scenario_choices: [
        {
          id: 'c1',
          choice_text: 'Say yes again to avoid conflict',
          consequence: 'You notice that helping others is important to you, and you value harmony in relationships. This choice shows your caring nature.',
          explanation: 'It\'s natural to want to help friends and avoid conflict. Your empathy is a strength.',
        },
        {
          id: 'c2',
          choice_text: 'Explain that you need advance notice for schedule changes',
          consequence: 'You\'re finding a balance between being helpful and respecting your own time. This shows your thoughtfulness.',
          explanation: 'Setting clear expectations while maintaining kindness shows emotional intelligence.',
        },
        {
          id: 'c3',
          choice_text: 'Tell them you can no longer cover last-minute shifts',
          consequence: 'You\'re prioritizing your own time and energy, which shows self-awareness and self-care.',
          explanation: 'Protecting your boundaries is an act of self-respect and helps others learn to plan better.',
        },
      ]
    },
    {
      id: '2',
      title: 'Family Dinner Dynamics',
      description: 'Handle inappropriate comments from relatives',
      situation: 'At family gatherings, your uncle makes comments about your appearance, career choices, or relationship status that make you uncomfortable. Other family members say "That\'s just how he is" when you object.',
      category: 'family',
      difficulty: 'intermediate',
      estimated_time: 3,
      scenario_choices: [
        {
          id: 'c4',
          choice_text: 'Stay quiet to keep the peace',
          consequence: 'You value family harmony and prefer to avoid confrontation. This shows your consideration for family dynamics.',
          explanation: 'Choosing peace in difficult family situations shows wisdom and emotional maturity.',
        },
        {
          id: 'c5',
          choice_text: 'Politely change the subject',
          consequence: 'You\'re finding gentle ways to redirect uncomfortable situations. This shows your social skills and diplomacy.',
          explanation: 'Redirecting conversations tactfully is a valuable social skill that maintains relationships.',
        },
        {
          id: 'c6',
          choice_text: 'Calmly ask them to stop making those comments',
          consequence: 'You\'re speaking up for yourself while staying respectful. This shows courage and self-advocacy.',
          explanation: 'Standing up for yourself respectfully teaches others how you want to be treated.',
        },
      ]
    },
    {
      id: '3',
      title: 'Social Media Boundaries',
      description: 'Navigate uncomfortable online interactions',
      situation: 'A friend keeps tagging you in posts that make you uncomfortable and sharing personal details about your life without asking. When you mention it, they say "It\'s just social media, don\'t be so sensitive."',
      category: 'social',
      difficulty: 'beginner',
      estimated_time: 3,
      scenario_choices: [
        {
          id: 'c7',
          choice_text: 'Just untag yourself and ignore it',
          consequence: 'You\'re taking quiet action to protect your privacy. This shows your awareness of your comfort levels.',
          explanation: 'Taking care of your online presence quietly is a valid way to maintain your boundaries.',
        },
        {
          id: 'c8',
          choice_text: 'Ask them privately to check with you before posting about you',
          consequence: 'You\'re communicating your needs clearly and privately. This shows respect for both yourself and your friend.',
          explanation: 'Direct, private communication often resolves issues while preserving relationships.',
        },
        {
          id: 'c9',
          choice_text: 'Limit what they can see on your social media',
          consequence: 'You\'re using available tools to create the privacy you need. This shows practical problem-solving.',
          explanation: 'Using privacy settings is a smart way to control your information without confrontation.',
        },
      ]
    },
    {
      id: '4',
      title: 'After-hours dilemma',
      description: 'Navigate workplace dynamics in informal settings',
      category: 'professional boundaries',
      difficulty: 'advanced',
      estimated_time: 10,
      contentWarning: 'This scenario involves workplace boundary violations and uncomfortable social situations. It\'s designed to help you practice recognizing and responding to challenging dynamics in professional settings.',
      isMultiPart: true,
      parts: [
        {
          id: 'part1',
          title: 'The Situation (Part 1)',
          situation: 'It\'s Friday night. A few people from your team go out for casual drinks after work. It\'s not an official company event - just a small group trying to unwind.\n\nOne of your senior colleagues, someone you\'ve worked with before, leans over and says in a playful tone, "You used to take such good care of me at these things. What happened? Is it because I told you I have a girlfriend?"\n\nA few people overhear and join in the teasing. You\'re not sure how to respond.',
          choices: [
            {
              id: 'p1c1',
              choice_text: 'Make a light-hearted joke back to keep the vibes going',
              supportiveMessage: 'You value harmony and want to keep things light. This shows your social awareness and desire to maintain team relationships. Many people choose this path to avoid immediate conflict.'
            },
            {
              id: 'p1c2',
              choice_text: 'Laugh it off and steer the conversation elsewhere, hoping it doesn\'t come up again',
              supportiveMessage: 'You\'re using redirection to manage an uncomfortable moment. This shows your diplomatic skills and ability to navigate tricky social situations gracefully.'
            },
            {
              id: 'p1c3',
              choice_text: 'Stay quiet and keep a neutral expression. You turn to the person next to you to change the energy',
              supportiveMessage: 'You\'re protecting your energy and choosing not to engage. This shows your self-awareness and ability to recognize when something doesn\'t feel right.'
            }
          ]
        },
        {
          id: 'part2',
          title: 'The Situation (Part 2)',
          situation: 'Later in the night, he seems more tipsy. You\'ve been keeping some distance, but notice he keeps glancing your way.\n\nAt one point, when no one else is around, he gently tugs your arm and says, "Let\'s go talk outside for a sec."\n\nBefore you know it, you\'re outside with him. You feel tense.',
          choices: [
            {
              id: 'p2c1',
              choice_text: 'Let the conversation play out. You don\'t want to overreact, and maybe he has something to say',
              supportiveMessage: 'You\'re giving someone the benefit of the doubt and trying to stay open. This shows your generous spirit, though your instincts are already telling you something feels off.'
            },
            {
              id: 'p2c2',
              choice_text: 'Try to wrap things up quickly and head back inside. You figure he\'s drunk and probably doesn\'t mean anything by it',
              supportiveMessage: 'You\'re trusting your gut feeling while trying to be understanding. This shows your emotional intelligence and ability to read situations.'
            },
            {
              id: 'p2c3',
              choice_text: 'Tell him straight up: "You\'re drunk, and this isn\'t okay," and walk back inside',
              supportiveMessage: 'You\'re speaking up clearly and removing yourself from the situation. This shows tremendous courage and self-advocacy skills.'
            }
          ]
        },
        {
          id: 'part3',
          title: 'The Situation (Part 3)',
          situation: 'A female senior notices you outside and joins you. She stays by your side for the rest of the night.\n\nAs you return to work the following week, you ended up never reporting what happened. You feel shaken and angry since he clearly crossed a line. But a part of you thinks, "Maybe I\'m overreacting..." or "it\'s probably not that serious." You keep replaying the moment and questioning where that line actually is.',
          choices: [
            {
              id: 'p3c1',
              choice_text: 'Create more distance earlier on. Maybe even sit farther away from the start',
              supportiveMessage: 'You\'re thinking about prevention and early boundary-setting. This shows your learning and growth mindset. Many people wish they had trusted their initial instincts sooner.'
            },
            {
              id: 'p3c2',
              choice_text: 'Ask a colleague you trust to step in or stay nearby when you feel uncomfortable',
              supportiveMessage: 'You\'re recognizing the power of allies and support systems. This shows wisdom about workplace dynamics and the importance of having people who have your back.'
            },
            {
              id: 'p3c3',
              choice_text: 'Speak up more clearly in the moment. You want to be able to stand your ground when it matters',
              supportiveMessage: 'You\'re focusing on building your voice and confidence. This shows your commitment to personal growth and your understanding that clear communication is powerful.'
            }
          ]
        }
      ]
    }
  ]

  const handleScenarioClick = (scenario) => {
    if (scenario.contentWarning) {
      setPendingScenario(scenario)
      setShowContentWarning(true)
    } else {
      setSelectedScenario(scenario)
    }
  }

  const handleContentWarningAccept = () => {
    setSelectedScenario(pendingScenario)
    setShowContentWarning(false)
    setPendingScenario(null)
  }

  const handleContentWarningCancel = () => {
    setShowContentWarning(false)
    setPendingScenario(null)
  }

  const handleBackToList = () => {
    setSelectedScenario(null)
  }

  // Load completed scenarios from localStorage
  const loadCompletedScenarios = () => {
    const saved = localStorage.getItem('completedScenarios')
    if (saved) {
      setCompletedScenarios(new Set(JSON.parse(saved)))
    }
  }

  // Save completed scenario to localStorage
  const markScenarioComplete = (scenarioId, reflection) => {
    const newCompleted = new Set([...completedScenarios, scenarioId])
    setCompletedScenarios(newCompleted)
    localStorage.setItem('completedScenarios', JSON.stringify([...newCompleted]))
    
    // Save reflection
    if (reflection.trim()) {
      const reflections = JSON.parse(localStorage.getItem('scenarioReflections') || '{}')
      reflections[scenarioId] = {
        text: reflection,
        completedAt: new Date().toISOString(),
        scenarioTitle: scenarios.find(s => s.id === scenarioId)?.title || 'Unknown Scenario'
      }
      localStorage.setItem('scenarioReflections', JSON.stringify(reflections))
    }
  }

  useEffect(() => {
    // Load sample scenarios and completed scenarios
    setLoading(true)
    loadCompletedScenarios()
    setTimeout(() => {
      setScenarios(getSampleScenarios())
      setLoading(false)
    }, 500)
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-600"></div>
            </div>
          </div>
        </div>
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
          
          {!selectedScenario ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-secondary-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Practice Scenarios</h1>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl">
                  Explore different situations and reflect on your responses. There are no right or wrong answers - 
                  this is about understanding yourself and building confidence.
                </p>
              </div>

              {/* Scenarios Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleScenarioClick(scenario)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {scenario.difficulty}
                        </span>
                        {scenario.contentWarning && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center space-x-1">
                            <ExclamationTriangleIcon className="h-3 w-3" />
                            <span>Sensitive</span>
                          </span>
                        )}
                        {completedScenarios.has(scenario.id) && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center space-x-1">
                            <CheckCircleIcon className="h-3 w-3" />
                            <span>Completed</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <span>{scenario.estimated_time}min</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {scenario.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {scenario.description}
                    </p>
                    
                    <div className="flex items-center text-secondary-600 text-sm font-medium">
                      <span>Explore scenario →</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <ScenarioDetail 
              scenario={selectedScenario}
              onBack={handleBackToList}
              onComplete={markScenarioComplete}
            />
          )}
        </div>
      </div>

      {/* Content Warning Modal */}
      {showContentWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Content Notice</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {pendingScenario?.contentWarning}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleContentWarningAccept}
                className="flex-1 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium"
              >
                I Understand
              </button>
              <button
                onClick={handleContentWarningCancel}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ScenarioDetail({ scenario, onBack, onComplete }) {
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [reflection, setReflection] = useState('')
  const [showInsight, setShowInsight] = useState(false)
  const [currentPart, setCurrentPart] = useState(0)

  const isMultiPart = scenario.isMultiPart
  const currentPartData = isMultiPart ? scenario.parts[currentPart] : scenario
  const totalParts = isMultiPart ? scenario.parts.length : 1

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice)
    setShowInsight(true)
  }

  const handleNextPart = () => {
    if (currentPart < totalParts - 1) {
      setCurrentPart(currentPart + 1)
      setSelectedChoice(null)
      setShowInsight(false)
    }
  }

  const handleComplete = () => {
    console.log('Scenario completed:', {
      scenario: scenario.id,
      choice: selectedChoice?.id,
      reflection,
      part: isMultiPart ? currentPart + 1 : 1
    })
    
    // Mark scenario as complete and save reflection
    onComplete(scenario.id, reflection)
    
    // Reset and go back to list
    setTimeout(() => {
      setCurrentPart(0)
      setSelectedChoice(null)
      setShowInsight(false)
      setReflection('')
      onBack()
    }, 1500)
  }

  const isLastPart = currentPart === totalParts - 1

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 text-secondary-600 hover:text-secondary-700 font-medium"
      >
        ← Back to scenarios
      </button>

      {/* Scenario content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {scenario.difficulty}
            </span>
            <span className="text-sm text-gray-500 capitalize">{scenario.category}</span>
            {isMultiPart && (
              <span className="text-sm text-gray-500">
                Part {currentPart + 1} of {totalParts}
              </span>
            )}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <span>{scenario.estimated_time} minutes</span>
          </div>
        </div>

        {/* Progress indicator for multi-part scenarios */}
        {isMultiPart && (
          <div className="mb-6">
            <div className="flex space-x-2">
              {scenario.parts.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full ${
                    index < currentPart ? 'bg-secondary-600' :
                    index === currentPart ? 'bg-secondary-400' :
                    'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isMultiPart ? currentPartData.title : scenario.title}
        </h1>
        <p className="text-gray-600 mb-6">{scenario.description}</p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">
            {isMultiPart ? 'The Story Continues:' : 'The Situation:'}
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {isMultiPart ? currentPartData.situation : scenario.situation}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-gray-900">
            {isMultiPart && currentPart === totalParts - 1 ? 
              "Looking back, what would you want to do differently next time?" : 
              "How would you respond?"
            }
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {isMultiPart && currentPart === totalParts - 1 ? 
              "Choose the response that feels most true to you." :
              "Choose the response that feels most natural to you."
            }
          </p>
          
          {(isMultiPart ? currentPartData.choices : scenario.scenario_choices)?.map((choice, index) => (
            <button
              key={choice.id}
              onClick={() => handleChoiceSelect(choice)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                selectedChoice?.id === choice.id
                  ? 'border-secondary-500 bg-secondary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-900">{choice.choice_text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Insight */}
        {showInsight && selectedChoice && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex-shrink-0 mt-0.5">
                <span className="text-white text-xs flex items-center justify-center w-full h-full">💙</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Supportive Reflection</h4>
                <p className="text-blue-800 mb-3">
                  {selectedChoice.supportiveMessage || selectedChoice.consequence}
                </p>
                {selectedChoice.explanation && (
                  <p className="text-blue-700 text-sm">{selectedChoice.explanation}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {selectedChoice && (
          <div className="space-y-4">
            {!isLastPart ? (
              <button
                onClick={handleNextPart}
                className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium"
              >
                Continue to Part {currentPart + 2}
              </button>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900">Reflection (Optional)</h3>
                <p className="text-sm text-gray-600">
                  What did this scenario help you understand about yourself? Any insights you'd like to remember?
                </p>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Your thoughts and reflections..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent resize-none"
                  rows={4}
                />
                
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium"
                >
                  Complete Scenario
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScenariosPage
