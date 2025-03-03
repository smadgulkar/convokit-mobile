import { Context } from '../types';

export const contexts: Context[] = [
  {
    id: 'texting',
    icon: 'message-circle',
    label: 'Texting',
    color: '#3B82F6',
    description: 'Keep the messages flowing',
    categories: [
      {
        id: 'casual',
        label: 'Casual Chat',
        prompt: 'Generate a casual text conversation starter that is friendly and engaging, perfect for checking in with a friend.',
      },
      {
        id: 'dating',
        label: 'Dating',
        prompt: 'Create an interesting text conversation starter for someone you are dating or interested in, keeping it fun and flirty but respectful.',
      },
      {
        id: 'group',
        label: 'Group Chat',
        prompt: 'Generate an engaging group chat conversation starter that can get everyone involved and create interesting discussions.',
      },
    ],
  },
  {
    id: 'social',
    icon: 'users',
    label: 'Social Events',
    color: '#10B981',
    description: 'Navigate social situations',
    categories: [
      {
        id: 'networking',
        label: 'Networking',
        prompt: 'Create a professional networking conversation starter that can help build meaningful connections at business events.',
      },
      {
        id: 'party',
        label: 'Party',
        prompt: 'Generate a fun party conversation starter that can work with new people in a social setting.',
      },
      {
        id: 'smalltalk',
        label: 'Small Talk',
        prompt: 'Create a casual small talk conversation starter that can work in any social situation while avoiding awkwardness.',
      },
    ],
  },
  {
    id: 'dating',
    icon: 'heart',
    label: 'Dating',
    color: '#EF4444',
    description: 'Make meaningful connections',
    categories: [
      {
        id: 'firstdate',
        label: 'First Date',
        prompt: 'Generate an engaging first date conversation starter that helps create a genuine connection while keeping things light and fun.',
      },
      {
        id: 'deepening',
        label: 'Deepening Connection',
        prompt: 'Create meaningful conversation starters for getting to know someone better in a dating context, focusing on values and experiences.',
      },
      {
        id: 'fun',
        label: 'Fun & Playful',
        prompt: 'Generate fun and playful conversation starters for dating that can create memorable moments and shared laughter.',
      },
    ],
  },
]; 