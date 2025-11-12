import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { AnchorIcon } from '@/src/shared/components/icons';
import FavoriteToggleButton from '@/src/shared/components/FavoriteToggleButton';
import ClubSeatsBadge from '@/src/shared/components/ClubSeatsBadge';

import { NearbyClub } from '../types';

interface NearbySectionProps {
  clubs: NearbyClub[];
  onClubPress: (clubId: string) => void;
  favoriteIds?: Set<string>;
  onFavoritePress?: (clubId: string) => void;
}

const NearbySection: React.FC<NearbySectionProps> = ({ clubs, onClubPress, favoriteIds, onFavoritePress }) => {
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
        {clubs.map((club) => {
          const isFavorite = favoriteIds?.has(club.id);
          return (
            <TouchableOpacity
              key={club.id}
              onPress={() => onClubPress(club.id)}
              style={styles.card}
              activeOpacity={0.9}
            >
              <View style={styles.cardContent}>
                <ImageBackground
                  source={club.image}
                  style={styles.cardImage}
                  imageStyle={styles.cardImageRadius}
                >
                  <LinearGradient
                    colors={club.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    <LinearGradient
                      colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.65)']}
                      style={styles.cardGradientOverlay}
                    />
                    <BlurView intensity={25} tint="dark" style={styles.cardBlurOverlay} pointerEvents="none" />

                    <View style={styles.cardTopRow}>
                      <ClubSeatsBadge occupied={club.occupiedSeats} total={club.totalSeats} />
                      <FavoriteToggleButton
                        active={Boolean(isFavorite)}
                        onPress={() => onFavoritePress?.(club.id)}
                        style={styles.favoriteButton}
                      />
                    </View>

                    <View style={styles.cardBottom}>
                      <View style={styles.cardTextBlock}>
                        <Text style={styles.cardTitle}>{club.name}</Text>
                        <Text style={styles.cardSubtitle}>{club.address}</Text>
                      </View>
                      <Text style={styles.cardPrice}>{club.priceFrom}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          );
        })}
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
    position: 'relative',
  },
  cardImage: {
    flex: 1,
  },
  cardImageRadius: {
    borderRadius: 20,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    padding: 12,
    justifyContent: 'space-between',
    gap: 12,
    zIndex: 0,
  },
  cardBlurOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '36%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    zIndex: 1,
  },
  cardGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    pointerEvents: 'none',
    zIndex: 0,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
    elevation: 2,
  },
  favoriteButton: {
    marginLeft: 12,
  },
  cardBottom: {
    gap: 8,
    alignSelf: 'stretch',
    position: 'relative',
    zIndex: 3,
    elevation: 3,
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
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 0.64)',
  },
  cardPrice: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
});

export default NearbySection;
