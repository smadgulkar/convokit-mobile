import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { testSupabaseConnection } from '../lib/supabase';
import { Alert } from 'react-native';

// Define user profile type
type UserProfile = {
  id: string;
  email: string;
};

// Define auth context type
type AuthContextType = {
  session: any;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setProfile: (profile: UserProfile | null | ((prev: UserProfile | null) => UserProfile | null)) => void;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (data.session) {
          setSession(data.session);
          
          // Try to get the user's profile
          await fetchAndCreateProfileIfNeeded(data.session.user.id, data.session.user.email);
        }
      } catch (error) {
        console.error('Unexpected error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      
      if (newSession) {
        await fetchAndCreateProfileIfNeeded(newSession.user.id, newSession.user.email);
      } else {
        setProfile(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Function to fetch profile or create it if it doesn't exist
  const fetchAndCreateProfileIfNeeded = async (userId: string, email: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Try to get the profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (fetchError) {
        console.log('Profile not found, creating one...');
        
        // Create a profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, email: email }])
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          
          // Set a default profile in memory even if DB creation failed
          setProfile({ id: userId, email: email });
        } else {
          console.log('Profile created successfully:', newProfile);
          setProfile({ id: userId, email: email });
        }
      } else {
        console.log('Profile found:', existingProfile);
        setProfile({ id: userId, email: email });
      }
    } catch (error) {
      console.error('Error in fetchAndCreateProfileIfNeeded:', error);
      
      // Set a default profile in memory as fallback
      setProfile({ id: userId, email: email });
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with:', email);
      setLoading(true);
      
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
      
      // Fetch or create profile
      if (data.session) {
        await fetchAndCreateProfileIfNeeded(data.session.user.id, email);
      }
      
      return { error: undefined };
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // First check if the user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);
        
      if (checkError) {
        console.error('Error checking existing user:', checkError);
      } else if (existingUsers && existingUsers.length > 0) {
        return { error: { message: 'A user with this email already exists' } };
      }
      
      // Create the user in auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Error signing up:', error);
        return { error };
      }
      
      if (!data.user) {
        return { error: { message: 'Failed to create user' } };
      }
      
      // Wait a moment to ensure auth is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a profile for the new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, email }]);
      
      if (profileError) {
        console.error('Error creating profile during signup:', profileError);
      }
      
      // Set profile in state
      setProfile({ id: data.user.id, email });
      
      return { error: undefined };
    } catch (error: any) {
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
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

  // Add the fetchProfile function to the provider
  const fetchProfile = async () => {
    if (!session) return;
    
    try {
      console.log('Manually refreshing profile for user:', session.user.id);
      
      // Get the latest profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error refreshing profile:', error);
      } else if (data) {
        console.log('Profile refreshed:', data);
        setProfile({ id: session.user.id, email: session.user.email });
      }
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
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
        fetchProfile,
        setProfile,
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