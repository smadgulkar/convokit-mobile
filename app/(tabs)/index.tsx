import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, Animated, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { contexts } from '../../constants/contexts';
import theme from '../../constants/theme';
import { useAuth, UserTier } from '../../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';

type FontWeight = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined;

export default function ContextSelection() {
  const { profile } = useAuth();
  
  // Filter contexts based on user tier
  const availableContexts = contexts.filter(context => {
    if (!profile) return false;
    
    if (profile.tier === UserTier.PREMIUM) {
      return true; // Premium users get all contexts
    }
    
    // Free users only get texting and social contexts
    return ['texting', 'social'].includes(context.id);
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
  }, []);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "ConvoKit",
          headerRight: () => (
            <View style={styles.headerRight}>
              <View style={styles.generationsCounter}>
                <Feather name="zap" size={14} color={theme.colors.primary[500]} />
                <Text style={styles.generationsText}>{profile?.dailyGenerationsLeft || 0} left</Text>
              </View>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => router.push('/profile')}
              >
                <Feather name="user" size={20} color={theme.colors.primary[600]} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY }]
            }
          ]}>
            <Text style={styles.title}>Choose a Context</Text>
            <Text style={styles.subtitle}>
              Select a conversation context to get started
            </Text>
          </Animated.View>
          
          <View style={styles.grid}>
            {availableContexts.map((context, index) => (
              <Animated.View
                key={context.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{ 
                    translateY: translateY.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 15 * (index + 1)]
                    }) 
                  }]
                }}
              >
                <Card
                  title={context.label}
                  description={context.description}
                  icon={context.icon}
                  iconColor={context.color}
                  onPress={() => {
                    if (context.id === 'custom') {
                      router.push('/(tabs)/custom-context');
                    } else {
                      router.push(`/(tabs)/categories/${context.id}`);
                    }
                  }}
                />
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.ui.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing[6],
  },
  header: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[2],
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold as FontWeight,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.ui.textSecondary,
    marginBottom: theme.spacing[4],
  },
  grid: {
    padding: theme.spacing[4],
    paddingTop: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generationsCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing[2],
  },
  generationsText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary[500],
  },
  profileButton: {
    padding: theme.spacing[1],
  },
}); 