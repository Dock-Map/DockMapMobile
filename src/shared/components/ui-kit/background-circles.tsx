import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle, Image } from 'react-native';

interface BackgroundCirclesProps {
  variant?: 'welcome' | 'search' | 'services';
  style?: ViewStyle;
}

const BackgroundCircles: React.FC<BackgroundCirclesProps> = ({
  variant = 'welcome',
  style,
}) => {
  const getCircleStyle = () => {
    switch (variant) {
      case 'welcome':
        return {
          position: 'absolute' as const,
          left: -33,
          top: 94,
          width: 440,
          height: 440,
        };
      case 'search':
        return {
          position: 'absolute' as const,
          left: -80,
          top: -20,
          width: 440,
          height: 440,
        };
      case 'services':
        return {
          position: 'absolute' as const,
          left: 80,
          top: 120,
          width: 440,
          height: 440,
        };
      default:
        return {};
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../../../assets/images/bg-onbording.png')}
        style={[styles.circle, getCircleStyle()]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',


    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

  },
  circle: {
    borderRadius: 220,
    opacity: 0.6,
  },

});

export default BackgroundCircles;
