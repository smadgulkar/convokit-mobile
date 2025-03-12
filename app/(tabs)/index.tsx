import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  Animated, 
  TouchableOpacity, 
  Platform, 
  Alert, 
  Image, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { contexts } from '../../constants/contexts';
import theme from '../../constants/theme';
import { useAuth, UserTier } from '../../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';

type FontWeight = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined;

export default function ContextSelection() {
  const { profile, session, setProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  
  // Fetch user profile from Supabase
  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);
  
  const fetchProfile = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      // First try to get the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        
        // Only create a profile if it doesn't exist (PGRST116 error)
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: session.user.id, 
                email: session.user.email, 
                tier: 'free', 
                daily_generations_left: 5 
              }
            ])
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
            Alert.alert(
              'Profile Error',
              'There was an error creating your profile. Please try again later.',
              [{ text: 'OK' }]
            );
          } else {
            console.log('Profile created successfully:', newProfile);
            // Update the AuthContext profile state
            setProfile({
              id: newProfile.id,
              email: newProfile.email,
              tier: newProfile.tier as UserTier,
              dailyGenerationsLeft: newProfile.daily_generations_left,
            });
          }
        } else {
          // Handle other errors
          Alert.alert(
            'Error',
            'There was an error loading your profile. Please try again.',
            [{ text: 'OK' }]
          );
        }
      } else {
        console.log('Profile data:', data);
        // Update the AuthContext profile state
        setProfile({
          id: data.id,
          email: data.email,
          tier: data.tier as UserTier,
          dailyGenerationsLeft: data.daily_generations_left,
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // All users get all contexts
  const availableContexts = contexts.filter(context => {
    if (!profile) return true; // Show all contexts if profile isn't loaded yet
    
    // All users get all contexts
    return true;
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "ConvoKit",
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.ui.background,
          },
          headerShadowVisible: false,
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => router.push('/profile')}
              >
                <Feather name="user" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.welcomeSection,
              { opacity: fadeAnim, transform: [{ translateY: translateY }] }
            ]}
          >
            <Text style={styles.welcomeTitle} numberOfLines={1} ellipsizeMode="tail">
              Good {getTimeOfDay()}, {session?.user?.email?.split('@')[0] || 'there'}
            </Text>
            <Text style={styles.welcomeSubtitle} numberOfLines={2} ellipsizeMode="tail">
              What kind of conversation would you like help with today?
            </Text>
          </Animated.View>
          
          <View style={styles.grid}>
            {availableContexts.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="alert-circle" size={40} color={theme.colors.neutral[400]} />
                <Text style={styles.emptyStateTitle}>No contexts available</Text>
                <Text style={styles.emptyStateText}>
                  There are no conversation contexts available at the moment.
                  Please check back later.
                </Text>
              </View>
            ) : (
              <View>
                {availableContexts.map((context) => (
                  <Card
                    key={context.id}
                    title={context.label}
                    description={context.description}
                    icon={context.icon}
                    iconColor={context.color}
                    onPress={() => {
                      if (context.id === 'custom') {
                        router.push('/custom-context');
                      } else {
                        router.push(`/categories/${context.id}`);
                      }
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.ui.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  welcomeSection: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.ui.text,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: theme.colors.ui.textSecondary,
    lineHeight: 20,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 8,
    backgroundColor: theme.colors.primary[500],
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.ui.textSecondary,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 32,
    backgroundColor: theme.colors.ui.card,
    borderRadius: 12,
    ...theme.shadows.sm,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.ui.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.ui.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
}); 