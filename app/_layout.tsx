import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import theme from '../constants/theme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Root layout with auth provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

// Navigation with auth check
function RootLayoutNav() {
  const { session, loading } = useAuth();
  
  // Don't render anything until we've checked auth
  if (loading) return null;
  
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.ui.card,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: theme.colors.ui.text,
          },
          headerTintColor: theme.colors.primary[600],
          contentStyle: {
            backgroundColor: theme.colors.ui.background,
          },
          animation: 'slide_from_right',
        }}
      >
        {session ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen name="profile" options={{ title: "Your Profile" }} />
        <Stack.Screen name="upgrade" options={{ title: "Upgrade to Premium" }} />
      </Stack>
    </>
  );
} 