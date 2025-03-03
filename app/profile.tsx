import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { useAuth, UserTier } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Feather } from '@expo/vector-icons';
import theme from '../constants/theme';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  
  const isPremium = profile?.tier === UserTier.PREMIUM;
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Your Profile" }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Feather name="user" size={40} color={theme.colors.primary[500]} />
          </View>
          <Text style={styles.email}>{profile?.email}</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>
              {isPremium ? 'Premium' : 'Free'} Account
            </Text>
          </View>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.dailyGenerationsLeft || 0}</Text>
            <Text style={styles.statLabel}>Generations Left Today</Text>
          </View>
          
          {!isPremium && (
            <View style={styles.upgradeSection}>
              <Text style={styles.upgradeText}>
                Upgrade to premium for unlimited generations and access to all features.
              </Text>
              <Button 
                label="Upgrade to Premium" 
                onPress={() => router.push('/upgrade')}
                fullWidth
              />
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={signOut}
        >
          <Feather name="log-out" size={20} color={theme.colors.semantic.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.ui.background,
  },
  content: {
    padding: theme.spacing[4],
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  email: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[2],
  },
  tierBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.primary[100],
    borderRadius: theme.borderRadius.full,
  },
  tierText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary[700],
  },
  statsCard: {
    backgroundColor: theme.colors.ui.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    ...theme.shadows.sm,
  },
  statItem: {
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  statValue: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.ui.textSecondary,
  },
  upgradeSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
    paddingTop: theme.spacing[4],
  },
  upgradeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[3],
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.semantic.error,
    borderRadius: theme.borderRadius.md,
  },
  signOutText: {
    marginLeft: theme.spacing[2],
    color: theme.colors.semantic.error,
    fontWeight: theme.typography.fontWeight.medium,
  },
}); 