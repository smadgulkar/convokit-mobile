import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { contexts } from '../../constants/contexts';

export default function ContextSelection() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {contexts.map((context) => (
            <Card
              key={context.id}
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
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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