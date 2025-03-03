import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity, Share, Clipboard } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { generateConversation } from '../../services/openai';
import { Feather } from '@expo/vector-icons';

interface ParsedResponse {
  main: string;
  followUps: string[];
  thingsToAvoid: string[];
}

const parseResponse = (response: string): ParsedResponse => {
  const mainMatch = response.match(/MAIN:\[(.*?)\]/);
  const followUpsMatch = response.match(/FOLLOWUPS:((?:(?:\d\. .*?\n?))+)/);
  const avoidMatch = response.match(/AVOID:((?:(?:\d\. .*?\n?))+)/);

  const main = mainMatch ? mainMatch[1] : '';
  const followUps = followUpsMatch
    ? followUpsMatch[1]
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d\. /, ''))
    : [];
  
  const thingsToAvoid = avoidMatch
    ? avoidMatch[1]
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d\. /, ''))
    : [];

  return { main, followUps, thingsToAvoid };
};

export default function QuestionDisplay() {
  const { prompt } = useLocalSearchParams<{ prompt: string }>();
  const [question, setQuestion] = useState<ParsedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await generateConversation(prompt || '');
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
  }, [prompt]);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000); // Reset after 2 seconds
  };

  const shareText = async (text: string) => {
    try {
      await Share.share({
        message: text,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

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
    <>
      <Stack.Screen options={{ title: "Conversation Guide" }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.mainQuestion}>
            <Text style={styles.mainQuestionText}>{question?.main}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => question?.main && copyToClipboard(question.main)}
              >
                <Feather name="copy" size={20} color="#687076" />
                {copiedText === question?.main && <Text style={styles.copiedText}>Copied!</Text>}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => question?.main && shareText(question.main)}
              >
                <Feather name="share-2" size={20} color="#687076" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.practiceButton}
              onPress={() => router.push({
                pathname: '/(tabs)/practice',
                params: { prompt: prompt, main: question?.main }
              })}
            >
              <Feather name="message-circle" size={18} color="#fff" style={styles.practiceIcon} />
              <Text style={styles.practiceButtonText}>Practice This Conversation</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.followUps}>
            <Text style={styles.followUpsTitle}>Follow-up Questions:</Text>
            {question?.followUps.map((followUp, index) => (
              <View key={index} style={styles.followUpItem}>
                <Text style={styles.followUpNumber}>{index + 1}</Text>
                <Text style={styles.followUpText}>{followUp}</Text>
                <View style={styles.followUpActions}>
                  <TouchableOpacity 
                    style={styles.smallIconButton} 
                    onPress={() => copyToClipboard(followUp)}
                  >
                    <Feather name="copy" size={18} color="#687076" />
                    {copiedText === followUp && <Text style={styles.copiedText}>Copied!</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.smallIconButton} 
                    onPress={() => shareText(followUp)}
                  >
                    <Feather name="share-2" size={18} color="#687076" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          {question?.thingsToAvoid && question.thingsToAvoid.length > 0 && (
            <View style={styles.avoidSection}>
              <Text style={styles.avoidTitle}>Things to Avoid:</Text>
              {question.thingsToAvoid.map((item, index) => (
                <View key={index} style={styles.avoidItem}>
                  <Feather name="alert-circle" size={18} color="#ef4444" style={styles.avoidIcon} />
                  <Text style={styles.avoidText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  smallIconButton: {
    padding: 4,
    marginLeft: 4,
  },
  followUpActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  copiedText: {
    fontSize: 12,
    color: '#10B981',
    position: 'absolute',
    bottom: -16,
    right: 0,
  },
  avoidSection: {
    marginTop: 24,
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  avoidTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B91C1C',
    marginBottom: 12,
  },
  avoidItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avoidIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  avoidText: {
    flex: 1,
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  practiceIcon: {
    marginRight: 8,
  },
  practiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 