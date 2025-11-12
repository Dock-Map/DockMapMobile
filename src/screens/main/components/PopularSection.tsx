import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ClubSeatsBadge from '@/src/shared/components/ClubSeatsBadge';
import FavoriteToggleButton from '@/src/shared/components/FavoriteToggleButton';

import { PopularClub } from '../types';

interface PopularSectionProps {
  clubs: PopularClub[];
  onClubPress: (clubId: string) => void;
  favoriteIds?: Set<string>;
  onFavoritePress?: (clubId: string) => void;
}

const PopularSection: React.FC<PopularSectionProps> = ({ clubs, onClubPress, favoriteIds, onFavoritePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Популярные яхт-клубы</Text>
      </View>

      <View style={styles.grid}>
        {clubs.map((club) => (
          <TouchableOpacity
            key={club.id}
            onPress={() => onClubPress(club.id)}
            style={styles.card}
            activeOpacity={0.9}
          >
            <View style={styles.cardMedia}>
              <View style={styles.cardTopRow}>
                <FavoriteToggleButton
                  active={favoriteIds?.has(club.id)}
                  onPress={() => onFavoritePress?.(club.id)}
                />
              </View>
              <ClubSeatsBadge
                occupied={club.occupiedSeats}
                total={club.totalSeats}
                variant="light"
                style={styles.cardBadge}
              />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>{club.name}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">
                  {club.address}
                </Text>
              </View>
              <Text style={styles.cardPrice}>{club.priceFrom}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 24,
    color: '#071013',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -4,
  },
  card: {
    flexBasis: '48%',
    maxWidth: '48%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
    marginBottom: 8,
    marginHorizontal: 4,
  },
  cardMedia: {
    height: 152,
    backgroundColor: '#D8E4F7',
    padding: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  cardBadge: {
    alignSelf: 'flex-start',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  cardTextBlock: {
    gap: 6,
  },
  cardTitle: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#1A1A1A',
  },
  cardSubtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
  },
  cardPrice: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#00A8A0',
  },
});

export default PopularSection;
