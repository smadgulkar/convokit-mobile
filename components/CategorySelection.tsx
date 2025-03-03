import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from './ui/Card';
import { contexts } from '../src/constants/contexts';

type RootStackParamList = {
  Categories: { contextId: string };
  Question: { prompt: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RoutePropType = RouteProp<RootStackParamList, 'Categories'>;

export default function CategorySelection() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const context = contexts.find((c) => c.id === route.params.contextId);

  if (!context) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {context.categories.map((category) => (
            <Card
              key={category.id}
              title={category.label}
              onPress={() => navigation.navigate('Question', { prompt: category.prompt })}
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