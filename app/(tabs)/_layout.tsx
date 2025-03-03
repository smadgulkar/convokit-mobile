import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import theme from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary[600],
        tabBarInactiveTintColor: theme.colors.neutral[400],
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral[200],
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Feather name="compass" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories/[id]"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => <Feather name="grid" size={22} color={color} />,
          href: null, // Hide this tab
        }}
      />
      <Tabs.Screen
        name="question"
        options={{
          title: "Conversation",
          tabBarIcon: ({ color }) => <Feather name="message-square" size={22} color={color} />,
          href: null, // Hide this tab
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
          tabBarIcon: ({ color }) => <Feather name="users" size={22} color={color} />,
          href: null, // Hide this tab
        }}
      />
      <Tabs.Screen
        name="custom-context"
        options={{
          title: "Custom",
          tabBarIcon: ({ color }) => <Feather name="edit-3" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
