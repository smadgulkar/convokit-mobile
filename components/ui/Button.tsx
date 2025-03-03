import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ButtonProps {
  onPress: () => void;
  label: string;
  icon?: string;
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  icon,
  variant = 'default',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'outline' && styles.outlineButton,
        variant === 'ghost' && styles.ghostButton,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <Feather name={icon} size={20} style={styles.icon} />}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 8,
    color: '#fff',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});