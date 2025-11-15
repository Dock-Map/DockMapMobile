import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { FilterIcon, SearchInputIcon } from '@/src/shared/components/icons';
import { NotificationBadge } from '@/src/screens/chats/ui/notification-badge';

interface SearchWithFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onFilters: () => void;
  filtersCount?: number;
  placeholder?: string;
  showSubmitButton?: boolean;
  iconColor?: string;
  placeholderColor?: string;
}

const SearchWithFilter: React.FC<SearchWithFilterProps> = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onFilters,
  filtersCount = 0,
  placeholder = 'Куда хотите причалить?',
  showSubmitButton = true,
  iconColor = '#95A4C6',
  placeholderColor = '#95A4C6',
}) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.searchRow}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.searchInputWrapper}
        onPress={() => inputRef.current?.focus()}
      >
        <SearchInputIcon color={iconColor} width={18} height={18} />
        <TextInput
          ref={inputRef}
          value={searchValue}
          onChangeText={onSearchChange}
          onSubmitEditing={onSearchSubmit}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {showSubmitButton && !!searchValue && (
          <TouchableOpacity onPress={onSearchSubmit} style={styles.searchSubmit}>
            <Text style={styles.searchSubmitText}>Найти</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onFilters} style={styles.filterButton} activeOpacity={0.7}>
        {filtersCount > 0 ? (
          <View style={styles.filterIconWrapper}>
            <FilterIcon color="#071013" width={16} height={16} />
            <View style={styles.filterBadge}>
              <NotificationBadge count={filtersCount} />
            </View>
          </View>
        ) : (
          <FilterIcon color="#071013" width={16} height={16} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconWrapper: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});

export default SearchWithFilter;

