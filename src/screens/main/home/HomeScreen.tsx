import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClubsFilterParams } from '@/src/services/clubs.service';
import { useGetClubs } from '@/src/shared/api/api-hooks/use-get-clubs';
import { SortOption } from './ui/bottom-sheets/SortingBottomSheet';
import { HomeBottomSheet } from './ui/home-bottom-sheet';
import { HeaderRenderer } from './ui/components/headers/HeaderRenderer';
import { StickyHeaderWrapper } from './ui/components/headers/StickyHeaderWrapper';
import { SearchContent } from './ui/components/content/SearchContent';
import { MainContent } from './ui/components/content/MainContent';
import { useSearch } from './hooks/useSearch';
import { useFavorites } from './hooks/useFavorites';
import { useClubsData } from './hooks/useClubsData';


const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = Math.max(insets.bottom, 16);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY] = useState(new Animated.Value(0));

  // Состояние
  const [selectedCity, setSelectedCity] = useState('Санкт-Петербург');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Refs для bottom sheets
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const filtersSheetRef = useRef<BottomSheetModal>(null);
  const sortingSheetRef = useRef<BottomSheetModal>(null);

  // Хуки для управления поиском и избранным
  const search = useSearch({ scrollViewRef });
  const favorites = useFavorites();

  // Фильтры для API
  const clubFilters = useMemo<ClubsFilterParams>(() => {
    const filters: ClubsFilterParams = { page: 1, limit: 10 };
    if (search.searchQuery.trim()) {
      filters.searchString = search.searchQuery.trim();
    }
    return filters;
  }, [search.searchQuery]);

  // Загрузка данных клубов
  const {
    data: clubsResponse,
    isLoading: isClubsLoading,
    isError: isClubsError,
    refetch: refetchClubs,
  } = useGetClubs(clubFilters);

  const clubs = clubsResponse?.data ?? [];
  const totalClubs = clubsResponse?.total ?? 0;

  // Обработка данных клубов
  const { searchResults, nearbyClubs, popularClubs } = useClubsData({
    clubs,
    hasSearchQuery: search.hasSearchQuery,
    sortOption,
  });

  // Обработчики
  const handleClubPress = useCallback((clubId: string) => {
    console.log('Клуб:', clubId);
  }, []);

  const handleFilters = useCallback(() => {
    filtersSheetRef.current?.present();
  }, []);

  const handleSortPress = useCallback(() => {
    sortingSheetRef.current?.present();
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
          onSearchSubmit={search.handleSearchSubmit}
          onSearchModeCancel={search.handleSearchModeCancel}
          onBackFromResults={search.handleBackFromResults}
          onFilters={handleFilters}
          onCityPress={openCitySheet}
          onHistoryItemPress={search.handleHistoryItemPress}
          onHistoryItemRemove={search.handleHistoryItemRemove}
        />

        {search.hasSearchQuery ? (
          <View style={styles.searchResultsWrapper}>
            <SearchContent
              isLoading={isClubsLoading}
              isError={isClubsError}
              searchResults={searchResults}
              totalClubs={totalClubs}
              favoriteIds={favorites.favoriteSearch}
              onClubPress={handleClubPress}
              onFavoritePress={favorites.toggleSearchFavorite}
              onSortPress={handleSortPress}
              onRetry={handleRetryClubs}
            />
          </View>
        ) : (
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
        )}
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
  searchResultsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default HomeScreen;
