import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CityCheckIcon, CloseCircleIcon, SearchInputIcon } from '@/src/shared/components/icons';
import BottomSheetModalBase from '@/src/shared/components/ui/bottom-sheet/BottomSheetModalBase';

import HomeHeader from './components/HomeHeader';
import NearbySection from './components/NearbySection';
import PopularSection from './components/PopularSection';
import FiltersBottomSheet from './components/FiltersBottomSheet';
import { NearbyClub, PopularClub } from './types';
import { ClubsFilterParams, ClubDto } from '@/src/services/clubs.service';
import { useGetClubs } from '@/src/shared/api/api-hooks/use-get-clubs';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = Math.max(insets.bottom, 16);
  // selected city, city search query, bottom sheet ref
  const [selectedCity, setSelectedCity] = useState('Санкт-Петербург');
  const [citySearch, setCitySearch] = useState('');
  const [favoriteNearby, setFavoriteNearby] = useState<Set<string>>(new Set());
  const [favoritePopular, setFavoritePopular] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [clubFilters] = useState<ClubsFilterParams>({ page: 1, limit: 10 });

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const filtersSheetRef = useRef<BottomSheetModal>(null);

  const cityOptions = useMemo(
    () => [
      'Москва',
      'Санкт-Петербург',
      'Геленджик',
      'Казань',
      'Самара',
      'Сочи',
      'Ярославль',
    ],
    [],
  );

  const filteredCityOptions = useMemo(() => {
    const query = citySearch.trim().toLowerCase();
    if (!query) {
      return cityOptions;
    }
    return cityOptions.filter((city) => city.toLowerCase().includes(query));
  }, [cityOptions, citySearch]);

  const { data: clubsResponse, isLoading: isClubsLoading, isError: isClubsError, refetch: refetchClubs } = useGetClubs(clubFilters);

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

  const nearbyClubs = useMemo<NearbyClub[]>(() => {
    if (clubs.length === 0) {
      return [];
    }

    return clubs.slice(0, 6).map((club) => mapClubToNearby(club));
  }, [clubs, mapClubToNearby]);

  const popularClubs = useMemo<PopularClub[]>(() => {
    if (clubs.length === 0) {
      return [];
    }

    const sorted = [...clubs].sort((a, b) => {
      const firstPrice = getPriceValue(a) ?? 0;
      const secondPrice = getPriceValue(b) ?? 0;
      return secondPrice - firstPrice;
    });

    return sorted.slice(0, 4).map((club) => mapClubToPopular(club));
  }, [clubs, getPriceValue, mapClubToPopular]);

  const handleSearch = useCallback(() => {
    router.push('/search' as any);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    handleSearch();
  }, [handleSearch]);

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
    setCitySearch('');
    bottomSheetRef.current?.present();
  }, []);

  // close bottom sheet
  const closeCitySheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const closeFiltersSheet = useCallback(() => {
    filtersSheetRef.current?.dismiss();
  }, []);

  // select new city
  const handleCitySelect = useCallback(
    (city: string) => {
      setSelectedCity(city);
      closeCitySheet();
    },
    [closeCitySheet],
  );

  const handleSheetDismiss = useCallback(() => {
    setCitySearch('');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomSpacing + 120 }]}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom: bottomSpacing + 40 }}
      >
        {/* header with greeting, search and filters */}
        <HomeHeader
          selectedCity={selectedCity}
          onCityPress={openCitySheet}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onFilters={handleFilters}
        />

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
      </ScrollView>

      {/* city selection bottom sheet */}
      <BottomSheetModalBase
        ref={bottomSheetRef}
        onDismiss={handleSheetDismiss}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[props.style, styles.sheetBackdrop]}
          />
        )}
        containerStyle={styles.citySheetContainer}
        backgroundStyle={styles.sheetBackground}
        handleStyle={styles.sheetHandle}
        handleIndicatorStyle={styles.sheetHandleIndicator}
        contentStyle={styles.sheetContent}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Выбор города</Text>
          <TouchableOpacity
            onPress={closeCitySheet}
            activeOpacity={0.7}
            style={styles.sheetCloseButton}
          >
            <CloseCircleIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.sheetSearch}>
          <View style={styles.sheetSearchIcon}>
            <SearchInputIcon width={16} height={16} />
          </View>
          <TextInput
            value={citySearch}
            onChangeText={setCitySearch}
            placeholder="Поиск"
            placeholderTextColor="#7E8EA0"
            style={styles.sheetSearchInput}
          />
        </View>

        <ScrollView
          style={styles.sheetList}
          contentContainerStyle={styles.sheetListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredCityOptions.length === 0 && (
            <Text style={styles.sheetEmptyText}>Ничего не найдено</Text>
          )}

          {filteredCityOptions.map((city) => {
            const isActive = city === selectedCity;
            return (
              <TouchableOpacity
                key={city}
                style={styles.sheetCityRow}
                onPress={() => handleCitySelect(city)}
                activeOpacity={0.8}
              >
                <Text style={styles.sheetCityText}>{city}</Text>
                {isActive && (
                  <View style={styles.sheetCityCheck}>
                    <CityCheckIcon />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </BottomSheetModalBase>

      <BottomSheetModalBase
        ref={filtersSheetRef}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[props.style, styles.sheetBackdrop]}
          />
        )}
        handleComponent={() => null}
        containerStyle={styles.filtersSheetContainer}
        backgroundStyle={styles.filtersSheetBackground}
        contentStyle={styles.filtersSheetContent}
        enableDynamicSizing
      >
        <FiltersBottomSheet onClose={closeFiltersSheet} />
      </BottomSheetModalBase>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 0.5,
    borderColor: '#EFF3F8',
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
  },
  sheetBackdrop: {
    backgroundColor: 'rgba(7, 16, 19, 0.36)',
  },
  sheetHandle: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  sheetHandleIndicator: {
    width: 48,
    height: 4,
    borderRadius: 8,
    backgroundColor: '#DEE4EC',
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 34,
    gap: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
  sheetTitle: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#071013',
  },
  sheetCloseButton: {
    position: 'absolute',
    right: 0,
  },
  sheetSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF3F8',
    borderRadius: 12,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 12,
    marginBottom: 16,
  },
  sheetSearchIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  sheetSearchInput: {
    flex: 1,
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
    paddingVertical: 0,
  },
  sheetList: {
    maxHeight: 520,
    flexGrow: 0,
  },
  sheetListContent: {
    paddingBottom: 16,
    gap: 0,
  },
  sheetCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  sheetCityRowActive: {
    backgroundColor: '#F3F3F3',
  },
  sheetCityText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#071013',
  },
  sheetCityCheck: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetEmptyText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#7E8EA0',
    textAlign: 'center',
    paddingVertical: 32,
  },
  seatsIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#19A7E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 0.5,
    borderColor: '#EFF3F8',
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
  },
  filtersSheetContent: {
    paddingBottom: 0,
  },
  filtersSheetContainer: {
    zIndex: 100,
  },
  citySheetContainer: {
    zIndex: 100,
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
