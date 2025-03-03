import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function TabLayout() {
  const [fontsLoaded, error] = useFonts({
    // Add any custom fonts here if needed
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Choose Context" }} />
        <Stack.Screen name="categories/[id]" options={{ title: "Choose Category" }} />
        <Stack.Screen name="question" options={{ title: "Conversation Guide" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
