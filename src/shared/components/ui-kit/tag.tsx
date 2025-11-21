import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';


interface TagProps {
  children: React.ReactNode;
  state?: "default" | "active" | "disabled";
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Tag: React.FC<TagProps> = ({
  children,
  state = "default",
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  const containerStyleFromState = {};
  const textStyleFromState = {};

  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          containerStyleFromState,
          style,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {typeof children === 'string' ? (
          <Text style={[styles.text, textStyleFromState, textStyle]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, containerStyleFromState, style]}>
      {typeof children === 'string' ? (
        <Text style={[styles.text, textStyleFromState, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default Tag;
