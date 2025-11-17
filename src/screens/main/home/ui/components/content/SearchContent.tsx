import React from 'react';
import { NearbyClub } from '../../../../types';
import SearchResults from '../search/SearchResults';
import EmptySearchState from '../search/EmptySearchState';
import { LoadingState } from '../states/LoadingState';
import { ErrorState } from '../states/ErrorState';

interface SearchContentProps {
  isLoading: boolean;
  isError: boolean;
  searchResults: NearbyClub[];
  totalClubs: number;
  favoriteIds: Set<string>;
  onClubPress: (clubId: string) => void;
  onFavoritePress: (clubId: string) => void;
  onSortPress: () => void;
  onRetry: () => void;
}

export function SearchContent({
  isLoading,
  isError,
  searchResults,
  totalClubs,
  favoriteIds,
  onClubPress,
  onFavoritePress,
  onSortPress,
  onRetry,
}: SearchContentProps) {
  if (isLoading) {
    return <LoadingState message="Ищем клубы..." />;
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (searchResults.length > 0) {
    return (
      <SearchResults
        clubs={searchResults}
        total={totalClubs}
        onClubPress={onClubPress}
        favoriteIds={favoriteIds}
        onFavoritePress={onFavoritePress}
        onSortPress={onSortPress}
      />
    );
  }

  return <EmptySearchState total={totalClubs} onSortPress={onSortPress} />;
}

