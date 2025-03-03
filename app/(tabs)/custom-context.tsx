import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { generateConversation } from '../../services/openai';

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
    backgroundColor: '#f4f4f5',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    textAlignVertical: 'top',
  },
  loader: {
    marginTop: 20,
  }
}); 