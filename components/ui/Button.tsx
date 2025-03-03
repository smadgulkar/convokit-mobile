import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
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
          disabled && styles.disabled,
          fullWidth && styles.fullWidth,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'default' ? '#fff' : theme.colors.primary[500]} 
          />
        ) : (
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
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[500],
  },
  smButton: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
  },
  mdButton: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
  },
  lgButton: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  icon: {
    marginRight: theme.spacing[2],
    color: '#fff',
  },
  nonDefaultIcon: {
    color: theme.colors.primary[500],
  },
  label: {
    color: '#fff',
    fontWeight: theme.typography.fontWeight.medium,
  },
  smLabel: {
    fontSize: theme.typography.fontSize.sm,
  },
  mdLabel: {
    fontSize: theme.typography.fontSize.base,
  },
  lgLabel: {
    fontSize: theme.typography.fontSize.lg,
  },
  nonDefaultLabel: {
    color: theme.colors.primary[500],
  },
});