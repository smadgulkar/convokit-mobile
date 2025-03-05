import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { testSupabaseConnection } from '../lib/supabase';

// Define user tiers
export enum UserTier {
  FREE = 'free',
  PREMIUM = 'premium',
}

// Define user profile type
type UserProfile = {
  id: string;
  email: string;
  tier: UserTier;
  dailyGenerationsLeft: number;
};

// Define auth context type
type AuthContextType = {
  session: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
  canAccessPremiumFeature: (feature: string) => boolean;
  decrementDailyGenerations: () => Promise<boolean>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const mockUser: UserProfile = {
  id: '123',
  email: 'test@example.com',
  tier: UserTier.FREE,
  dailyGenerationsLeft: 5,
};

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null); // Start with null
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        // If we have a session, set the mock profile
        if (data.session) {
          setProfile(mockUser);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Mock auth functions
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with:', email);
      setLoading(true);
      
      // Test connection first
      const testResult = await testSupabaseConnection();
      console.log('Connection test result:', testResult);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in result:', { data, error });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      setSession(data.session);
      setProfile({
        id: data.session?.user.id || '123',
        email,
        tier: UserTier.FREE,
        dailyGenerationsLeft: 5,
      });
      
      return { error: undefined };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      setSession(data.session);
      setProfile({
        id: data.session?.user.id || '123',
        email,
        tier: UserTier.FREE,
        dailyGenerationsLeft: 5,
      });
      
      return { error: undefined };
    } catch (error: any) {
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add the missing function
  const canAccessPremiumFeature = (feature: string) => {
    if (!profile) return false;
    return profile.tier === UserTier.PREMIUM;
  };

  // Fix the decrementDailyGenerations function to return a Promise<boolean>
  const decrementDailyGenerations = async (): Promise<boolean> => {
    if (!profile) return false;
    
    if (profile.tier === UserTier.PREMIUM) {
      return true; // Premium users have unlimited generations
    }
    
    if (profile.dailyGenerationsLeft > 0) {
      setProfile({
        ...profile,
        dailyGenerationsLeft: profile.dailyGenerationsLeft - 1,
      });
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        canAccessPremiumFeature,
        decrementDailyGenerations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 