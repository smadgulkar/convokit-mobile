import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Feather } from '@expo/vector-icons';
import theme from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function PracticeMode() {
  const { prompt, main } = useLocalSearchParams<{ prompt: string, main: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tipVisible, setTipVisible] = useState(true);
  const { canAccessPremiumFeature } = useAuth();

  useEffect(() => {
    // Initialize with the main question
    if (main) {
      setMessages([
        {
          id: '1',
          text: main,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  }, [main]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Simulate AI response (in a real app, this would call an API)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateResponse(input),
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  // Simple response generator (would be replaced with actual AI in production)
  const generateResponse = (userInput: string): string => {
    const responses = [
      "That's an interesting perspective! Tell me more about that.",
      "I see what you mean. How did that make you feel?",
      "That's a great point. What led you to that conclusion?",
      "I hadn't thought about it that way before. Could you elaborate?",
      "That's fascinating! Have you always felt this way?",
      "I appreciate you sharing that. What else comes to mind?",
      "That's really insightful. How does this relate to your other experiences?",
      "I'm curious to hear more about your thoughts on this.",
      "That's a unique way of looking at it. What influenced your thinking?",
      "Thanks for sharing. How would you apply that in other situations?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Check if user can access practice
  if (!canAccessPremiumFeature('practice')) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Practice" }} />
        <View style={styles.premiumRequired}>
          <Feather name="lock" size={40} color={theme.colors.primary[400]} />
          <Text style={styles.premiumTitle}>Premium Feature</Text>
          <Text style={styles.premiumText}>
            Practice conversations are available only for premium users.
          </Text>
          <Button 
            label="Upgrade to Premium" 
            onPress={() => router.push('/upgrade')}
            fullWidth
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Practice Mode" }} />
      <SafeAreaView style={styles.container}>
        {tipVisible && (
          <View style={styles.tipContainer}>
            <Text style={styles.tipText}>
              Practice your conversation skills by responding to the AI. This is a safe space to try different approaches!
            </Text>
            <TouchableOpacity 
              style={styles.closeTip} 
              onPress={() => setTipVisible(false)}
            >
              <Feather name="x" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        )}
        
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageBubble, 
                message.sender === 'user' ? styles.userBubble : styles.aiBubble
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
          {loading && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your response..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !input.trim() && styles.disabledButton]} 
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            <Feather name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.ui.background,
  },
  tipContainer: {
    backgroundColor: theme.colors.accent.blue + '10', // 10% opacity
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent.blue,
  },
  tipText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.blue,
    lineHeight: theme.typography.lineHeight.normal,
  },
  closeTip: {
    padding: theme.spacing[1],
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  messageBubble: {
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing[2],
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: theme.colors.primary[500],
    alignSelf: 'flex-end',
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  aiBubble: {
    backgroundColor: theme.colors.neutral[700],
    alignSelf: 'flex-start',
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  messageText: {
    color: '#fff',
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.normal,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.ui.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing[3],
    paddingTop: theme.spacing[3],
    fontSize: theme.typography.fontSize.base,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: theme.colors.primary[500],
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing[2],
  },
  disabledButton: {
    backgroundColor: theme.colors.primary[300],
  },
  premiumRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  premiumTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing[2],
  },
  premiumText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[500],
    marginBottom: theme.spacing[4],
  },
}); 