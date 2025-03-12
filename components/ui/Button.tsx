import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../constants/theme';

interface ButtonProps {
  onPress: () => void;
  label: string;
  icon?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
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

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={variant === 'default' ? '#fff' : theme.colors.primary[500]} 
        />
      );
    }

    return (
      <>
        {icon && <Feather name={icon} size={size === 'sm' ? 16 : 20} style={[
          styles.icon, 
          variant !== 'default' && styles.nonDefaultIcon
        ]} />}
        <Text style={[
          styles.label, 
          styles[`${size}Label`],
          variant !== 'default' && styles.nonDefaultLabel
        ]}>
          {label}
        </Text>
      </>
    );
  };

  return (
    <Animated.View style={[
      fullWidth && styles.fullWidth,
      { transform: [{ scale: scaleAnim }] }
    ]}>
      <TouchableOpacity
        style={[
          styles.button,
          styles[`${size}Button`],
          variant === 'outline' && styles.outlineButton,
          variant === 'ghost' && styles.ghostButton,
          disabled && styles.disabledButton,
          fullWidth && styles.fullWidth,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.primary[500],
  },
  smButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mdButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  lgButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  icon: {
    marginRight: 8,
    color: '#fff',
  },
  nonDefaultIcon: {
    color: theme.colors.primary[500],
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
  },
  smLabel: {
    fontSize: 14,
  },
  mdLabel: {
    fontSize: 16,
  },
  lgLabel: {
    fontSize: 18,
  },
  nonDefaultLabel: {
    color: theme.colors.primary[500],
  },
});