import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useTheme } from '../../use-theme';
import { EyeIcon, EyeShowIcon, LockKeyIcon, MailIcon, SearchIcon, UserIcon, XCircle20Icon } from '../icons';

interface InputProps extends Omit<TextInputProps, 'style'> {
  state?: 'default' | 'error' | 'success' | 'disabled' | 'active' | 'filled';
  type?: 'base' | 'search' | 'mail' | 'password' | 'name';
  icon?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  clearable?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({
  state = 'default',
  type = 'base',
  icon,
  placeholder,
  value,
  onChangeText,
  onFocus,
  onBlur,
  clearable = false,
  onClear,
  disabled = false,
  style,
  inputStyle,
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const { colors, fonts, weights, sizes } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

 
  const hasValue = value && value.length > 0;
  
  const inputState = disabled 
    ? 'disabled' 
    : isFocused 
      ? 'active' 
      : (state !== 'default' && state !== 'filled') 
        ? state 
        : hasValue 
          ? 'filled' 
          : 'default';
  
  // Определяем свойства в зависимости от типа
  const isPasswordType = type === 'password';
  const shouldShowPasswordToggle = isPasswordType;
  const actualSecureTextEntry = isPasswordType ? !showPassword : secureTextEntry;
  
  // Автоматически включаем clearable для определенных типов
  const shouldBeClearable = clearable || type === 'search' || type === 'mail' || type === 'name';

  const getInputStyle = () => {
    // Точные цвета из Figma
    if (inputState === 'disabled') {
      return {
        backgroundColor: colors.grey100, // #EFF3F8
        borderColor: 'transparent',
        color: colors.grey500, // #A1B0CA
      };
    }
    if (inputState === 'error') {
      return {
        backgroundColor: colors.white,
        borderColor: colors.red,
        color: colors.black,
      };
    }
    if (inputState === 'active') {
      return {
        backgroundColor: colors.white, // #FFFFFF
        borderColor: 'transparent',
        color: colors.black,
      };
    }
    if (inputState === 'filled') {
      return {
        backgroundColor: colors.grey200, 
        borderColor: 'transparent',
        color: colors.black,
      };
    }
    // Default state
    return {
      backgroundColor: colors.grey200, // #EAF0F6
      borderColor: 'transparent',
      color: colors.grey500, // #A1B0CA 
    };
  };

  const inputStyleFromState = getInputStyle();
  
  // Обработчики событий
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };
  
  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };
  
  const shouldShowClear = shouldBeClearable && value && value.length > 0 && !disabled && inputState !== 'filled';
  
  const getLeftIcon = () => {
    if (icon) return null; 
    
    switch (type) {
      case 'mail':
        return <MailIcon width={20} height={20} color={colors.grey500} />;
      case 'password':
        return <LockKeyIcon width={20} height={20} color={colors.grey500} />;
      case 'search':
        return <SearchIcon width={20} height={20} color={colors.grey500} />;
      case 'name':
        return <UserIcon width={20} height={20} color={colors.grey500} />;
      default:
        return null;
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, inputStyleFromState, style]}>
        {/* Иконка слева */}
        {(getLeftIcon() || icon) && (
          <View style={styles.iconContainer}>
            {getLeftIcon()}
          </View>
        )}
        
        {/* Поле ввода */}
        <TextInput
          style={[
            styles.textInput,
            {
              fontFamily: fonts.text3,
              fontWeight: weights.normal,
              fontSize: 16, 
              color: inputStyleFromState.color,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.grey500} // #A1B0CA
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          secureTextEntry={actualSecureTextEntry}
          autoCapitalize={type === 'mail' ? 'none' : 'sentences'}
          keyboardType={type === 'mail' ? 'email-address' : 'default'}
          {...props}
        />
        
        {/* Правые кнопки */}
        <View style={styles.rightButtonsContainer}>
          {/* Кнопка показа/скрытия пароля */}
          {shouldShowPasswordToggle && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={togglePasswordVisibility}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeIcon width={20} height={20} color={colors.grey500} />
              ) : (
                <EyeShowIcon width={20} height={20} color={colors.grey500} />
              )}
            </TouchableOpacity>
          )}
          
          {/* Кнопка очистки (16x16 как в Figma) */}
          {shouldShowClear && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <XCircle20Icon width={16} height={16} color={colors.grey200} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56, 
    paddingHorizontal: 16, 
    borderRadius: 16, 
    gap: 12, 
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20, 
    height: 20,
  },
  textInput: {
    flex: 1,
    textAlignVertical: 'center',
    paddingVertical: 0,
    margin: 0,
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  clearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 16, 
    height: 16,
    padding: 10, 
  },
});

export default Input;
