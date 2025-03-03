# ConvoKit: Web to React Native Conversion Guide

## Overview
This guide will help you convert the ConvoKit web application into a React Native Expo app while maintaining the same core functionality: a conversation guide that helps users generate contextual questions and follow-ups using OpenAI.

## Project Setup

1. Create a new Expo project:
```bash
npx create-expo-app convokit-mobile --template
```

2. Install necessary dependencies:
```bash
bash
cd convokit-mobile
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-safe-area-context react-native-screens
npm install openai@4.x.x react-native-dotenv @types/react-native-dotenv
```

## Project Structure
Create the following folder structure:
src/
├── components/
│ ├── ContextSelection.tsx
│ ├── CategorySelection.tsx
│ ├── QuestionDisplay.tsx
│ └── ui/
│ ├── Button.tsx
│ └── Card.tsx
├── constants/
│ └── contexts.ts
├── types/
│ └── index.ts
├── services/
│ └── openai.ts
└── utils/
└── styles.ts

## Key Components to Create

### 1. Types (src/types/index.ts)
typescript
import { IconProps } from '@expo/vector-icons/build/createIconSet';
export interface Category {
id: string;
label: string;
prompt: string;
}
export interface Context {
id: string;
icon: string; // Name of the icon from @expo/vector-icons
label: string;
color: string;
description: string;
categories: Category[];
}
export interface Question {
main: string;
followUps: string[];
}
### 2. Contexts Data (src/constants/contexts.ts)

typescript
import { Context } from '../types';
export const contexts: Context[] = [
{
id: 'texting',
icon: 'message-circle', // Using @expo/vector-icons names
label: 'Texting',
color: '#3B82F6', // Replace CSS classes with actual colors
description: 'Keep the messages flowing',
categories: [
{
id: 'casual',
label: 'Casual Chat',
prompt: 'super chill text conversation starters...'
},
// ... other categories
]
},
// ... other contexts
];
### 3. OpenAI Service (src/services/openai.ts)

typescript
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
content: You are a conversation expert. You MUST respond using EXACTLY this format, with NO additional text:MAIN:[your single question here]FOLLOWUPS:1. [first follow-up]2. [second follow-up]3. [third follow-up]
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
### 4. UI Components

#### Button Component (src/components/ui/Button.tsx)
typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
interface ButtonProps {
onPress: () => void;
label: string;
icon?: string;
variant?: 'default' | 'outline' | 'ghost';
disabled?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
onPress,
label,
icon,
variant = 'default',
disabled = false,
}) => {
return (
<TouchableOpacity
style={[
styles.button,
variant === 'outline' && styles.outlineButton,
variant === 'ghost' && styles.ghostButton,
disabled && styles.disabled,
]}
onPress={onPress}
disabled={disabled}
>
{icon && <Feather name={icon} size={20} style={styles.icon} />}
<Text style={styles.label}>{label}</Text>
</TouchableOpacity>
);
};
const styles = StyleSheet.create({
button: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
padding: 12,
borderRadius: 8,
backgroundColor: '#000',
},
outlineButton: {
backgroundColor: 'transparent',
borderWidth: 1,
borderColor: '#000',
},
ghostButton: {
backgroundColor: 'transparent',
},
disabled: {
opacity: 0.5,
},
icon: {
marginRight: 8,
color: '#fff',
},
label: {
color: '#fff',
fontSize: 16,
fontWeight: '500',
},
});
### 5. Main App Component (App.tsx)


typescript
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContextSelection from "./src/components/ContextSelection";
import CategorySelection from "./src/components/CategorySelection";
import QuestionDisplay from "./src/components/QuestionDisplay";
const Stack = createNativeStackNavigator();
export default function App() {
return (
<NavigationContainer>
<Stack.Navigator>
<Stack.Screen
name="Contexts"
component={ContextSelection}
options={{ title: "Choose Context" }}
/>
<Stack.Screen
name="Categories"
component={CategorySelection}
options={{ title: "Choose Category" }}
/>
<Stack.Screen
name="Question"
component={QuestionDisplay}
options={{ title: "Conversation Guide" }}
/>
</Stack.Navigator>
</NavigationContainer>
);
}
## Key Differences from Web Version

1. **Navigation**: 
   - Instead of conditional rendering, use React Navigation
   - Each screen is a separate component with its own route

2. **Styling**:
   - Replace Tailwind CSS with React Native StyleSheet
   - Use platform-specific components (TouchableOpacity instead of buttons)
   - Implement custom styling for cards and containers

3. **Icons**:
   - Replace Lucide icons with @expo/vector-icons
   - Use platform-specific icon names

4. **Environment Variables**:
   - Use react-native-dotenv instead of Next.js env
   - Create a .env file in the root directory

## Environment Setup

1. Create a `.env` file in the root directory:
```bash
OPENAI_API_KEY=your_api_key_here
```

2. Install the react-native-dotenv package:
```bash
npm install react-native-dotenv
```

2. Add this to your `babel.config.js`:
```javascript
module.exports = function(api) {
api.cache(true);
return {
presets: ["babel-preset-expo"],
plugins: [
["module:react-native-dotenv"]
]
};
};
```


