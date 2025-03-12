import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import theme from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary[600],
        tabBarInactiveTintColor: theme.colors.neutral[400],
        tabBarStyle: {
          backgroundColor: theme.colors.ui.card,
          borderTopColor: theme.colors.ui.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.ui.card,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="custom-context"
        options={{
          title: 'Custom',
          tabBarIcon: ({ color }) => <Feather name="edit" size={22} color={color} />,
          href: null, // Hide this tab but keep the screen
        }}
      />
      <Tabs.Screen
        name="categories/[id]"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Feather name="list" size={22} color={color} />,
          href: null, // Hide this tab but keep the screen
        }}
      />
      <Tabs.Screen
        name="question"
        options={{
          title: 'Question',
          tabBarIcon: ({ color }) => <Feather name="message-circle" size={22} color={color} />,
          href: null, // Hide this tab but keep the screen
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color }) => <Feather name="message-square" size={22} color={color} />,
          href: null, // Hide this tab but keep the screen
        }}
      />
    </Tabs>
  );
}
