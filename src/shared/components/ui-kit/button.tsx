import React, { useState } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../use-theme';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  type?: 'primary' | 'secondary' | 'text';
  state?: 'default' | 'press' | 'disabled';
  size?: 'small' | 'base';
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
    children,
  onPress,
  type = 'primary',
  state = 'default',
  size = 'base',
  icon,
  iconPosition = 'left',
  disabled = false,
    style,
  containerStyle,
  textStyle,
}) => {
  const { colors, fonts, weights, sizes } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  
  // Определяем стили кнопки на основе типа и состояния
  const getButtonStyle = () => {
    const buttonState = disabled ? 'disabled' : (isPressed ? 'press' : state);
    
    if (type === 'primary') {
      if (buttonState === 'disabled') {
        return {
          backgroundColor: colors.grey100, // #EFF3F8
          color: colors.grey500, // #A1B0CA
        };
      }
      if (buttonState === 'press') {
        return {
          backgroundColor: '#008FD2', 
          color: colors.white,
        };
      }
      return {
        backgroundColor: colors.primary500, // #19A7E9
        color: colors.white,
      };
    }
    
    if (type === 'secondary') {
      if (buttonState === 'disabled') {
        return {
          backgroundColor: colors.grey100,
          color: colors.grey500,
        };
      }
      return {
        backgroundColor: colors.grey100,
        color: colors.primary500,
      };
    }
    
    return {
      backgroundColor: 'transparent',
      color: colors.primary500,
    };
  };
  
  const buttonStyle = getButtonStyle();
  
  // Создаем стили для кнопки
  const buttonStyles = [
    styles.base,
    {
      backgroundColor: buttonStyle.backgroundColor,
      paddingVertical: size === 'small' ? 8 : 16,
      paddingHorizontal: 16,
      borderRadius: size === 'small' ? 100 : 16,
    },
    containerStyle || style,
  ];
  
  // Создаем стили для текста
  const textStyles = [
    styles.text,
    {
      color: buttonStyle.color,
      fontSize: size === 'small' ? 14 : 16,
      lineHeight: size === 'small' ? 20 : 24,
      fontWeight: weights.button,
      fontFamily: fonts.button,
      letterSpacing: 0, // Согласно Figma Button: 0px
    },
    textStyle,
  ];

  // Функция для рендера иконки
  const renderIcon = (position: 'left' | 'right') => {
    if (!icon || iconPosition !== position) return null;
    
    // Простой рендер иконки (пока без компонентов)
    return null;
  };

        return (
            <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
                disabled={disabled}
      activeOpacity={0.8}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      {renderIcon('left')}
      
      {typeof children === 'string' ? (
        <Text style={textStyles}>{children}</Text>
      ) : (
        children
      )}
      
      {renderIcon('right')}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    textAlign: 'center',
  },
});

export default Button;
