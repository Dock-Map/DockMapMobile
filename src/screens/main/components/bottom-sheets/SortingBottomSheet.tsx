import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CloseCircleIcon } from '@/src/shared/components/icons';

export type SortOption = 'recommended' | 'cheaper' | 'expensive' | 'nearby';

interface SortingBottomSheetProps {
  selectedSort: SortOption;
  onSelect: (sort: SortOption) => void;
  onClose: () => void;
}

const SortingBottomSheet: React.FC<SortingBottomSheetProps> = ({
  selectedSort,
  onSelect,
  onClose,
}) => {
  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'recommended', label: 'Рекомендованные' },
    { id: 'cheaper', label: 'Дешевле' },
    { id: 'expensive', label: 'Дороже' },
    { id: 'nearby', label: 'Ближе' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerTitle}>Показать сначала</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeButton}>
            <CloseCircleIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.options}>
          {sortOptions.map((option) => {
            const isSelected = selectedSort === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.option}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.optionText}>{option.label}</Text>
                <View style={[styles.radio, isSelected && styles.radioSelected]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingBottom: 34,
    shadowColor: '#071013',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
  },
  contentWrapper: {
    alignItems: 'center',
    gap: 24,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
    color: '#071013',
  },
  closeButton: {
    padding: 0,
  },
  options: {
    width: '100%',
    gap: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF3F8',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  optionText: {
    flex: 1,
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#CDD5DF',
  },
  radioSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#0097E0',
  },
});

export default SortingBottomSheet;

