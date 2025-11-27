import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ClubDto } from '@/src/shared/api/types/data-contracts';
import ClubSeatsBadge from '@/src/shared/components/ClubSeatsBadge';
import FavoriteToggleButton from '@/src/shared/components/FavoriteToggleButton';

interface ClubItemProps {
  club: ClubDto;
  isFavorite?: boolean;
  onPress?: (clubId: string) => void;
  onFavoritePress?: (clubId: string) => void;
}

export const ClubItem: React.FC<ClubItemProps> = ({
  club,
  isFavorite = false,
  onPress,
  onFavoritePress,
}) => {
  const totalSpots = club.totalSpots || 0;
  const availableSpots = club.availableSpots || 0;
  const occupiedSeats = totalSpots > 0 ? totalSpots - availableSpots : 0;

  const getPriceFrom = () => {
    if (club.pricePerDay) {
      return `от ${club.pricePerDay} ₽/день`;
    }
    if (club.pricePerMonth) {
      return `от ${club.pricePerMonth} ₽/месяц`;
    }
    if (club.pricePerYear) {
      return `от ${club.pricePerYear} ₽/год`;
    }
    return '';
  };

  const imageSource = club.imageUrl
    ? { uri: club.imageUrl }
    : require('@/assets/club-mock/club.jpeg');

  const handlePress = () => {
    if (onPress) {
      onPress(club.id);
    }
  };

  const handleFavoritePress = () => {
    if (onFavoritePress) {
      onFavoritePress(club.id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.cardContent}>
        <ImageBackground
          source={imageSource}
          style={styles.cardMedia}
          imageStyle={styles.cardImageStyle}
          resizeMode="cover"
        >
          <View style={styles.cardTopRow}>
            {totalSpots > 0 && (
              <ClubSeatsBadge occupied={occupiedSeats} total={totalSpots} />
            )}
            {onFavoritePress && (
              <FavoriteToggleButton
                active={isFavorite}
                onPress={handleFavoritePress}
                style={styles.favoriteButton}
              />
            )}
          </View>
        </ImageBackground>
        <View style={styles.cardBottom}>
          <View style={styles.cardTextBlock}>
            <Text style={styles.cardTitle}>{club.name}</Text>
            <Text style={styles.cardSubtitle}>{club.address}</Text>
          </View>
          {getPriceFrom() && <Text style={styles.cardPrice}>{getPriceFrom()}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  cardContent: {
    gap: 8,
  },
  cardMedia: {
    height: 229,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#EFF3F8',
    padding: 12,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardImageStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  favoriteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  cardBottom: {
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
  },
  cardTextBlock: {
    gap: 2,
  },
  cardTitle: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  cardSubtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#465566',
  },
  cardPrice: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#00A8A0',
  },
});

