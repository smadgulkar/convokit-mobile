// Define the context and category types
export interface Category {
  id: string;
  label: string;
  prompt?: string;
}

export interface Context {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  categories: Category[];
}

// Export the contexts array
export const contexts: Context[] = [
  {
    id: 'texting',
    label: 'Texting',
    description: 'Improve your messaging skills',
    icon: '📱',
    color: '#3b82f6',
    categories: [
      { id: 'dating', label: 'Dating', prompt: 'Generate conversation starters for dating texts' },
      { id: 'friends', label: 'Friends', prompt: 'Generate conversation starters for texting friends' },
      { id: 'family', label: 'Family', prompt: 'Generate conversation starters for family texts' }
    ]
  },
  {
    id: 'social',
    label: 'Social',
    description: 'Better in-person conversations',
    icon: '👥',
    color: '#8b5cf6',
    categories: [
      { id: 'networking', label: 'Networking', prompt: 'Generate conversation starters for networking events' },
      { id: 'parties', label: 'Parties', prompt: 'Generate conversation starters for parties' },
      { id: 'smalltalk', label: 'Small Talk', prompt: 'Generate conversation starters for small talk' }
    ]
  },
  {
    id: 'work',
    label: 'Work',
    description: 'Professional communication',
    icon: '💼',
    color: '#10b981',
    categories: [
      { id: 'meetings', label: 'Meetings', prompt: 'Generate conversation starters for work meetings' },
      { id: 'interviews', label: 'Interviews', prompt: 'Generate conversation starters for job interviews' },
      { id: 'feedback', label: 'Giving Feedback', prompt: 'Generate conversation starters for giving feedback' }
    ]
  }
]; 