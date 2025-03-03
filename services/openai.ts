import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const generateConversation = async (prompt: string) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a conversation expert. You MUST respond using EXACTLY this format, with NO additional text:MAIN:[your single question here]FOLLOWUPS:1. [first follow-up]2. [second follow-up]3. [third follow-up]AVOID:1. [first thing to avoid]2. [second thing to avoid]"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1024,
      presence_penalty: 0.6,
      frequency_penalty: 0.2,
    });
    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}; 