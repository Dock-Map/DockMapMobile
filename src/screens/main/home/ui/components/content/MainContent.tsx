import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NearbyClub, PopularClub } from '../../../../types';
import NearbySection from '../sections/NearbySection';
import PopularSection from '../sections/PopularSection';
import { LoadingState } from '../states/LoadingState';
import { ErrorState } from '../states/ErrorState';

interface MainContentProps {
  isLoading: boolean;
  isError: boolean;
  nearbyClubs: NearbyClub[];
  popularClubs: PopularClub[];
  favoriteNearbyIds: Set<string>;
  favoritePopularIds: Set<string>;
  onClubPress: (clubId: string) => void;
  onNearbyFavoritePress: (clubId: string) => void;
  onPopularFavoritePress: (clubId: string) => void;
  onRetry: () => void;
}

export function MainContent({
  isLoading,
  isError,
  nearbyClubs,
  popularClubs,
  favoriteNearbyIds,
  favoritePopularIds,
  onClubPress,
  onNearbyFavoritePress,
  onPopularFavoritePress,
  onRetry,
}: MainContentProps) {
  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  return (
    <View style={styles.bodyWrapper}>
      <View style={styles.bodyContainer}>
        {isLoading && <LoadingState />}

        {!isError && (
          <>
            <NearbySection
              clubs={nearbyClubs}
              onClubPress={onClubPress}
              favoriteIds={favoriteNearbyIds}
              onFavoritePress={onNearbyFavoritePress}
              showEmptyPlaceholder={!isLoading}
            />
            <PopularSection
              clubs={popularClubs}
              favoriteIds={favoritePopularIds}
              onFavoritePress={onPopularFavoritePress}
              onClubPress={onClubPress}
              showEmptyPlaceholder={!isLoading}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyWrapper: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginHorizontal: -16,
    marginTop: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  bodyContainer: {
    paddingTop: 0,
    paddingHorizontal: 16,
    gap: 32,
    paddingBottom: 16,
  },
});


