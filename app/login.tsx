import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Feather } from '@expo/vector-icons';
import theme from '../constants/theme';
import { testSupabaseConnection } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn } = useAuth();
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Feather name="message-circle" size={60} color={theme.colors.primary[500]} />
        </View>
        
        <Text style={styles.title}>Welcome to ConvoKit</Text>
        <Text style={styles.subtitle}>Sign in to access conversation starters and practice your communication skills</Text>
        
        <View style={styles.freeSection}>
          <Feather 
            name="info" 
            size={20} 
            color={theme.colors.primary[600]} 
            style={styles.infoIcon}
          />
          <Text style={styles.freeText}>
            ConvoKit is free to use! Create an account to get 5 conversation starters per day.
          </Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <Button 
            label="Sign In" 
            onPress={handleLogin} 
            loading={loading}
            fullWidth
          />
          
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => {/* Handle forgot password */}}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        
        <Button 
          label="Test Supabase Connection" 
          onPress={async () => {
            const result = await testSupabaseConnection();
            Alert.alert('Connection Test', JSON.stringify(result, null, 2));
          }}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.ui.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing[4],
    justifyContent: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing[4],
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.ui.text,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.ui.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
  },
  form: {
    marginBottom: theme.spacing[6],
  },
  inputGroup: {
    marginBottom: theme.spacing[4],
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[2],
  },
  input: {
    backgroundColor: theme.colors.ui.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[3],
    fontSize: theme.typography.fontSize.base,
  },
  errorText: {
    color: theme.colors.semantic.error,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing[4],
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: theme.spacing[4],
  },
  forgotPasswordText: {
    color: theme.colors.primary[600],
    fontSize: theme.typography.fontSize.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing[8],
  },
  footerText: {
    color: theme.colors.ui.textSecondary,
    marginRight: theme.spacing[1],
  },
  signUpText: {
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  freeSection: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[4],
  },
  infoIcon: {
    marginRight: theme.spacing[3],
    marginTop: 2,
  },
  freeText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[700],
    lineHeight: theme.typography.lineHeight.relaxed,
  },
}); 