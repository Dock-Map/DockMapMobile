import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ClubsFilterParams } from '@/src/services/clubs.service';
import { useGetClubs } from '@/src/shared/api/api-hooks/use-get-clubs';
import { useDebounce } from '@/src/shared/hooks/useDebounce';
import { SortOption } from './ui/bottom-sheets/SortingBottomSheet';
import { HomeBottomSheet } from './ui/home-bottom-sheet';
import { HeaderRenderer } from './ui/components/headers/HeaderRenderer';
import { StickyHeaderWrapper } from './ui/components/headers/StickyHeaderWrapper';
import { MainContent } from './ui/components/content/MainContent';
import { useSearch } from './hooks/useSearch';
import { useFavorites } from './hooks/useFavorites';
import { useClubsData } from './hooks/useClubsData';


const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = Math.max(insets.bottom, 16);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY] = useState(new Animated.Value(0));

  const [selectedCity, setSelectedCity] = useState('Санкт-Петербург');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const filtersSheetRef = useRef<BottomSheetModal>(null);
  const sortingSheetRef = useRef<BottomSheetModal>(null);

  const search = useSearch({ scrollViewRef });
  const favorites = useFavorites();

  const debouncedSearchQuery = useDebounce(search.searchQuery, 1000);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      router.push({
        pathname: '/(protected-tabs)/main/search' as any,
        params: { query: debouncedSearchQuery.trim() },
      });
    }
  }, [debouncedSearchQuery]);

  const clubFilters = useMemo<ClubsFilterParams>(() => {
    return { page: 1, limit: 10 };
  }, []);

  // Загрузка данных клубов
  const {
    data: clubsResponse,
    isLoading: isClubsLoading,
    isError: isClubsError,
    refetch: refetchClubs,
  } = useGetClubs(clubFilters);

  const clubs = clubsResponse?.data ?? [];

  // Обработка данных клубов (только для основного контента)
  const { nearbyClubs, popularClubs } = useClubsData({
    clubs,
    hasSearchQuery: false,
    sortOption,
  });

  // Обработчики
  const handleClubPress = useCallback((clubId: string) => {
    router.push({
      pathname: '/(protected-tabs)/main/details' as any,
      params: { clubId },
    });
  }, []);

  const handleFilters = useCallback(() => {
    filtersSheetRef.current?.present();
  }, []);

  const handleSortSelect = useCallback((sort: SortOption) => {
    setSortOption(sort);
  }, []);

  const handleRetryClubs = useCallback(() => {
    refetchClubs();
  }, [refetchClubs]);

  const openCitySheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCitySelect = useCallback((city: string) => {
    setSelectedCity(city);
  }, []);

  const handleHistoryItemPressWithRedirect = useCallback(async (query: string) => {
    await search.handleHistoryItemPress(query);
    router.push({
      pathname: '/(protected-tabs)/main/search' as any,
      params: { query: query.trim() },
    });
  }, [search]);

  const handleSearchSubmitWithRedirect = useCallback(async () => {
    const trimmedQuery = search.searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }
    await search.handleSearchSubmit();
    router.push({
      pathname: '/(protected-tabs)/main/search' as any,
      params: { query: trimmedQuery },
    });
  }, [search]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StickyHeaderWrapper
        scrollY={scrollY}
        onFilters={handleFilters}
        onSearchPress={search.handleSearchModeOpen}
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomSpacing + 120 }]}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom: bottomSpacing + 40 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        <HeaderRenderer
          isSearchMode={search.isSearchMode}
          hasSearchQuery={search.hasSearchQuery}
          selectedCity={selectedCity}
          searchQuery={search.searchQuery}
          activeFiltersCount={activeFiltersCount}
          searchHistory={search.searchHistory}
          onSearchChange={search.handleSearchChange}
          onSearchSubmit={handleSearchSubmitWithRedirect}
          onSearchModeCancel={search.handleSearchModeCancel}
          onBackFromResults={search.handleBackFromResults}
          onFilters={handleFilters}
          onCityPress={openCitySheet}
          onHistoryItemPress={handleHistoryItemPressWithRedirect}
          onHistoryItemRemove={search.handleHistoryItemRemove}
        />

        <MainContent
          isLoading={isClubsLoading}
          isError={isClubsError}
          nearbyClubs={nearbyClubs}
          popularClubs={popularClubs}
          favoriteNearbyIds={favorites.favoriteNearby}
          favoritePopularIds={favorites.favoritePopular}
          onClubPress={handleClubPress}
          onNearbyFavoritePress={favorites.toggleNearbyFavorite}
          onPopularFavoritePress={favorites.togglePopularFavorite}
          onRetry={handleRetryClubs}
        />
      </Animated.ScrollView>

      <HomeBottomSheet
        citySheetRef={bottomSheetRef}
        filtersSheetRef={filtersSheetRef}
        sortingSheetRef={sortingSheetRef}
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
        sortOption={sortOption}
        onSortSelect={handleSortSelect}
        onActiveFiltersCountChange={setActiveFiltersCount}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {},
});

export default HomeScreen;
