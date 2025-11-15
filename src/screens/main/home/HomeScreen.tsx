import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { addToSearchHistory, getSearchHistory, removeFromSearchHistory } from '@/src/shared/utils/search-history';

import { NearbyClub, PopularClub } from '../types';
import { ClubsFilterParams, ClubDto } from '@/src/services/clubs.service';
import { useGetClubs } from '@/src/shared/api/api-hooks/use-get-clubs';
import { SortOption } from './ui/bottom-sheets/SortingBottomSheet';
import SearchResultsHeader from './ui/components/headers/SearchResultsHeader';
import SearchTopBar from './ui/components/headers/SearchTopBar';
import SearchHistory from './ui/components/search/SearchHistory';
import SearchResults from './ui/components/search/SearchResults';
import EmptySearchState from './ui/components/search/EmptySearchState';
import NearbySection from './ui/components/sections/NearbySection';
import PopularSection from './ui/components/sections/PopularSection';
import StickySearchHeader from './ui/components/headers/StickySearchHeader';
import HomeHeader from './ui/components/headers/HomeHeader';
import { HomeBottomSheet } from './ui/home-bottom-sheet';


const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = Math.max(insets.bottom, 16);
  // selected city
  const [selectedCity, setSelectedCity] = useState('Санкт-Петербург');
  const [favoriteNearby, setFavoriteNearby] = useState<Set<string>>(new Set());
  const [favoritePopular, setFavoritePopular] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favoriteSearch, setFavoriteSearch] = useState<Set<string>>(new Set());
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [scrollY] = useState(new Animated.Value(0));
  const scrollViewRef = useRef<ScrollView>(null);
  
  const clubFilters = useMemo<ClubsFilterParams>(() => {
    const filters: ClubsFilterParams = { page: 1, limit: 10 };
    if (searchQuery.trim()) {
      filters.searchString = searchQuery.trim();
    }
    return filters;
  }, [searchQuery]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const filtersSheetRef = useRef<BottomSheetModal>(null);
  const sortingSheetRef = useRef<BottomSheetModal>(null);

  const { data: clubsResponse, isLoading: isClubsLoading, isError: isClubsError, refetch: refetchClubs } = useGetClubs(clubFilters);

  // Загружаем историю поиска при монтировании
  useEffect(() => {
    getSearchHistory().then(setSearchHistory);
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

  const mapClubToPopular = useCallback(
    (club: ClubDto): PopularClub => {
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
    let results = clubs.map((club) => mapClubToNearby(club));

    // Применяем сортировку
    switch (sortOption) {
      case 'cheaper':
        results = results.sort((a, b) => {
          const priceA = parseFloat(a.priceFrom.replace(/\D/g, '')) || 0;
          const priceB = parseFloat(b.priceFrom.replace(/\D/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'expensive':
        results = results.sort((a, b) => {
          const priceA = parseFloat(a.priceFrom.replace(/\D/g, '')) || 0;
          const priceB = parseFloat(b.priceFrom.replace(/\D/g, '')) || 0;
          return priceB - priceA;
        });
        break;
      case 'recommended':
      default:
        // Оставляем порядок по умолчанию (рекомендованные)
        break;
    }

    return results;
  }, [clubs, hasSearchQuery, sortOption, mapClubToNearby]);

  const nearbyClubs = useMemo<NearbyClub[]>(() => {
    if (hasSearchQuery || clubs.length === 0) {
      return [];
    }

    return clubs.slice(0, 6).map((club) => mapClubToNearby(club));
  }, [clubs, hasSearchQuery, mapClubToNearby]);

  const popularClubs = useMemo<PopularClub[]>(() => {
    if (hasSearchQuery || clubs.length === 0) {
      return [];
    }

    const sorted = [...clubs].sort((a, b) => {
      const firstPrice = getPriceValue(a) ?? 0;
      const secondPrice = getPriceValue(b) ?? 0;
      return secondPrice - firstPrice;
    });

    return sorted.slice(0, 4).map((club) => mapClubToPopular(club));
  }, [clubs, hasSearchQuery, getPriceValue, mapClubToPopular]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    // Если вводим текст в режиме поиска, автоматически переходим к результатам
    if (isSearchMode && value.trim().length > 0) {
      // Не нужно ничего делать, логика отображения уже обработает это
    }
  }, [isSearchMode]);

  const handleSearchSubmit = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }

    await addToSearchHistory(trimmedQuery);
    const updatedHistory = await getSearchHistory();
    setSearchHistory(updatedHistory);
  }, [searchQuery]);

  const handleSearchModeOpen = useCallback(() => {
    setIsSearchMode(true);
    // Прокручиваем вверх при открытии поиска
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const handleSearchModeCancel = useCallback(() => {
    setIsSearchMode(false);
    setSearchQuery('');
  }, []);

  const handleBackFromResults = useCallback(() => {
    // Возвращаемся к режиму поиска без запроса (показываем историю и популярные клубы)
    setSearchQuery('');
    // Остаемся в режиме поиска, чтобы показать историю
  }, []);

  const handleSortPress = useCallback(() => {
    sortingSheetRef.current?.present();
  }, []);

  const handleSortSelect = useCallback((sort: SortOption) => {
    setSortOption(sort);
  }, []);

  const handleHistoryItemPress = useCallback(async (query: string) => {
    setSearchQuery(query);
    await addToSearchHistory(query);
    const updatedHistory = await getSearchHistory();
    setSearchHistory(updatedHistory);
    // После выбора из истории остаемся в режиме поиска, но показываем результаты
  }, []);

  const handleHistoryItemRemove = useCallback(async (query: string) => {
    await removeFromSearchHistory(query);
    const updatedHistory = await getSearchHistory();
    setSearchHistory(updatedHistory);
  }, []);

  const handleClubPress = (clubId: string) => {
    console.log('Клуб:', clubId);
  };

  const handleFilters = useCallback(() => {
    filtersSheetRef.current?.present();
  }, []);

  const handleRetryClubs = useCallback(() => {
    refetchClubs();
  }, [refetchClubs]);

  const toggleNearbyFavorite = useCallback((clubId: string) => {
    setFavoriteNearby((prev) => {
      const next = new Set(prev);
      if (next.has(clubId)) {
        next.delete(clubId);
      } else {
        next.add(clubId);
      }
      return next;
    });
  }, []);

  // open bottom sheet
  const openCitySheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  // select new city
  const handleCitySelect = useCallback((city: string) => {
    setSelectedCity(city);
  }, []);

  const stickyHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 80, 120],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Sticky header */}
      <Animated.View
        style={[
          styles.stickyHeader,
          {
            opacity: stickyHeaderOpacity,
          },
        ]}
        pointerEvents="auto"
      >
        <SafeAreaView edges={['top']} style={styles.stickyHeaderSafeArea}>
          <View style={styles.stickyHeaderContent}>
            <StickySearchHeader onFilters={handleFilters} onSearchPress={handleSearchModeOpen} />
          </View>
        </SafeAreaView>
      </Animated.View>

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
        {/* header with greeting, search and filters */}
        {isSearchMode ? (
          hasSearchQuery ? (
            <SearchResultsHeader
              city={selectedCity}
              searchQuery={searchQuery}
              filtersCount={activeFiltersCount}
              onBack={handleBackFromResults}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              onFilters={handleFilters}
            />
          ) : (
            <>
              <SearchTopBar
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                onCancel={handleSearchModeCancel}
              />
              <View style={styles.searchHistoryWrapper}>
                <SearchHistory
                  items={searchHistory}
                  onItemPress={handleHistoryItemPress}
                  onItemRemove={handleHistoryItemRemove}
                />
              </View>
            </>
          )
        ) : hasSearchQuery ? (
          <SearchResultsHeader
            city={selectedCity}
            searchQuery={searchQuery}
            filtersCount={activeFiltersCount}
            onBack={handleBackFromResults}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onFilters={handleFilters}
          />
        ) : (
          <HomeHeader
            selectedCity={selectedCity}
            onCityPress={openCitySheet}
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onFilters={handleFilters}
          />
        )}

        {hasSearchQuery ? (
          <View style={styles.searchResultsWrapper}>
            {isClubsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0097E0" />
                <Text style={styles.loadingText}>Ищем клубы...</Text>
              </View>
            ) : isClubsError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Не удалось загрузить клубы</Text>
                <Text style={styles.errorSubtitle}>Проверьте подключение к сети и попробуйте ещё раз.</Text>
                <TouchableOpacity onPress={handleRetryClubs} style={styles.errorButton} activeOpacity={0.8}>
                  <Text style={styles.errorButtonText}>Повторить</Text>
                </TouchableOpacity>
              </View>
            ) : searchResults.length > 0 ? (
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
                onSortPress={handleSortPress}
              />
            ) : (
              <EmptySearchState total={totalClubs} onSortPress={handleSortPress} />
            )}
          </View>
        ) : (
          <View style={styles.bodyWrapper}>
            <View style={styles.bodyContainer}>
              {isClubsLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0097E0" />
                  <Text style={styles.loadingText}>Загружаем клубы...</Text>
                </View>
              )}

              {isClubsError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorTitle}>Не удалось загрузить клубы</Text>
                  <Text style={styles.errorSubtitle}>Проверьте подключение к сети и попробуйте ещё раз.</Text>
                  <TouchableOpacity onPress={handleRetryClubs} style={styles.errorButton} activeOpacity={0.8}>
                    <Text style={styles.errorButtonText}>Повторить</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!isClubsError && (
                <>
                  {/* nearby clubs slider */}
                  <NearbySection
                    clubs={nearbyClubs}
                    onClubPress={handleClubPress}
                    favoriteIds={favoriteNearby}
                    onFavoritePress={toggleNearbyFavorite}
                    showEmptyPlaceholder={!isClubsLoading}
                  />
                  {/* popular clubs grid */}
                  <PopularSection
                    clubs={popularClubs}
                    favoriteIds={favoritePopular}
                    onFavoritePress={(clubId) =>
                      setFavoritePopular((prev) => {
                        const next = new Set(prev);
                        if (next.has(clubId)) {
                          next.delete(clubId);
                        } else {
                          next.add(clubId);
                        }
                        return next;
                      })
                    }
                    onClubPress={handleClubPress}
                    showEmptyPlaceholder={!isClubsLoading}
                  />
                </>
              )}
            </View>
          </View>
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
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  stickyHeaderSafeArea: {
    backgroundColor: 'transparent',
  },
  stickyHeaderContent: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchHistoryWrapper: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
  },
  searchResultsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  scrollContent: {},
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
  seatsIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#19A7E9',
    alignItems: 'center',
    justifyContent: 'center',
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
  errorContainer: {
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#FFE4E6',
    gap: 12,
  },
  errorTitle: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#B91C1C',
  },
  errorSubtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#7F1D1D',
  },
  errorButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#DC2626',
  },
  errorButtonText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});

export default HomeScreen;
