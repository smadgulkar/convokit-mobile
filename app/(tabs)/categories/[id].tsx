import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Card } from '../../../components/ui/Card';
import { contexts } from '../../../constants/contexts';
import { Feather } from '@expo/vector-icons';

// Define conversation goals
const conversationGoals = [
  { id: 'any', label: 'Any Goal' },
  { id: 'rapport', label: 'Build Rapport' },
  { id: 'common-ground', label: 'Find Common Ground' },
  { id: 'learn', label: 'Learn Something New' },
  { id: 'resolve', label: 'Resolve a Disagreement' },
  { id: 'fun', label: 'Just Have Fun' },
];

export default function CategorySelection() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const context = contexts.find((c) => c.id === id);
  const [selectedGoal, setSelectedGoal] = useState(conversationGoals[0]);
  const [modalVisible, setModalVisible] = useState(false);

  if (!context) return null;

  return (
    <>
      <Stack.Screen options={{ title: "Choose Category" }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.goalSelector}>
          <Text style={styles.goalLabel}>Conversation Goal:</Text>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>{selectedGoal.label}</Text>
            <Feather name="chevron-down" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.grid}>
            {context.categories.map((category) => (
              <Card
                key={category.id}
                title={category.label}
                onPress={() => router.push({
                  pathname: '/(tabs)/question',
                  params: { 
                    prompt: `${category.prompt} The conversation goal is to ${
                      selectedGoal.id === 'any' 
                        ? 'have a good conversation' 
                        : selectedGoal.label.toLowerCase()
                    }.` 
                  }
                })}
              />
            ))}
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select a Goal</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Feather name="x" size={24} color="#374151" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={conversationGoals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.goalItem,
                      selectedGoal.id === item.id && styles.selectedGoalItem
                    ]}
                    onPress={() => {
                      setSelectedGoal(item);
                      setModalVisible(false);
                    }}
                  >
                    <Text 
                      style={[
                        styles.goalItemText,
                        selectedGoal.id === item.id && styles.selectedGoalItemText
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selectedGoal.id === item.id && (
                      <Feather name="check" size={20} color="#3B82F6" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
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
  goalSelector: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedGoalItem: {
    backgroundColor: '#f0f9ff',
  },
  goalItemText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedGoalItemText: {
    fontWeight: '500',
    color: '#3B82F6',
  },
}); 