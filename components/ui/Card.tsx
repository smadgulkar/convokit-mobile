import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CardProps {
  onPress: () => void;
  title: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  onPress,
  title,
  description,
  icon,
  iconColor = '#000',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <View style={styles.iconContainer}>
          <Feather name={icon} size={24} color={iconColor} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  description: {
    fontSize: 14,
    color: '#687076',
    marginTop: 4,
  },
}); 