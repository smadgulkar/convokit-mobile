import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../constants/theme';

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
  iconColor = theme.colors.primary[500],
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

  // Convert string icon names to Feather icon names
  const getIconName = (iconStr: string) => {
    // Map emoji or text to Feather icon names
    const iconMap: {[key: string]: string} = {
      '📱': 'smartphone',
      '👥': 'users',
      '💼': 'briefcase',
      '❤️': 'heart',
      '🏠': 'home',
      '✏️': 'edit',
    };
    
    return iconMap[iconStr] || iconStr;
  };

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
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
            <Feather name={getIconName(icon)} size={24} color={iconColor} />
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
    padding: 16,
    backgroundColor: theme.colors.ui.card,
    borderRadius: 12,
    ...theme.shadows.md,
    marginBottom: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.ui.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: theme.colors.ui.textSecondary,
  },
}); 