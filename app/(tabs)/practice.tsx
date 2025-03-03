import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Feather } from '@expo/vector-icons';

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
    backgroundColor: '#f4f4f5',
  },
  tipContainer: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  closeTip: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#4B5563',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 12,
    paddingTop: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
  },
}); 