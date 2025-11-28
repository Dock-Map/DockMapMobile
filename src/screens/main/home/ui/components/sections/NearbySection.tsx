import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AnchorIcon } from '@/src/shared/components/icons';
import FavoriteToggleButton from '@/src/shared/components/FavoriteToggleButton';
import ClubSeatsBadge from '@/src/shared/components/ClubSeatsBadge';

import { NearbyClub } from '../../../../types';

interface NearbySectionProps {
  clubs: NearbyClub[];
  onClubPress: (clubId: string) => void;
  favoriteIds?: Set<string>;
  onFavoritePress?: (clubId: string) => void;
  showEmptyPlaceholder?: boolean;
}

const NearbySection: React.FC<NearbySectionProps> = ({
  clubs,
  onClubPress,
  favoriteIds,
  onFavoritePress,
  showEmptyPlaceholder = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Рядом с вами</Text>
        <View style={styles.radiusBadge}>
          <AnchorIcon width={16} height={16} color="#0097E0" />
          <Text style={styles.radiusBadgeText}>Радиус 2 км</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        {clubs.length === 0 && showEmptyPlaceholder ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Клубы не найдены</Text>
          </View>
        ) : (
          clubs.map((club) => {
            const isFavorite = favoriteIds?.has(club.id);
            const imageSource = club.imageUrl ? { uri: club.imageUrl } : require('@/assets/club-mock/club.jpeg');
            return (
              <TouchableOpacity
                key={club.id}
                onPress={() => onClubPress(club.id)}
                style={styles.card}
                activeOpacity={0.9}
              >
                <View style={styles.cardContent}>
                  <ImageBackground
                    source={imageSource}
                    style={styles.cardMedia}
                    imageStyle={styles.cardImageStyle}
                    resizeMode="cover"
                  >
                    <View style={styles.cardTopRow}>
                      <ClubSeatsBadge occupied={club.occupiedSeats} total={club.totalSeats} />
                      <FavoriteToggleButton
                        active={Boolean(isFavorite)}
                        onPress={() => onFavoritePress?.(club.id)}
                        style={styles.favoriteButton}
                      />
                    </View>
                  </ImageBackground>
                  <View style={styles.cardBottom}>
                    <View style={styles.cardTextBlock}>
                      <Text style={styles.cardTitle}>{club.name}</Text>
                      <Text style={styles.cardSubtitle}>{club.address}</Text>
                    </View>
                    <Text style={styles.cardPrice}>{club.priceFrom}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
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
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 24,
    color: '#071013',
  },
  radiusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
    backgroundColor: 'rgba(25, 167, 233, 0.12)',
  },
  radiusBadgeText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#0097E0',
  },
  scroll: {
    marginHorizontal: -16,
  },
  scrollContent: {
    gap: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  card: {
    width: 226,
    height: 279,
    borderRadius: 20,
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardMedia: {
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#D8E4F7',
    padding: 16,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  cardImageStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoriteButton: {
    marginLeft: 12,
  },
  cardBottom: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  cardTextBlock: {
    gap: 2,
    alignSelf: 'stretch',
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
    fontSize: 16,
    lineHeight: 24,
    color: '#00A8A0',
  },
  emptyContainer: {
    width: 226,
    height: 279,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
    textAlign: 'center',
  },
});

export default NearbySection;
