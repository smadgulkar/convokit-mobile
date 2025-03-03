import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  decrementDailyGenerations: () => void;
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
  const [profile, setProfile] = useState<UserProfile | null>(mockUser);
  const [loading, setLoading] = useState(false);

  // Mock auth functions
  const signIn = async (email: string, password: string) => {
    setSession({ user: { id: '123', email } });
    setProfile({
      id: '123',
      email,
      tier: UserTier.FREE,
      dailyGenerationsLeft: 5,
    });
    return { error: undefined };
  };

  const signUp = async (email: string, password: string) => {
    setSession({ user: { id: '123', email } });
    setProfile({
      id: '123',
      email,
      tier: UserTier.FREE,
      dailyGenerationsLeft: 5,
    });
    return { error: undefined };
  };

  const signOut = async () => {
    setSession(null);
    setProfile(null);
  };

  // Add the missing function
  const canAccessPremiumFeature = (feature: string) => {
    if (!profile) return false;
    return profile.tier === UserTier.PREMIUM;
  };

  // Add the missing function
  const decrementDailyGenerations = () => {
    if (profile && profile.dailyGenerationsLeft > 0) {
      setProfile({
        ...profile,
        dailyGenerationsLeft: profile.dailyGenerationsLeft - 1,
      });
    }
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