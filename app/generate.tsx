import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { contexts } from '../constants/contexts';
import theme from '../constants/theme';
import { Button } from '../components/ui/Button';

export default function GenerateScreen() {
  const { contextId, categoryId } = useLocalSearchParams();
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const generationInProgress = useRef(false);
  
  const context = contexts.find(c => c.id === contextId);
  const category = context?.categories.find(cat => cat.id === categoryId);

  const handleGenerate = async () => {
    if (generationInProgress.current) {
      console.log('Already generating');
      return;
    }

    try {
      setGenerating(true);
      generationInProgress.current = true;

      // Simulate API call with shorter delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate result
      const generatedResult = generateConversationStarters(category?.label || '');
      setResult(generatedResult);

    } catch (error) {
      console.error('Generation error:', error);
      setError('Failed to generate conversation starters. Please try again.');
    } finally {
      setGenerating(false);
      generationInProgress.current = false;
    }
  };
  
  // Helper function to generate varied conversation starters
  const generateConversationStarters = (category: string): string => {
    const starters = {
      'Small Talk': [
        "What's the most interesting thing that happened to you this week?",
        "Have you picked up any new hobbies lately?",
        "What's your favorite way to spend a weekend?",
      ],
      'Dating': [
        "What's your idea of a perfect date?",
        "What qualities do you value most in a relationship?",
        "What's the best piece of relationship advice you've received?",
      ],
      'Professional': [
        "What inspired you to choose your current career path?",
        "What's the most valuable lesson you've learned at work?",
        "Where do you see yourself professionally in the next few years?",
      ],
      'default': [
        "What's the most interesting thing you've learned recently?",
        "If you could have dinner with anyone, living or dead, who would it be and why?",
        "What's something you're looking forward to in the next few months?",
      ]
    };

    const selectedStarters = starters[category as keyof typeof starters] || starters.default;
    
    return `Here are some great conversation starters for ${category}:\n\n` + 
      selectedStarters.map((starter, index) => `${index + 1}. ${starter}`).join('\n\n');
  };
  
  if (!context || !category) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: "Not Found",
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.colors.ui.background,
            },
          }} 
        />
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={40} color={theme.colors.neutral[400]} />
          <Text style={styles.errorTitle}>Category Not Found</Text>
          <Text style={styles.errorText}>The conversation category you're looking for doesn't exist.</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: category.label,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.ui.background,
          },
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <View style={[styles.iconContainer, { backgroundColor: `${context.color}15` }]}>
            <Feather name={context.icon || "message-square"} size={24} color={context.color} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>{category.label}</Text>
            <Text style={styles.infoDescription}>{category.prompt}</Text>
          </View>
        </View>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={20} color="#E53E3E" />
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        ) : null}
        
        {generating ? (
          <View style={styles.generatingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary[500]} />
            <Text style={styles.generatingText}>Generating conversation starters...</Text>
          </View>
        ) : result ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{result}</Text>
            <Button 
              label="Generate Another" 
              icon="refresh-cw"
              fullWidth
              onPress={handleGenerate}
            />
          </View>
        ) : (
          <View style={styles.generateContainer}>
            <Text style={styles.generateText}>
              Click the button below to generate conversation starters.
            </Text>
            <Button 
              label="Generate Conversation Starters" 
              icon="zap"
              fullWidth
              onPress={handleGenerate}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.ui.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.ui.card,
    borderRadius: 12,
    ...theme.shadows.md,
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.ui.text,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: theme.colors.ui.textSecondary,
  },
  generateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  generateText: {
    fontSize: 16,
    color: theme.colors.ui.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.ui.card,
    borderRadius: 12,
    ...theme.shadows.md,
  },
  resultText: {
    fontSize: 16,
    color: theme.colors.ui.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorMessage: {
    marginLeft: 8,
    color: '#B91C1C',
    flex: 1,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.ui.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.ui.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  generatingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    flex: 1,
  },
  generatingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.ui.textSecondary,
    textAlign: 'center',
  },
}); 