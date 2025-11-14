import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GroupIcon } from '@/src/shared/components/icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface EmptySearchStateProps {
  total?: number;
  message?: string;
  subtitle?: string;
  onSortPress?: () => void;
}

const EmptySearchState: React.FC<EmptySearchStateProps> = ({
  total = 0,
  message = 'Ничего не найдено',
  subtitle = 'Попробуйте изменить запрос',
  onSortPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.countText}>Найдено клубов: {total}</Text>
        {onSortPress && (
          <TouchableOpacity onPress={onSortPress} activeOpacity={0.7}>
            <GroupIcon width={16} height={16} color="#071013" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.emptyContent}>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/bob.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{message}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#7E8EA0',
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: SCREEN_HEIGHT * 0.08,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 32,
    backgroundColor: '#EFF3F8',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 24,
    color: '#071013',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#465566',
    textAlign: 'center',
  },
});

export default EmptySearchState;

