import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { generateConversation } from '../../services/openai';
import theme from '../../constants/theme';

export default function CustomContext() {
  const [situation, setSituation] = useState('');
  const [relationship, setRelationship] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!situation.trim()) {
      return; // Require at least a situation
    }

    setLoading(true);
    
    const prompt = `Generate a conversation starter for this situation: ${situation}. 
      ${relationship ? `My relationship with the person is: ${relationship}.` : ''} 
      ${goal ? `My goal for this conversation is: ${goal}.` : ''}`;
    
    try {
      router.push({
        pathname: '/(tabs)/question',
        params: { prompt }
      });
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Custom Context" }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Create Your Own Context</Text>
          <Text style={styles.description}>
            Describe your specific situation and get personalized conversation starters.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Describe the situation *</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., Meeting a friend's parents for the first time"
              value={situation}
              onChangeText={setSituation}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your relationship with the person(s)</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., They're my partner's parents"
              value={relationship}
              onChangeText={setRelationship}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your goal for the conversation</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., Make a good impression"
              value={goal}
              onChangeText={setGoal}
            />
          </View>

          <Button 
            label={loading ? "Generating..." : "Generate Conversation Starters"} 
            onPress={handleSubmit}
            disabled={!situation.trim() || loading}
          />
          
          {loading && (
            <ActivityIndicator style={styles.loader} size="large" color="#0a7ea4" />
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
    paddingBottom: theme.spacing[10],
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[2],
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.ui.textSecondary,
    marginBottom: theme.spacing[6],
    lineHeight: theme.typography.lineHeight.normal,
  },
  inputGroup: {
    marginBottom: theme.spacing[5],
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[2],
  },
  input: {
    backgroundColor: theme.colors.ui.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.ui.text,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loader: {
    marginTop: theme.spacing[5],
  }
}); 