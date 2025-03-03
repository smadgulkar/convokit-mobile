import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, Animated } from 'react-native';
import { router, Stack } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { contexts } from '../../constants/contexts';
import theme from '../../constants/theme';

export default function ContextSelection() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "ConvoKit" }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY }]
            }
          ]}>
            <Text style={styles.title}>Choose a Context</Text>
            <Text style={styles.subtitle}>
              Select a conversation context to get started
            </Text>
          </Animated.View>
          
          <View style={styles.grid}>
            {contexts.map((context, index) => (
              <Animated.View
                key={context.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{ 
                    translateY: translateY.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 15 * (index + 1)]
                    }) 
                  }]
                }}
              >
                <Card
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
              </Animated.View>
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
    backgroundColor: theme.colors.ui.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing[6],
  },
  header: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[2],
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.ui.textSecondary,
    marginBottom: theme.spacing[4],
  },
  grid: {
    padding: theme.spacing[4],
    paddingTop: 0,
  },
}); 