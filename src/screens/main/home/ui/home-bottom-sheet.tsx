import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { CityCheckIcon, CloseCircleIcon, SearchInputIcon } from '@/src/shared/components/icons';
import BottomSheetModalBase from '@/src/shared/components/ui/bottom-sheet/BottomSheetModalBase';
import FiltersBottomSheet from './bottom-sheets/FiltersBottomSheet';
import SortingBottomSheet, { SortOption } from './bottom-sheets/SortingBottomSheet';

interface HomeBottomSheetProps {
  citySheetRef: React.RefObject<BottomSheetModal | null>;
  filtersSheetRef: React.RefObject<BottomSheetModal | null>;
  sortingSheetRef: React.RefObject<BottomSheetModal | null>;
  selectedCity: string;
  onCitySelect: (city: string) => void;
  sortOption: SortOption;
  onSortSelect: (sort: SortOption) => void;
  onActiveFiltersCountChange: (count: number) => void;
}

const cityOptions = [
  'Москва',
  'Санкт-Петербург',
  'Геленджик',
  'Казань',
  'Самара',
  'Сочи',
  'Ярославль',
];

export const HomeBottomSheet: React.FC<HomeBottomSheetProps> = ({
  citySheetRef,
  filtersSheetRef,
  sortingSheetRef,
  selectedCity,
  onCitySelect,
  sortOption,
  onSortSelect,
  onActiveFiltersCountChange,
}) => {
  const [citySearch, setCitySearch] = useState('');

  const filteredCityOptions = useMemo(() => {
    const query = citySearch.trim().toLowerCase();
    if (!query) {
      return cityOptions;
    }
    return cityOptions.filter((city) => city.toLowerCase().includes(query));
  }, [citySearch]);

  const closeCitySheet = useCallback(() => {
    citySheetRef.current?.dismiss();
  }, [citySheetRef]);

  const closeFiltersSheet = useCallback(() => {
    filtersSheetRef.current?.dismiss();
  }, [filtersSheetRef]);

  const closeSortingSheet = useCallback(() => {
    sortingSheetRef.current?.dismiss();
  }, [sortingSheetRef]);

  const handleCitySelect = useCallback(
    (city: string) => {
      onCitySelect(city);
      closeCitySheet();
    },
    [onCitySelect, closeCitySheet],
  );

  const handleSheetDismiss = useCallback(() => {
    setCitySearch('');
  }, []);

  return (
    <>
      {/* city selection bottom sheet */}
      <BottomSheetModalBase
        ref={citySheetRef}
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

      {/* filters bottom sheet */}
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
        enableContentPanningGesture={false}
        enablePanDownToClose={false}
      >
        <FiltersBottomSheet onClose={closeFiltersSheet} onFiltersCountChange={onActiveFiltersCountChange} />
      </BottomSheetModalBase>

      {/* sorting bottom sheet */}
      <BottomSheetModalBase
        ref={sortingSheetRef}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[props.style, styles.sheetBackdrop]}
          />
        )}
        containerStyle={styles.sortingSheetContainer}
        backgroundStyle={styles.sortingSheetBackground}
        handleIndicatorStyle={styles.sortingSheetHandleIndicator}
        contentStyle={styles.sortingSheetContent}
        enableDynamicSizing
      >
        <SortingBottomSheet selectedSort={sortOption} onSelect={onSortSelect} onClose={closeSortingSheet} />
      </BottomSheetModalBase>
    </>
  );
};

const styles = StyleSheet.create({
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
  sortingSheetContainer: {
    zIndex: 100,
  },
  sortingSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 0.5,
    borderColor: '#EFF3F8',
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
  },
  sortingSheetContent: {
    paddingBottom: 0,
  },
  sortingSheetHandleIndicator: {
    width: 48,
    height: 4,
    borderRadius: 8,
    backgroundColor: '#DEE4EC',
  },
  citySheetContainer: {
    zIndex: 100,
  },
});
