import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SearchInputIcon } from '@/src/shared/components/icons';

interface SearchTopBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onCancel: () => void;
}

const SearchTopBar: React.FC<SearchTopBarProps> = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCancel,
}) => {
  const inputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    // Автофокус при открытии
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <SearchInputIcon color="#071013" width={18} height={18} />
          <TextInput
            ref={inputRef}
            value={searchValue}
            onChangeText={onSearchChange}
            onSubmitEditing={onSearchSubmit}
            placeholder="Куда хотите причалить?"
            placeholderTextColor="#7E8EA0"
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton} activeOpacity={0.7}>
          <Text style={styles.cancelButtonText}>Отмена</Text>
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
    paddingTop: 8,
    paddingBottom: 8,
    gap: 16,
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
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
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  cancelButtonText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#0097E0',
  },
});

export default SearchTopBar;

