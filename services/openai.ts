import { supabase } from '../lib/supabase';

// Function to get OpenAI API key from Supabase
async function getOpenAIKey(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('key')
      .eq('name', 'openai')
      .single();
      
    if (error) {
      console.error('Error fetching API key:', error);
      throw new Error('Failed to fetch API key');
    }
    
    return data.key;
  } catch (error) {
    console.error('Unexpected error fetching API key:', error);
    throw new Error('Failed to fetch API key');
  }
}

export async function generateConversation(prompt: string): Promise<string> {
  try {
    const apiKey = await getOpenAIKey();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
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