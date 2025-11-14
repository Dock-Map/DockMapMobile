import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AnchorIcon, ArrowBackIcon } from '@/src/shared/components/icons';
import SearchWithFilter from '../search/SearchWithFilter';

interface SearchResultsHeaderProps {
  city: string;
  searchQuery: string;
  filtersCount?: number;
  onBack: () => void;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onFilters: () => void;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  city,
  searchQuery,
  filtersCount = 0,
  onBack,
  onSearchChange,
  onSearchSubmit,
  onFilters,
}) => {
  return (
    <View style={styles.container}>
      {/* Бейдж города */}
      <View style={styles.cityBadge}>
        <View style={styles.cityBadgeContent}>
          <AnchorIcon width={12} height={12} color="#19A7E9" />
          <Text style={styles.cityBadgeText}>{city}</Text>
        </View>
      </View>

      {/* Строка поиска и фильтров */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <ArrowBackIcon width={24} height={24} color="#071013" />
        </TouchableOpacity>

        <View style={styles.searchWithFilterWrapper}>
          <SearchWithFilter
            searchValue={searchQuery}
            onSearchChange={onSearchChange}
            onSearchSubmit={onSearchSubmit}
            onFilters={onFilters}
            filtersCount={filtersCount}
            showSubmitButton={false}
            iconColor="#071013"
            placeholderColor="#7E8EA0"
          />
        </View>
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
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
  },
  cityBadge: {
    alignSelf: 'center',
  },
  cityBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(25, 167, 233, 0.12)',
    borderRadius: 100,
  },
  cityBadgeText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    color: '#19A7E9',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWithFilterWrapper: {
    flex: 1,
    minWidth: 0,
  },
});

export default SearchResultsHeader;

