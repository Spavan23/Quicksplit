import { Text, StyleSheet, Pressable, ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/colors';
import { ReactNode } from 'react';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: ReactNode;
};

export default function Button({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  icon
}: ButtonProps) {
  
  const getButtonStyle = () => {
    if (disabled) return [styles.button, styles.buttonDisabled];
    
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.buttonSecondary];
      case 'outline':
        return [styles.button, styles.buttonOutline];
      case 'danger':
        return [styles.button, styles.buttonDanger];
      default:
        return [styles.button, styles.buttonPrimary];
    }
  };
  
  const getTextStyle = () => {
    if (disabled) return [styles.buttonText, styles.buttonTextDisabled];
    
    switch (variant) {
      case 'outline':
        return [styles.buttonText, styles.buttonTextOutline];
      case 'secondary':
      case 'primary':
      case 'danger':
      default:
        return [styles.buttonText, styles.buttonTextPrimary];
    }
  };
  
  return (
    <Pressable 
      style={getButtonStyle()} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary[600] : colors.white} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary[500],
  },
  buttonSecondary: {
    backgroundColor: colors.navy[500],
  },
  buttonDanger: {
    backgroundColor: colors.error[600],
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  buttonDisabled: {
    backgroundColor: colors.gray[300],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: colors.white,
  },
  buttonTextOutline: {
    color: colors.primary[600],
  },
  buttonTextDisabled: {
    color: colors.gray[500],
  },
});