import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Feather } from '@expo/vector-icons';
import theme from '../constants/theme';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp } = useAuth();
  
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signUp(email, password);
      
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.ui.text} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join ConvoKit to improve your conversation skills</Text>
        
        <View style={styles.freeSection}>
          <Text style={styles.freeSectionTitle}>Free Account Includes:</Text>
          
          <View style={styles.freeTierItem}>
            <Feather name="check" size={18} color={theme.colors.semantic.success} style={styles.checkIcon} />
            <Text style={styles.freeTierText}>5 conversation starters per day</Text>
          </View>
          
          <View style={styles.freeTierItem}>
            <Feather name="check" size={18} color={theme.colors.semantic.success} style={styles.checkIcon} />
            <Text style={styles.freeTierText}>Access to texting and social contexts</Text>
          </View>
          
          <View style={styles.freeTierItem}>
            <Feather name="x" size={18} color={theme.colors.neutral[400]} style={styles.checkIcon} />
            <Text style={styles.freeTierTextDisabled}>Practice conversations (Premium only)</Text>
          </View>
          
          <View style={styles.freeTierItem}>
            <Feather name="x" size={18} color={theme.colors.neutral[400]} style={styles.checkIcon} />
            <Text style={styles.freeTierTextDisabled}>All conversation contexts (Premium only)</Text>
          </View>
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
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <Button 
            label="Create Account" 
            onPress={handleRegister} 
            loading={loading}
            fullWidth
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
  },
  backButton: {
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.ui.textSecondary,
    marginBottom: theme.spacing[4],
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing[6],
  },
  footerText: {
    color: theme.colors.ui.textSecondary,
    marginRight: theme.spacing[1],
  },
  signInText: {
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  freeSection: {
    backgroundColor: theme.colors.ui.card,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[4],
    ...theme.shadows.sm,
  },
  freeSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[3],
  },
  freeTierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  checkIcon: {
    marginRight: theme.spacing[2],
  },
  freeTierText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.ui.text,
  },
  freeTierTextDisabled: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[400],
  },
}); 