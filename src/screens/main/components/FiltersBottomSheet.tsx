import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CalendarIcon, CloseCircleIcon } from '@/src/shared/components/icons';

type ToggleId = 'security' | 'utilities' | 'guestDock';
type PlacementId = 'water' | 'land';
type PeriodId = 'week' | 'month';
type VesselId = 'boat' | 'yacht' | 'jetski' | 'sail';

interface FiltersBottomSheetProps {
  onClose: () => void;
}

const FiltersBottomSheet: React.FC<FiltersBottomSheetProps> = ({ onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodId>('week');
  const [selectedPlacement, setSelectedPlacement] = useState<PlacementId>('water');
  const [selectedVessels, setSelectedVessels] = useState<Set<VesselId>>(new Set());
  const [togglesState, setTogglesState] = useState<Record<ToggleId, boolean>>({
    security: false,
    utilities: false,
    guestDock: false,
  });

  const appliedFiltersCount = useMemo(() => {
    const enabledToggles = Object.values(togglesState).filter(Boolean).length;
    const vesselsSelected = selectedVessels.size;
    const periodChanged = selectedPeriod !== 'week' ? 1 : 0;
    const placementChanged = selectedPlacement !== 'water' ? 1 : 0;

    return enabledToggles + vesselsSelected + periodChanged + placementChanged;
  }, [togglesState, selectedVessels, selectedPeriod, selectedPlacement]);

  const periodOptions = useMemo(
    () => [
      { id: 'week' as PeriodId, label: 'Неделя (03.10-10.10)' },
      { id: 'month' as PeriodId, label: 'Месяц (03.10-03.11)' },
    ],
    [],
  );

  const placementOptions = useMemo(
    () => [
      { id: 'water' as PlacementId, label: 'На воде' },
      { id: 'land' as PlacementId, label: 'На суше' },
    ],
    [],
  );

  const vesselOptions = useMemo(
    () => [
      { id: 'boat' as VesselId, label: 'Катер' },
      { id: 'yacht' as VesselId, label: 'Яхта' },
      { id: 'jetski' as VesselId, label: 'Гидроцикл' },
      { id: 'sail' as VesselId, label: 'Парусное' },
    ],
    [],
  );

  const amenityOptions = useMemo(
    () => [
      { id: 'security' as ToggleId, label: 'Охрана территории' },
      { id: 'utilities' as ToggleId, label: 'Электричество и вода' },
      { id: 'guestDock' as ToggleId, label: 'Гостевая швартовка' },
    ],
    [],
  );

  const handleToggleChange = (id: ToggleId, value: boolean) => {
    setTogglesState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleVesselPress = (id: VesselId) => {
    setSelectedVessels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.handleWrapper}>
        <View style={styles.handleIndicator} />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Фильтры</Text>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.headerClose}>
          <CloseCircleIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Даты бронирования</Text>

          <View style={styles.doubleInputRow}>
            <View style={styles.inputContainer}>
              <View style={styles.inputContent}>
                <Text style={styles.inputValue}>03.10.2025</Text>
                <View style={styles.inputIconWrapper}>
                  <CalendarIcon width={20} height={20} />
                </View>
              </View>
            </View>

            <View style={styles.inputDivider} />

            <View style={styles.inputContainer}>
              <View style={styles.inputContent}>
                <Text style={styles.inputValue}>10.10.2025</Text>
                <View style={styles.inputIconWrapper}>
                  <CalendarIcon width={20} height={20} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.chipRow}>
            {periodOptions.map((option) => {
              const isActive = option.id === selectedPeriod;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPeriod(option.id)}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Цена за месяц</Text>

          <View style={styles.doubleInputRow}>
            <View style={styles.inputContainer}>
              <View style={styles.inputContent}>
                <Text style={styles.inputPlaceholder}>0</Text>
              </View>
            </View>

            <View style={styles.inputDivider} />

            <View style={styles.inputContainer}>
              <View style={styles.inputContent}>
                <Text style={styles.inputValue}>5 000</Text>
              </View>
            </View>
          </View>

          <View style={styles.rangeSlider}>
            <View style={styles.rangeTrack} />
            <View style={styles.rangeSelected} />
            <View style={[styles.rangeHandle, styles.rangeHandleLeft]} />
            <View style={[styles.rangeHandle, styles.rangeHandleRight]} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Тип размещения</Text>

          <View style={styles.chipRow}>
            {placementOptions.map((option) => {
              const isActive = option.id === selectedPlacement;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPlacement(option.id)}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Тип судна</Text>

          <View style={styles.chipRow}>
            {vesselOptions.map((option) => {
              const isActive = selectedVessels.has(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  activeOpacity={0.8}
                  onPress={() => handleVesselPress(option.id)}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Удобства</Text>

          <View style={styles.toggleColumn}>
            {amenityOptions.map((option) => {
              const isActive = togglesState[option.id];
              return (
                <View key={option.id} style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>{option.label}</Text>
                  <Switch
                    value={isActive}
                    onValueChange={(value) => handleToggleChange(option.id, value)}
                    trackColor={{ false: '#DEE4EC', true: '#19A7E9' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#DEE4EC"
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Очистить ({appliedFiltersCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Применить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  handleWrapper: {
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleIndicator: {
    width: 48,
    height: 4,
    borderRadius: 8,
    backgroundColor: '#DEE4EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#071013',
  },
  headerClose: {
    position: 'absolute',
    right: 16,
  },
  scroll: {
    maxHeight: 540,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#4A5A6C',
  },
  doubleInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#EFF3F8',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  inputValue: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  inputPlaceholder: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#7E8EA0',
  },
  inputIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#DEE4EC',
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#DEE4EC',
    marginHorizontal: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#EFF3F8',
    marginHorizontal: 4,
    marginBottom: 8,
    shadowColor: 'rgba(25, 167, 233, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#19A7E9',
  },
  filterChipText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#071013',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFF3F8',
  },
  rangeSlider: {
    marginTop: 8,
    height: 32,
    justifyContent: 'center',
  },
  rangeTrack: {
    height: 4,
    borderRadius: 4,
    backgroundColor: '#DEE4EC',
  },
  rangeSelected: {
    position: 'absolute',
    left: '18%',
    right: '22%',
    height: 4,
    borderRadius: 4,
    backgroundColor: '#19A7E9',
  },
  rangeHandle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#19A7E9',
    shadowColor: '#071013',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  rangeHandleLeft: {
    left: '18%',
    marginLeft: -12,
  },
  rangeHandleRight: {
    right: '22%',
    marginRight: -12,
  },
  toggleColumn: {
    gap: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EFF3F8',
  },
  toggleLabel: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  footer: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#EFF3F8',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DEE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#19A7E9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#19A7E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});

export default FiltersBottomSheet;


