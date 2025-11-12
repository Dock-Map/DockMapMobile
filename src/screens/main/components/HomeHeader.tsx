import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ChevronDownIcon, FilterIcon, SearchInputIcon } from '@/src/shared/components/icons';

interface HomeHeaderProps {
  selectedCity: string;
  onCityPress: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onFilters: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  selectedCity,
  onCityPress,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onFilters,
}) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} style={styles.locationRow} onPress={onCityPress}>
        <Text style={styles.locationCity}>{selectedCity}</Text>
        <ChevronDownIcon style={styles.locationArrow} width={16} height={16} color="#95A4C6" />
      </TouchableOpacity>

      <View style={styles.searchRow}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.searchInputWrapper}
          onPress={() => inputRef.current?.focus()}
        >
          <SearchInputIcon color="#95A4C6" width={18} height={18} />
          <TextInput
            ref={inputRef}
            value={searchValue}
            onChangeText={onSearchChange}
            onSubmitEditing={onSearchSubmit}
            placeholder="Куда хотите причалить?"
            placeholderTextColor="#95A4C6"
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {!!searchValue && (
            <TouchableOpacity onPress={onSearchSubmit} style={styles.searchSubmit}>
              <Text style={styles.searchSubmitText}>Найти</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onFilters} style={styles.filterButton}>
          <FilterIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationCity: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
    paddingLeft: 8,
  },
  locationArrow: {
    marginTop: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF3F8',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  searchSubmit: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#19A7E9',
  },
  searchSubmitText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#EFF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeHeader;
