import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { contexts } from '../../constants/contexts';
import theme from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  
  const context = contexts.find(c => c.id === id);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!context) {
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
          <Text style={styles.errorTitle}>Context Not Found</Text>
          <Text style={styles.errorText}>The conversation context you're looking for doesn't exist.</Text>
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
          title: context.label,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.ui.background,
          },
        }} 
      />
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Choose a category</Text>
            <Text style={styles.subtitle}>
              Select a specific conversation category
            </Text>
          </View>
          
          <View style={styles.categoriesContainer}>
            {context.categories.map((category) => (
              <Card
                key={category.id}
                title={category.label}
                icon="message-square"
                iconColor={context.color}
                onPress={() => router.push(`/generate?contextId=${context.id}&categoryId=${category.id}`)}
              />
            ))}
          </View>
        </ScrollView>
      )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.ui.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.ui.textSecondary,
  },
  categoriesContainer: {
    marginBottom: 24,
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
  loadingText: {
    marginTop: 16,
    color: theme.colors.ui.textSecondary,
    fontSize: 16,
  },
}); 