import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FilterIcon, SearchInputIcon } from '@/src/shared/components/icons';

interface StickySearchHeaderProps {
  onFilters: () => void;
  onSearchPress: () => void;
}

const StickySearchHeader: React.FC<StickySearchHeaderProps> = ({ onFilters, onSearchPress }) => {
  const handleSearchPress = () => {
    onSearchPress();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.searchButton}
        onPress={handleSearchPress}
      >
        <SearchInputIcon color="#7E8EA0" width={16} height={16} />
        <Text style={styles.searchButtonText}>Поиск</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onFilters} style={styles.filterButton}>
        <FilterIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 4,
    width: 144,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#EFF3F8',
    borderRadius: 16,
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF3F8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  searchButtonText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#7E8EA0',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF3F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default StickySearchHeader;

