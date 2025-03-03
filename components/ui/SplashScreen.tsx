import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../constants/theme';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Feather name="message-circle" size={60} color={theme.colors.primary[500]} />
      </View>
      <Text style={styles.title}>ConvoKit</Text>
      <Text style={styles.subtitle}>Better conversations start here</Text>
      <ActivityIndicator 
        style={styles.loader} 
        size="small" 
        color={theme.colors.primary[500]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.ui.background,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.ui.textSecondary,
    marginBottom: theme.spacing[8],
  },
  loader: {
    marginTop: theme.spacing[4],
  }
}); 