import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Button } from '../components/ui/Button';

export default function UpgradeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Upgrade to Premium" }} />
      <Text style={styles.title}>Upgrade to Premium</Text>
      <Text style={styles.description}>
        Get unlimited conversation starters, practice sessions, and access to all conversation contexts.
      </Text>
      
      <View style={styles.pricingCard}>
        <Text style={styles.planName}>Premium Plan</Text>
        <Text style={styles.price}>$4.99<Text style={styles.period}>/month</Text></Text>
        
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>✓ Unlimited conversation starters</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>✓ Access to all conversation contexts</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>✓ Practice conversations with AI</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>✓ No ads</Text>
          </View>
        </View>
        
        <Button label="Subscribe Now" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  pricingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 20,
  },
  period: {
    fontSize: 16,
    color: '#666',
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
  },
}); 