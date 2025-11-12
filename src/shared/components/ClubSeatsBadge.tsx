import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { AnchorBadgeIcon } from '@/src/shared/components/icons';

type ClubSeatsBadgeVariant = 'light' | 'dark';

interface ClubSeatsBadgeProps {
  occupied: number | string;
  total: number | string;
  totalLabel?: string;
  variant?: ClubSeatsBadgeVariant;
  style?: StyleProp<ViewStyle>;
  occupiedTextStyle?: StyleProp<TextStyle>;
  totalTextStyle?: StyleProp<TextStyle>;
}

const ICON_SIZE = 16;

const ClubSeatsBadge: React.FC<ClubSeatsBadgeProps> = ({
  occupied,
  total,
  totalLabel = 'мест',
  variant = 'light',
  style,
  occupiedTextStyle,
  totalTextStyle,
}) => {
  const isLight = variant === 'light';

  return (
    <View style={[styles.base, isLight ? styles.light : styles.dark, style]}>
      <AnchorBadgeIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        fillColor={isLight ? '#0097E0' : '#EFF3F8'}
        iconColor={isLight ? '#FFFFFF' : '#5A6E8A'}
      />
      <Text
        style={[
          styles.occupiedBase,
          isLight ? styles.occupiedLight : styles.occupiedDark,
          occupiedTextStyle,
        ]}
      >
        {occupied}
      </Text>
      <Text
        style={[
          styles.totalBase,
          isLight ? styles.totalLight : styles.totalDark,
          totalTextStyle,
        ]}
      >
        {`/ ${total} ${totalLabel}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  light: {
    backgroundColor: '#FFFFFF',
  },
  dark: {
    backgroundColor: '#EFF3F8',
  },
  occupiedBase: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  },
  occupiedLight: {
    color: '#19A7E9',
  },
  occupiedDark: {
    color: '#5A6E8A',
  },
  totalBase: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  },
  totalLight: {
    color: '#7E8EA0',
  },
  totalDark: {
    color: '#5A6E8A',
  },
});

export default ClubSeatsBadge;


