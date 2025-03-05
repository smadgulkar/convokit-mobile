import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hardcode these values for now
const SUPABASE_URL = 'https://qfwzawnswwrbotvdgvcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmd3phd25zd3dyYm90dmRndmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMzI3MTQsImV4cCI6MjA0NTgwODcxNH0.IjM56JJkPWEw0TzkvTGJqOcuvOJMynazxqilEr4GhT8';

// Use AsyncStorage instead of SecureStore for simplicity
const storageAdapter = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

// Create Supabase client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: storageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Add a debug function to test the client
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    console.log('Session data:', data);
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful!');
    }
    return { data, error };
  } catch (e) {
    console.error('Unexpected error testing Supabase:', e);
    return { data: null, error: e };
  }
} 