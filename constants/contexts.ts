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
      {
        id: 'reconnect',
        label: 'Reconnecting',
        prompt: 'Create a text conversation starter for someone you haven\'t spoken to in a while, making it natural and not awkward.',
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
      {
        id: 'dinner',
        label: 'Dinner Party',
        prompt: 'Generate engaging dinner table conversation starters that can involve everyone present and create memorable discussions.',
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
      {
        id: 'serious',
        label: 'Serious Topics',
        prompt: 'Create thoughtful conversation starters for discussing more serious relationship topics in a constructive and positive way.',
      },
    ],
  },
  {
    id: 'professional',
    icon: 'briefcase',
    label: 'Professional',
    color: '#8B5CF6',
    description: 'Excel in work environments',
    categories: [
      {
        id: 'interview',
        label: 'Job Interview',
        prompt: 'Generate thoughtful questions to ask during a job interview that will help you stand out and learn more about the role.',
      },
      {
        id: 'meeting',
        label: 'Team Meeting',
        prompt: 'Create conversation starters for team meetings that encourage participation and productive discussion.',
      },
      {
        id: 'oneonone',
        label: 'One-on-One',
        prompt: 'Generate effective conversation starters for one-on-one meetings with colleagues or managers.',
      },
      {
        id: 'client',
        label: 'Client Interactions',
        prompt: 'Create professional conversation starters for client meetings that build rapport while maintaining professionalism.',
      },
    ],
  },
  {
    id: 'family',
    icon: 'home',
    label: 'Family',
    color: '#F59E0B',
    description: 'Strengthen family bonds',
    categories: [
      {
        id: 'dinner',
        label: 'Family Dinner',
        prompt: 'Generate engaging family dinner conversation starters that can involve all family members and create meaningful discussions.',
      },
      {
        id: 'reunion',
        label: 'Family Reunion',
        prompt: 'Create conversation starters for family reunions that help reconnect with relatives you haven\'t seen in a while.',
      },
      {
        id: 'inlaws',
        label: 'In-Laws',
        prompt: 'Generate respectful and engaging conversation starters for interactions with in-laws or your partner\'s family.',
      },
      {
        id: 'difficult',
        label: 'Difficult Topics',
        prompt: 'Create conversation starters for addressing more challenging family topics in a constructive and respectful way.',
      },
    ],
  },
  {
    id: 'custom',
    icon: 'edit-3',
    label: 'Custom',
    color: '#6B7280',
    description: 'Create your own context',
    categories: [
      {
        id: 'custom',
        label: 'Custom Context',
        prompt: 'Create a custom conversation context',
      },
    ],
  },
]; 