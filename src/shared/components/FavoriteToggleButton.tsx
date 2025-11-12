import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

import { HeartIcon } from '@/src/shared/components/icons';

type FavoriteToggleButtonProps = {
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const FavoriteToggleButton: React.FC<FavoriteToggleButtonProps> = ({ active = false, onPress, style }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#071013',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      },
      style,
    ]}
    accessibilityRole="button"
  >
    <HeartIcon color={active ? '#19A7E9' : '#CDD5DF'} />
  </TouchableOpacity>
);

export default FavoriteToggleButton;

