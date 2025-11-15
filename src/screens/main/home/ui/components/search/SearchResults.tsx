import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { NearbyClub } from '../../../../types';
import ClubSeatsBadge from '@/src/shared/components/ClubSeatsBadge';
import FavoriteToggleButton from '@/src/shared/components/FavoriteToggleButton';
import { GroupIcon } from '@/src/shared/components/icons';

interface SearchResultsProps {
  clubs: NearbyClub[];
  total: number;
  onClubPress: (clubId: string) => void;
  favoriteIds?: Set<string>;
  onFavoritePress?: (clubId: string) => void;
  onSortPress?: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  clubs,
  total,
  onClubPress,
  favoriteIds,
  onFavoritePress,
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

      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isFavorite = favoriteIds?.has(item.id);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onClubPress(item.id)}
              activeOpacity={0.9}
            >
              <View style={styles.cardContent}>
                <ImageBackground
                  source={require('@/assets/club-mock/club.jpeg')}
                  style={styles.cardMedia}
                  imageStyle={styles.cardImageStyle}
                  resizeMode="cover"
                >
                  <View style={styles.cardTopRow}>
                    <ClubSeatsBadge occupied={item.occupiedSeats} total={item.totalSeats} />
                    <FavoriteToggleButton
                      active={Boolean(isFavorite)}
                      onPress={() => onFavoritePress?.(item.id)}
                      style={styles.favoriteButton}
                    />
                  </View>
                </ImageBackground>
                <View style={styles.cardBottom}>
                  <View style={styles.cardTextBlock}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.address}</Text>
                  </View>
                  <Text style={styles.cardPrice}>{item.priceFrom}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
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
  separator: {
    height: 8,
  },
});

export default SearchResults;

