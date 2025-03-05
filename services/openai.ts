import { supabase } from '../lib/supabase';

export async function generateConversation(prompt: string): Promise<string> {
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Get the OpenAI API key from the database function
    const { data: apiKey, error: apiKeyError } = await supabase.rpc('get_openai_key');
    
    if (apiKeyError) {
      console.error('Error getting API key:', apiKeyError);
      throw new Error('Failed to retrieve API key');
    }

    // Call OpenAI API directly
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a conversation coach that helps people have better conversations. 
            Format your response as follows:
            MAIN:[The main conversation starter or question]
            FOLLOWUPS:
            1. [First follow-up question]
            2. [Second follow-up question]
            3. [Third follow-up question]
            AVOID:
            1. [First thing to avoid]
            2. [Second thing to avoid]
            3. [Third thing to avoid]`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate conversation');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating conversation:', error);
    throw error;
  }
} 