import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import type { LayoutChangeEvent } from 'react-native';

import { CalendarIcon, CloseCircleIcon } from '@/src/shared/components/icons';

type ToggleId = 'security' | 'utilities' | 'guestDock';
type PlacementId = 'water' | 'land';
type PeriodId = 'week' | 'month' | 'custom';
type VesselId = 'boat' | 'yacht' | 'jetski' | 'sail';

interface FiltersBottomSheetProps {
  onClose: () => void;
  onFiltersCountChange?: (count: number) => void;
}

interface PeriodOption {
  id: PeriodId;
  label: string;
  range: { start: Date; end: Date };
}

interface CalendarDayCell {
  date: Date;
  isCurrentMonth: boolean;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const PRICE_MIN_LIMIT = 0;
const PRICE_MAX_LIMIT = 200000;
const PRICE_STEP = 100;
const SLIDER_MARKER_SIZE = 24;
const SLIDER_SIDE_PADDING = SLIDER_MARKER_SIZE / 2;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfWeek = (date: Date) => {
  const normalized = normalizeDate(date);
  const day = normalized.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  normalized.setDate(normalized.getDate() + diff);
  return normalizeDate(normalized);
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return normalizeDate(next);
};

const isSameDay = (left: Date | null, right: Date | null) =>
  !!left && !!right && left.getTime() === right.getTime();

const formatDisplayDate = (date: Date | null) =>
  date ? date.toLocaleDateString('ru-RU') : 'Выбрать';

const formatRangeLabel = (start: Date, end: Date) => {
  const formatter = (value: Date) =>
    value.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  return `${formatter(start)}-${formatter(end)}`;
};

const formatPriceValue = (value: number) =>
  clamp(Math.round(value), PRICE_MIN_LIMIT, PRICE_MAX_LIMIT)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const getMonthLabel = (date: Date) => {
  const raw = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const buildCalendarMatrix = (monthDate: Date): CalendarDayCell[][] => {
  const matrix: CalendarDayCell[][] = [];
  const cursor = startOfWeek(startOfMonth(monthDate));
  const iterator = new Date(cursor);

  for (let week = 0; week < 6; week += 1) {
    const weekRow: CalendarDayCell[] = [];
    for (let day = 0; day < 7; day += 1) {
      const cellDate = normalizeDate(iterator);
      weekRow.push({
        date: cellDate,
        isCurrentMonth: cellDate.getMonth() === monthDate.getMonth(),
      });
      iterator.setDate(iterator.getDate() + 1);
    }
    matrix.push(weekRow);
  }

  return matrix;
};

const FiltersBottomSheet: React.FC<FiltersBottomSheetProps> = ({ onClose, onFiltersCountChange }) => {
  const periodOptions = useMemo<PeriodOption[]>(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = addDays(weekStart, 6);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return [
      {
        id: 'week',
        label: `Неделя (${formatRangeLabel(weekStart, weekEnd)})`,
        range: { start: weekStart, end: weekEnd },
      },
      {
        id: 'month',
        label: `Месяц (${formatRangeLabel(monthStart, monthEnd)})`,
        range: { start: monthStart, end: monthEnd },
      },
    ];
  }, []);

  const initialRange = periodOptions[0]?.range;

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodId>('week');
  const [startDate, setStartDate] = useState<Date | null>(() => initialRange?.start ?? null);
  const [endDate, setEndDate] = useState<Date | null>(() => initialRange?.end ?? null);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [priceMinInput, setPriceMinInput] = useState<string>(() => formatPriceValue(0));
  const [priceMaxInput, setPriceMaxInput] = useState<string>(() => formatPriceValue(5000));
  const [sliderLength, setSliderLength] = useState<number | null>(null);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    startOfMonth(initialRange?.start ?? new Date()),
  );
  const [activeDateField, setActiveDateField] = useState<'start' | 'end' | null>(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<PlacementId>('water');
  const [selectedVessels, setSelectedVessels] = useState<Set<VesselId>>(new Set());
  const [togglesState, setTogglesState] = useState<Record<ToggleId, boolean>>({
    security: false,
    utilities: false,
    guestDock: false,
  });
  const [currentSliderValues, setCurrentSliderValues] = useState<[number, number]>([
    priceMin,
    priceMax,
  ]);

  useEffect(() => {
    setPriceMinInput(formatPriceValue(priceMin));
  }, [priceMin]);

  useEffect(() => {
    setPriceMaxInput(formatPriceValue(priceMax));
  }, [priceMax]);

  useEffect(() => {
    setCurrentSliderValues((prev) =>
      prev[0] === priceMin && prev[1] === priceMax ? prev : [priceMin, priceMax],
    );
  }, [priceMin, priceMax]);

  const appliedFiltersCount = useMemo(() => {
    const enabledToggles = Object.values(togglesState).filter(Boolean).length;
    const vesselsSelected = selectedVessels.size;
    const periodChanged = selectedPeriod !== 'week' ? 1 : 0;
    const placementChanged = selectedPlacement !== 'water' ? 1 : 0;

    return enabledToggles + vesselsSelected + periodChanged + placementChanged;
  }, [togglesState, selectedVessels, selectedPeriod, selectedPlacement]);

  useEffect(() => {
    onFiltersCountChange?.(appliedFiltersCount);
  }, [appliedFiltersCount, onFiltersCountChange]);

  const calendarWeeks = useMemo(() => buildCalendarMatrix(visibleMonth), [visibleMonth]);
  const calendarTitle = useMemo(() => getMonthLabel(visibleMonth), [visibleMonth]);

  const handleOpenDatePicker = (field: 'start' | 'end') => {
    setActiveDateField(field);
    const base =
      field === 'start'
        ? startDate ?? endDate ?? new Date()
        : endDate ?? startDate ?? new Date();
    setVisibleMonth(startOfMonth(base));
    setCalendarVisible(true);
  };

  const closeCalendar = () => {
    setCalendarVisible(false);
    setActiveDateField(null);
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedPeriod('custom');
    closeCalendar();
  };

  const handleConfirmDates = () => {
    closeCalendar();
  };

  const handleDayPress = (selected: Date) => {
    const day = normalizeDate(selected);

    if (!activeDateField) {
      setStartDate(day);
      setEndDate(null);
      setActiveDateField('end');
      setSelectedPeriod('custom');
      return;
    }

    if (activeDateField === 'start') {
      setStartDate(day);
      if (endDate && day.getTime() > endDate.getTime()) {
        setEndDate(null);
      }
      setActiveDateField('end');
      setSelectedPeriod('custom');
      return;
    }

    if (startDate && day.getTime() < startDate.getTime()) {
      setStartDate(day);
      setEndDate(null);
      setActiveDateField('end');
      setSelectedPeriod('custom');
      return;
    }

    setEndDate(day);
    setActiveDateField(null);
    setSelectedPeriod('custom');
  };

  const handleMonthChange = (direction: -1 | 1) => {
    setVisibleMonth((prev) =>
      startOfMonth(new Date(prev.getFullYear(), prev.getMonth() + direction, 1)),
    );
  };

  const handlePeriodPress = (option: PeriodOption) => {
    setSelectedPeriod(option.id);
    setStartDate(option.range.start);
    setEndDate(option.range.end);
    setVisibleMonth(startOfMonth(option.range.start));
  };

  const normalizeToStep = useCallback((value: number) => {
    const clipped = clamp(value, PRICE_MIN_LIMIT, PRICE_MAX_LIMIT);
    return Math.round(clipped / PRICE_STEP) * PRICE_STEP;
  }, []);

  const applyMinValue = useCallback(
    (value: number) => {
      const nextMin = normalizeToStep(value);
      setPriceMin(nextMin);
      setPriceMax((prev) => (prev < nextMin ? nextMin : prev));
      setCurrentSliderValues((prev) => {
        const [, prevMax] = prev;
        const adjustedMax = prevMax < nextMin ? nextMin : prevMax;
        if (prev[0] === nextMin && prevMax === adjustedMax) {
          return prev;
        }
        return [nextMin, adjustedMax];
      });
    },
    [normalizeToStep],
  );

  const applyMaxValue = useCallback(
    (value: number) => {
      const nextMax = normalizeToStep(value);
      setPriceMax((prev) => {
        const safeMax = Math.max(nextMax, priceMin);
        setCurrentSliderValues((current) => {
          const [minValue, maxValue] = current;
          const adjustedMax = Math.max(safeMax, minValue);
          if (maxValue === adjustedMax) {
            return current;
          }
          return [minValue, adjustedMax];
        });
        return safeMax;
      });
    },
    [normalizeToStep, priceMin],
  );

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    const sanitized = value.replace(/\D/g, '');
    const numericValue = sanitized === '' ? PRICE_MIN_LIMIT : Number(sanitized);

    if (type === 'min') {
      applyMinValue(numericValue);
    } else {
      applyMaxValue(numericValue);
    }
  };

  const handlePriceBlur = () => {
    setPriceMinInput(formatPriceValue(priceMin));
    setPriceMaxInput(formatPriceValue(priceMax));
  };

  const handleSliderChange = useCallback(
    (values: number[]) => {
      const [rawMin, rawMax] = values;
      const nextMin = normalizeToStep(rawMin);
      const nextMax = normalizeToStep(rawMax);
      setCurrentSliderValues((prev) => {
        const clampedMax = nextMax < nextMin ? nextMin : nextMax;
        if (prev[0] === nextMin && prev[1] === clampedMax) {
          return prev;
        }
        return [nextMin, clampedMax];
      });
      setPriceMinInput(formatPriceValue(nextMin));
      setPriceMaxInput(formatPriceValue(nextMax < nextMin ? nextMin : nextMax));
    },
    [normalizeToStep],
  );

  const handleSliderFinish = useCallback(
    (values: number[]) => {
      const [rawMin, rawMax] = values;
      const nextMin = normalizeToStep(rawMin);
      const nextMax = normalizeToStep(rawMax);
      setPriceMin(nextMin);
      setPriceMax(nextMax < nextMin ? nextMin : nextMax);
      setCurrentSliderValues((prev) => {
        const clampedMax = nextMax < nextMin ? nextMin : nextMax;
        if (prev[0] === nextMin && prev[1] === clampedMax) {
          return prev;
        }
        return [nextMin, clampedMax];
      });
    },
    [normalizeToStep],
  );

  const handleRangeLayout = useCallback((event: LayoutChangeEvent) => {
    setSliderLength(event.nativeEvent.layout.width);
  }, []);

  const sliderLengthValue =
    sliderLength && sliderLength > SLIDER_SIDE_PADDING * 2
      ? sliderLength - SLIDER_SIDE_PADDING * 2
      : 200;

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
            <TouchableOpacity
              style={styles.inputContainer}
              activeOpacity={0.8}
              onPress={() => handleOpenDatePicker('start')}
            >
              <View style={styles.inputContent}>
                <Text style={startDate ? styles.inputValue : styles.inputPlaceholder}>
                  {formatDisplayDate(startDate)}
                </Text>
                <View style={styles.inputIconWrapper}>
                  <CalendarIcon width={16} height={16} />
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.inputDash}>—</Text>

            <TouchableOpacity
              style={styles.inputContainer}
              activeOpacity={0.8}
              onPress={() => handleOpenDatePicker('end')}
            >
              <View style={styles.inputContent}>
                <Text style={endDate ? styles.inputValue : styles.inputPlaceholder}>
                  {formatDisplayDate(endDate)}
                </Text>
                <View style={styles.inputIconWrapper}>
                  <CalendarIcon width={16} height={16} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.chipRow}>
            {periodOptions.map((option) => {
              const isActive = option.id === selectedPeriod;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  activeOpacity={0.8}
                  onPress={() => handlePeriodPress(option)}
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
            <View style={styles.priceInputContainer}>
              <View style={styles.priceInputContent}>
                <TextInput
                  style={styles.inputField}
                  value={priceMinInput}
                  onChangeText={(text) => handlePriceInputChange('min', text)}
                  onBlur={handlePriceBlur}
                  keyboardType="numeric"
                  inputMode="numeric"
                  placeholder="0"
                  placeholderTextColor="#7E8EA0"
                  returnKeyType="done"
                  selectTextOnFocus
                  maxLength={7}
                />
              </View>
            </View>

            <Text style={styles.inputDash}>—</Text>

            <View style={styles.priceInputContainer}>
              <View style={styles.priceInputContent}>
                <TextInput
                  style={styles.inputField}
                  value={priceMaxInput}
                  onChangeText={(text) => handlePriceInputChange('max', text)}
                  onBlur={handlePriceBlur}
                  keyboardType="numeric"
                  inputMode="numeric"
                  placeholder="5 000"
                  placeholderTextColor="#7E8EA0"
                  returnKeyType="done"
                  selectTextOnFocus
                  maxLength={7}
                />
              </View>
            </View>
          </View>

          <View style={styles.rangeSlider} onLayout={handleRangeLayout}>
            <MultiSlider
              values={currentSliderValues}
              min={PRICE_MIN_LIMIT}
              max={PRICE_MAX_LIMIT}
              step={PRICE_STEP}
              sliderLength={sliderLengthValue}
              onValuesChange={handleSliderChange}
              onValuesChangeFinish={handleSliderFinish}
              containerStyle={styles.multiSliderContainer}
              trackStyle={styles.multiSliderTrack}
              selectedStyle={styles.multiSliderSelected}
              unselectedStyle={styles.multiSliderUnselected}
              markerStyle={styles.multiSliderMarker}
              pressedMarkerStyle={styles.multiSliderMarkerPressed}
              allowOverlap={false}
            />
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
                    style={styles.toggleSwitch}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            Очистить{' '}
            <Text style={styles.secondaryButtonCount}>({appliedFiltersCount})</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Применить</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCalendar}
      >
        <View style={styles.calendarModal}>
          <Pressable style={styles.calendarBackdrop} onPress={closeCalendar} />
          <View style={styles.calendarContent}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.calendarNavButton}
                activeOpacity={0.7}
                onPress={() => handleMonthChange(-1)}
              >
                <Text style={styles.calendarNavButtonText}>{'‹'}</Text>
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>{calendarTitle}</Text>
              <TouchableOpacity
                style={styles.calendarNavButton}
                activeOpacity={0.7}
                onPress={() => handleMonthChange(1)}
              >
                <Text style={styles.calendarNavButtonText}>{'›'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarWeekdayRow}>
              {WEEKDAYS.map((day) => (
                <Text key={day} style={styles.calendarWeekdayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarWeeks.map((week, weekIndex) => (
                <View key={`week-${weekIndex}`} style={styles.calendarWeekRow}>
                  {week.map((cell) => {
                    const day = cell.date;
                    const isStart = isSameDay(day, startDate);
                    const isEnd = isSameDay(day, endDate);
                    const isWithinRange = !!(
                      startDate &&
                      endDate &&
                      day.getTime() > startDate.getTime() &&
                      day.getTime() < endDate.getTime()
                    );
                    const isDisabled =
                      activeDateField === 'end' && startDate
                        ? day.getTime() < startDate.getTime()
                        : false;

                    return (
                      <TouchableOpacity
                        key={day.toISOString()}
                        style={[
                          styles.calendarDay,
                          isWithinRange && styles.calendarDayInRange,
                          (isStart || isEnd) && styles.calendarDaySelected,
                          !cell.isCurrentMonth && styles.calendarDayOutside,
                          isDisabled && styles.calendarDayDisabled,
                        ]}
                        activeOpacity={0.9}
                        onPress={() => !isDisabled && handleDayPress(day)}
                        disabled={isDisabled}
                      >
                        <Text
                          style={[
                            styles.calendarDayText,
                            (isStart || isEnd) && styles.calendarDayTextSelected,
                            !cell.isCurrentMonth && styles.calendarDayTextOutside,
                          ]}
                        >
                          {day.getDate()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={styles.calendarFooter}>
              <TouchableOpacity
                style={styles.calendarSecondaryButton}
                activeOpacity={0.8}
                onPress={handleClearDates}
              >
                <Text style={styles.calendarSecondaryButtonText}>Очистить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calendarPrimaryButton}
                activeOpacity={0.85}
                onPress={handleConfirmDates}
              >
                <Text style={styles.calendarPrimaryButtonText}>Готово</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontFamily: 'Onest-Medium',
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
    gap: 12,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Onest-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#465566',
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
  priceInputContainer: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#EFF3F8',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingRight: 4,
    paddingLeft: 12,
    gap: 12,
  },
  priceInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 12,
    
  },
  inputValue: {
    fontFamily: 'Onest-Medium',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  inputPlaceholder: {
    fontFamily: 'Onest-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#7E8EA0',
  },
  inputField: {
    flex: 1,
    padding: 0,
    fontFamily: 'Onest-Medium',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
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
  inputDash: {
    marginHorizontal: 8,
    fontFamily: 'Onest-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#DEE4EC',
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
    fontFamily: 'Onest-Medium',
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
    paddingHorizontal: SLIDER_SIDE_PADDING,
  },
  multiSliderContainer: {
    height: 32,
    justifyContent: 'center',
  },
  multiSliderTrack: {
    height: 2,
    borderRadius: 4,
  },
  multiSliderSelected: {
    backgroundColor: '#19A7E9',
  },
  multiSliderUnselected: {
    backgroundColor: '#DEE4EC',
  },
  multiSliderMarker: {
    width: SLIDER_MARKER_SIZE,
    height: SLIDER_MARKER_SIZE,
    borderRadius: SLIDER_MARKER_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#19A7E9',
    shadowColor: '#071013',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  multiSliderMarkerPressed: {
    width: SLIDER_MARKER_SIZE,
    height: SLIDER_MARKER_SIZE,
    borderRadius: SLIDER_MARKER_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#128DC6',
    shadowColor: '#071013',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  toggleColumn: {
    gap: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#EFF3F8',
  },
  toggleLabel: {
    fontFamily: 'Onest-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  toggleSwitch: {
    transform: [{ scaleX: 0.65 }, { scaleY: 0.65 }],
  },
  footer: {
    marginTop: 8,
    marginBottom: 16,
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
    fontFamily: 'Onest-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#071013',
  },
  secondaryButtonCount: {
    color: '#7E8EA0',
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
    fontFamily: 'Onest-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  calendarModal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  calendarBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 16, 19, 0.45)',
  },
  calendarContent: {
    padding: 20,
    gap: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarNavButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF3F8',
  },
  calendarNavButtonText: {
    fontFamily: 'Onest-Bold',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 20,
    color: '#071013',
  },
  calendarTitle: {
    fontFamily: 'Onest-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#071013',
  },
  calendarWeekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarWeekdayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Onest-Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: '#7E8EA0',
  },
  calendarGrid: {
    gap: 8,
  },
  calendarWeekRow: {
    flexDirection: 'row',
    gap: 8,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  calendarDayInRange: {
    backgroundColor: '#E3F4FD',
  },
  calendarDaySelected: {
    backgroundColor: '#19A7E9',
  },
  calendarDayOutside: {
    opacity: 0.4,
  },
  calendarDayDisabled: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontFamily: 'Onest-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
  },
  calendarDayTextOutside: {
    color: '#465566',
  },
  calendarFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  calendarSecondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DEE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  calendarSecondaryButtonText: {
    fontFamily: 'Onest-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#071013',
  },
  calendarPrimaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#19A7E9',
  },
  calendarPrimaryButtonText: {
    fontFamily: 'Onest-Bold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});

export default FiltersBottomSheet;


