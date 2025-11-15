import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { SearchInputIcon } from '@/src/shared/components/icons';
import { addToSearchHistory, getSearchHistory, removeFromSearchHistory } from '@/src/shared/utils/search-history';
import { useGetClubs } from '@/src/shared/api/api-hooks/use-get-clubs';
import { ClubsFilterParams, ClubDto } from '@/src/services/clubs.service';

import { NearbyClub } from './types';
import SearchResults from './home/ui/components/search/SearchResults';
import EmptySearchState from './home/ui/components/search/EmptySearchState';
import SearchHistory from './home/ui/components/search/SearchHistory';

const SearchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = Math.max(insets.bottom, 16);
  const inputRef = useRef<TextInput>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favoriteSearch, setFavoriteSearch] = useState<Set<string>>(new Set());

  const clubFilters = useMemo<ClubsFilterParams>(() => {
    const filters: ClubsFilterParams = { page: 1, limit: 10 };
    if (searchQuery.trim()) {
      filters.searchString = searchQuery.trim();
    }
    return filters;
  }, [searchQuery]);

  const { data: clubsResponse, isLoading: isClubsLoading } = useGetClubs(clubFilters);

  useEffect(() => {
    getSearchHistory().then(setSearchHistory);
    // Автофокус на поле поиска при открытии экрана
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const formatPrice = useCallback((value?: number | null) => {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return 'Цена по запросу';
    }
    const rounded = Math.round(value);
    return `от ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`;
  }, []);

  const getPriceValue = useCallback((club: ClubDto): number | null => {
    if (club.pricePerMonth !== undefined && club.pricePerMonth !== null) {
      return club.pricePerMonth;
    }
    if (club.pricePerDay !== undefined && club.pricePerDay !== null) {
      return club.pricePerDay;
    }
    if (club.pricePerYear !== undefined && club.pricePerYear !== null) {
      return club.pricePerYear;
    }
    return null;
  }, []);

  const normalizeAddress = useCallback((value?: string | null) => {
    if (!value) {
      return 'Адрес не указан';
    }
    return value.trim();
  }, []);

  const mapClubToNearby = useCallback(
    (club: ClubDto): NearbyClub => {
      const totalSpots = club.totalSpots ?? 0;
      const availableSpots = club.availableSpots ?? 0;
      const occupiedSeats = Math.max(totalSpots - availableSpots, 0);

      return {
        id: club.id,
        name: club.name,
        address: normalizeAddress(club.address),
        priceFrom: formatPrice(getPriceValue(club)),
        occupiedSeats,
        totalSeats: totalSpots || occupiedSeats,
      };
    },
    [formatPrice, getPriceValue, normalizeAddress],
  );

  const clubs = clubsResponse?.data ?? [];
  const totalClubs = clubsResponse?.total ?? 0;
  const hasSearchQuery = searchQuery.trim().length > 0;

  const searchResults = useMemo<NearbyClub[]>(() => {
    if (!hasSearchQuery) {
      return [];
    }
    return clubs.map((club) => mapClubToNearby(club));
  }, [clubs, hasSearchQuery, mapClubToNearby]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }

    await addToSearchHistory(trimmedQuery);
    const updatedHistory = await getSearchHistory();
    setSearchHistory(updatedHistory);
  }, [searchQuery]);

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  const handleHistoryItemPress = useCallback(async (query: string) => {
    setSearchQuery(query);
    await addToSearchHistory(query);
    const updatedHistory = await getSearchHistory();
    setSearchHistory(updatedHistory);
  }, []);

  const handleHistoryItemRemove = useCallback(async (query: string) => {
    await removeFromSearchHistory(query);
    const updatedHistory = await getSearchHistory();
    setSearchHistory(updatedHistory);
  }, []);

  const handleClubPress = (clubId: string) => {
    console.log('Клуб:', clubId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <SearchInputIcon color="#071013" width={16} height={16} />
            <TextInput
              ref={inputRef}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              placeholder="Куда хотите причалить?"
              placeholderTextColor="#7E8EA0"
              style={styles.searchInput}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>

        {hasSearchQuery ? null : (
          <View style={styles.historyContainer}>
            <SearchHistory
              items={searchHistory}
              onItemPress={handleHistoryItemPress}
              onItemRemove={handleHistoryItemRemove}
            />
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomSpacing + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {hasSearchQuery ? (
          <>
            {isClubsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0097E0" />
                <Text style={styles.loadingText}>Ищем клубы...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View style={styles.resultsContainer}>
                <SearchResults
                  clubs={searchResults}
                  total={totalClubs}
                  onClubPress={handleClubPress}
                  favoriteIds={favoriteSearch}
                  onFavoritePress={(clubId) =>
                    setFavoriteSearch((prev) => {
                      const next = new Set(prev);
                      if (next.has(clubId)) {
                        next.delete(clubId);
                      } else {
                        next.add(clubId);
                      }
                      return next;
                    })
                  }
                />
              </View>
            ) : (
              <EmptySearchState />
            )}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 8,
    gap: 16,
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF3F8',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  cancelButtonText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#0097E0',
  },
  historyContainer: {
    paddingTop: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  resultsContainer: {
    gap: 16,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
  },
});

export default SearchScreen;
