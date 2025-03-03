import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Card } from '../../../components/ui/Card';
import { contexts } from '../../../constants/contexts';

export default function CategorySelection() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const context = contexts.find((c) => c.id === id);

  if (!context) return null;

  return (
    <>
      <Stack.Screen options={{ title: "Choose Category" }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.grid}>
            {context.categories.map((category) => (
              <Card
                key={category.id}
                title={category.label}
                onPress={() => router.push({
                  pathname: '/(tabs)/question',
                  params: { prompt: category.prompt }
                })}
              />
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
    backgroundColor: '#f4f4f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  grid: {
    padding: 16,
  },
}); 