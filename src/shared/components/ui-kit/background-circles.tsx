import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

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
          position: 'absolute',
          left: -33,
          top: 94,
          width: 440,
          height: 440,
          backgroundColor: 'rgba(192, 237, 255, 0.3)',
        };
      case 'search':
        return {
          position: 'absolute',
          left: -80,
          top: -20,
          width: 440,
          height: 440,
          backgroundColor: 'rgba(25, 167, 233, 0.15)',
        };
      case 'services':
        return {
          position: 'absolute',
          left: 80,
          top: 120,
          width: 440,
          height: 440,
          backgroundColor: 'rgba(192, 237, 255, 0.3)',
        };
      default:
        return {};
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.circle, getCircleStyle()]} />
      <BlurView 
        intensity={100} 
        tint="light"
        style={[styles.blurOverlay, getCircleStyle()]} 
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
    shadowColor: '#19A7E9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 150,
    elevation: 0,
  },
  blurOverlay: {
    borderRadius: 220,
    opacity: 0.6,
  },
});

export default BackgroundCircles;
