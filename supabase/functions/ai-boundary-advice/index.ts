import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface BoundaryRequest {
  scenario: string
  userInput: string
  context?: {
    previousScenarios?: string[]
    userProfile?: {
      preferredCommunicationStyle?: string
      triggerAreas?: string[]
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { scenario, userInput, context }: BoundaryRequest = await req.json()

    // Call OpenAI API for personalized advice
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a supportive boundary-setting coach. Provide personalized, actionable advice for healthy boundary setting. Keep responses empathetic, practical, and empowering.`
          },
          {
            role: 'user',
            content: `
              Scenario: ${scenario}
              User's situation: ${userInput}
              Context: ${JSON.stringify(context, null, 2)}
              
              Please provide:
              1. Validation of their feelings
              2. 2-3 specific boundary-setting strategies
              3. A sample script they could use
              4. What to expect as potential outcomes
            `
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const aiResponse = await openaiResponse.json()
    
    return new Response(
      JSON.stringify({
        advice: aiResponse.choices[0].message.content,
        confidence: 0.85, // Could be calculated based on scenario match
        followUpSuggestions: [
          "Would you like more specific scripts for this situation?",
          "How about exploring why this boundary feels challenging?",
          "Want to practice this scenario with different approaches?"
        ]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
