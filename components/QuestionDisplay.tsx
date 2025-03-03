import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Button } from './ui/Button';
import { generateConversation } from '../services/openai';

type RootStackParamList = {
  Question: { prompt: string };
};

type RoutePropType = RouteProp<RootStackParamList, 'Question'>;

interface ParsedResponse {
  main: string;
  followUps: string[];
}

const parseResponse = (response: string): ParsedResponse => {
  const mainMatch = response.match(/MAIN:\[(.*?)\]/);
  const followUpsMatch = response.match(/FOLLOWUPS:((?:(?:\d\. .*?\n?))+)/);

  const main = mainMatch ? mainMatch[1] : '';
  const followUps = followUpsMatch
    ? followUpsMatch[1]
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d\. /, ''))
    : [];

  return { main, followUps };
};

export default function QuestionDisplay() {
  const route = useRoute<RoutePropType>();
  const [question, setQuestion] = useState<ParsedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await generateConversation(route.params.prompt);
        if (response) {
          setQuestion(parseResponse(response));
        }
      } catch (err) {
        setError('Failed to generate question. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [route.params.prompt]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>Generating conversation...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button label="Try Again" onPress={() => setLoading(true)} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mainQuestion}>
          <Text style={styles.mainQuestionText}>{question?.main}</Text>
        </View>
        
        <View style={styles.followUps}>
          <Text style={styles.followUpsTitle}>Follow-up Questions:</Text>
          {question?.followUps.map((followUp, index) => (
            <View key={index} style={styles.followUpItem}>
              <Text style={styles.followUpNumber}>{index + 1}</Text>
              <Text style={styles.followUpText}>{followUp}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  content: {
    padding: 16,
    gap: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#687076',
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  mainQuestion: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainQuestionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
  },
  followUps: {
    gap: 12,
  },
  followUpsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#687076',
    marginBottom: 8,
  },
  followUpItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  followUpNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0a7ea4',
    marginRight: 12,
  },
  followUpText: {
    flex: 1,
    fontSize: 16,
    color: '#11181C',
  },
}); 