import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity, Share, Clipboard } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { generateConversation } from '../../services/openai';
import { Feather } from '@expo/vector-icons';
import theme from '../../constants/theme';

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
    backgroundColor: theme.colors.ui.background,
  },
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[6],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  loadingText: {
    marginTop: theme.spacing[4],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.ui.textSecondary,
  },
  errorText: {
    marginBottom: theme.spacing[4],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.semantic.error,
    textAlign: 'center',
  },
  mainQuestion: {
    backgroundColor: theme.colors.ui.card,
    padding: theme.spacing[5],
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral[100],
  },
  mainQuestionText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.ui.text,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  followUps: {
    gap: theme.spacing[3],
  },
  followUpsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.ui.textSecondary,
    marginBottom: theme.spacing[2],
  },
  followUpItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.ui.card,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral[100],
  },
  followUpNumber: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[500],
    marginRight: theme.spacing[3],
  },
  followUpText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.ui.text,
    lineHeight: theme.typography.lineHeight.normal,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing[3],
  },
  iconButton: {
    padding: theme.spacing[2],
    marginLeft: theme.spacing[2],
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.full,
  },
  smallIconButton: {
    padding: theme.spacing[1],
    marginLeft: theme.spacing[1],
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.full,
  },
  followUpActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing[2],
  },
  copiedText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.success,
    position: 'absolute',
    bottom: -16,
    right: 0,
  },
  avoidSection: {
    marginTop: theme.spacing[6],
    backgroundColor: theme.colors.semantic.error + '10', // 10% opacity
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.semantic.error,
  },
  avoidTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.semantic.error,
    marginBottom: theme.spacing[3],
  },
  avoidItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[2],
  },
  avoidIcon: {
    marginRight: theme.spacing[2],
    marginTop: 2,
  },
  avoidText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.semantic.error + 'CC', // 80% opacity
    lineHeight: theme.typography.lineHeight.normal,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary[600],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[3],
    marginTop: theme.spacing[4],
  },
  practiceIcon: {
    marginRight: theme.spacing[2],
  },
  practiceButtonText: {
    color: '#fff',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
}); 