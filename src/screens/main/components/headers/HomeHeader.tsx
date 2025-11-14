import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ChevronDownIcon } from '@/src/shared/components/icons';
import SearchWithFilter from '../search/SearchWithFilter';

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
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} style={styles.locationRow} onPress={onCityPress}>
        <Text style={styles.locationCity}>{selectedCity}</Text>
        <ChevronDownIcon style={styles.locationArrow} width={16} height={16} color="#95A4C6" />
      </TouchableOpacity>

      <SearchWithFilter
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        onFilters={onFilters}
        iconColor="#95A4C6"
        placeholderColor="#95A4C6"
      />
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
});

export default HomeHeader;
