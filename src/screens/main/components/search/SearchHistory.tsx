import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CloseCircleIcon, SearchInputIcon } from '@/src/shared/components/icons';

interface SearchHistoryProps {
  items: string[];
  onItemPress: (query: string) => void;
  onItemRemove: (query: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ items, onItemPress, onItemRemove }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.item}>
          <TouchableOpacity
            style={styles.itemContent}
            onPress={() => onItemPress(item)}
            activeOpacity={0.7}
          >
            <SearchInputIcon width={16} height={16} color="#071013" />
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onItemRemove(item)}
            activeOpacity={0.7}
            style={styles.removeButton}
          >
            <View style={styles.closeIconWrapper}>
              <CloseCircleIcon width={20} height={20} />
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  removeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconWrapper: {
    width: 20,
    height: 20,
  },
});

export default SearchHistory;

