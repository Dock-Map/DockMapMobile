import { useMemo } from 'react';
import { ClubDto } from '@/src/services/clubs.service';
import { SortOption } from '../ui/bottom-sheets/SortingBottomSheet';
import { NearbyClub, PopularClub } from '../../types';
import {
  mapClubToNearby,
  mapClubToPopular,
  getClubPriceValue,
  sortClubsByPriceAsc,
  sortClubsByPriceDesc,
} from '../utils/club.utils';

interface UseClubsDataOptions {
  clubs: ClubDto[];
  hasSearchQuery: boolean;
  sortOption: SortOption;
}

export function useClubsData({ clubs, hasSearchQuery, sortOption }: UseClubsDataOptions) {
  const searchResults = useMemo<NearbyClub[]>(() => {
    if (!hasSearchQuery) {
      return [];
    }

    let results = clubs.map(mapClubToNearby);

    // Применяем сортировку
    switch (sortOption) {
      case 'cheaper':
        results = results.sort(sortClubsByPriceAsc);
        break;
      case 'expensive':
        results = results.sort(sortClubsByPriceDesc);
        break;
      case 'recommended':
      default:
        // Оставляем порядок по умолчанию (рекомендованные)
        break;
    }

    return results;
  }, [clubs, hasSearchQuery, sortOption]);

  const nearbyClubs = useMemo<NearbyClub[]>(() => {
    if (hasSearchQuery || clubs.length === 0) {
      return [];
    }
    return clubs.slice(0, 6).map(mapClubToNearby);
  }, [clubs, hasSearchQuery]);

  const popularClubs = useMemo<PopularClub[]>(() => {
    if (hasSearchQuery || clubs.length === 0) {
      return [];
    }

    const sorted = [...clubs].sort((a, b) => {
      const firstPrice = getClubPriceValue(a) ?? 0;
      const secondPrice = getClubPriceValue(b) ?? 0;
      return secondPrice - firstPrice;
    });

    return sorted.slice(0, 4).map(mapClubToPopular);
  }, [clubs, hasSearchQuery]);

  return {
    searchResults,
    nearbyClubs,
    popularClubs,
  };
}


