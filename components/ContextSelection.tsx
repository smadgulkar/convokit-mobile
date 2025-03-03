import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from './ui/Card';
import { contexts } from '../src/constants/contexts';

type RootStackParamList = {
  Categories: { contextId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ContextSelection() {
  const navigation = useNavigation<NavigationProp>();

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
              onPress={() => navigation.navigate('Categories', { contextId: context.id })}
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