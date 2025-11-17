import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StickySearchHeader from './StickySearchHeader';

interface StickyHeaderWrapperProps {
  scrollY: Animated.Value;
  onFilters: () => void;
  onSearchPress: () => void;
}

export function StickyHeaderWrapper({ scrollY, onFilters, onSearchPress }: StickyHeaderWrapperProps) {
  const opacity = scrollY.interpolate({
    inputRange: [0, 80, 120],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="auto">
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.content}>
          <StickySearchHeader onFilters={onFilters} onSearchPress={onSearchPress} />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  content: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
});


