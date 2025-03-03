import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

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
  iconColor = theme.colors.neutral[900],
  disabled = false,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const gradientColors = [
    iconColor + '10',
    iconColor + '20',
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
            <Feather name={icon} size={24} color={iconColor} />
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.ui.card,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.neutral[100],
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[4],
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.ui.text,
    marginBottom: theme.spacing[1],
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.ui.textSecondary,
  },
}); 