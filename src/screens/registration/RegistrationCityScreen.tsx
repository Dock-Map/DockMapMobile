import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cityService } from '@/src/services/city.service';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';
import { City } from '@/src/types';
import Button from '@components/ui-kit/button';
import Input from '@components/ui-kit/input';
import { ArrowLeftIcon } from '../../shared/components/icons';

const RegistrationCityScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const [selectedCity, setSelectedCity] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null); // ID выбранного города из списка
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const styles = createStyles({ colors, sizes, fonts, weights });

  useEffect(() => {
    loadCities();
  }, []);

  // Cleanup таймера при размонтировании компонента
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadCities = async () => {
    try {
      setIsLoading(true);
      const citiesData = await cityService.getCities();
      setCities(citiesData);
      setFilteredCities(citiesData);
    } catch (error) {
      console.error('Ошибка загрузки городов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = useCallback((city: City) => {
    setSelectedCity(city.name);
    setSelectedCityId(city.id); // Сохраняем ID выбранного города
    setShowDropdown(false);
    setPressedItemId(null);
  }, []);

  const handleClearCity = useCallback(() => {
    setSelectedCity('');
    setSelectedCityId(null); // Сбрасываем выбранный город
    setFilteredCities(cities);
    setShowDropdown(false);
  }, [cities]);

  const filterCities = useCallback((query: string) => {
    if (query.trim()) {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [cities]);

  const handleCitySearch = useCallback((query: string) => {
    setSelectedCity(query);
    
    // Сбрасываем выбранный город при ручном вводе
    setSelectedCityId(null);
    
    // Показываем dropdown при вводе текста
    if (query.trim() && !showDropdown) {
      setShowDropdown(true);
    }
    
    // Немедленно фильтруем для лучшего UX
    filterCities(query);
    
    // Очищаем предыдущий таймер (для дополнительной оптимизации, если понадобится)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, [filterCities, showDropdown]);

  const handleContinue = () => {
    // Проверяем, что город выбран именно из списка (не просто введен текст)
    if (selectedCityId && selectedCity) {
      router.push('/registration-role' as any);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderCityItem = useCallback(({ item: city }: { item: City }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        (city.name === selectedCity || pressedItemId === city.id) && styles.dropdownItemActive
      ]}
      onPress={() => handleCitySelect(city)}
      onPressIn={() => setPressedItemId(city.id)}
      onPressOut={() => setPressedItemId(null)}
      activeOpacity={1}
    >
      <Text style={[
        styles.dropdownItemText,
        city.name === selectedCity && styles.dropdownItemTextActive
      ]}>
        {city.name}
      </Text>
    </TouchableOpacity>
  ), [selectedCity, pressedItemId, handleCitySelect, styles]);

  const keyExtractor = useCallback((item: City) => item.id, []);

  const ListEmptyComponent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary500} />
          <Text style={styles.loadingText}>Загрузка городов...</Text>
        </View>
      );
    }

    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>
          Города не найдены
        </Text>
      </View>
    );
  }, [isLoading, colors, styles]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeftIcon width={24} height={24} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Регистрация</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              <Text style={styles.badgeTextActive}>1</Text>/3
            </Text>
          </View>
        </View>
      </View>

      {/* Основной контент */}
      <View style={styles.content}>
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Выберите город</Text>
            <Text style={styles.subtitle}>
              Укажите город, чтобы мы показали {'\n'}свободные причалы поблизости
            </Text>
          </View>

          {/* Выбор города */}
          <View style={styles.citySelectionContainer}>
            {/* Input с выбранным городом */}
            <View style={styles.inputContainer}>
              <Input
                type="base"
                state="default"
                placeholder="Введите город"
                value={selectedCity}
                onChangeText={handleCitySearch}
                containerStyle={styles.cityInput}
                clearable={true}
                onClear={handleClearCity}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => {
                  // Небольшая задержка чтобы позволить выбрать элемент из dropdown
                  setTimeout(() => setShowDropdown(false), 150);
                }}
              />
            </View>

            {/* Dropdown с городами */}
            {showDropdown && (
              <View style={styles.dropdownOverlay}>
                <View style={styles.dropdownContainer}>
                  <FlatList
                    data={filteredCities}
                    renderItem={renderCityItem}
                    keyExtractor={keyExtractor}
                    style={styles.dropdownScrollView}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={ListEmptyComponent}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={8}
                    getItemLayout={(data, index) => ({
                      length: 56,
                      offset: 56 * index,
                      index,
                    })}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Кнопка продолжить */}
        <Button
          type="primary"
          onPress={handleContinue}
          disabled={!selectedCityId || !selectedCity}
          containerStyle={styles.continueButton}
        >
          Продолжить
        </Button>
      </View>
    </SafeAreaView>
  );
};

const createStyles = ({ 
  colors, 
  sizes, 
  fonts, 
  weights 
}: {
  colors: ThemeColors;
  sizes: any;
  fonts: ThemeFonts;
  weights: ThemeWeights;
}) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    backgroundColor: colors.white,
    paddingTop: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 26,
    paddingRight: 16,
    position: 'relative',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 0,
    zIndex: 1,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.black,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: colors.grey200,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  badgeText: {
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.grey500,
  },
  badgeTextActive: {
    color: colors.primary500,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formContainer: {
    gap: 24,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: fonts.h2,
    fontWeight: weights.h2,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.text2,
    fontWeight: weights.text2,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.grey900,
    textAlign: 'center',
  },
  citySelectionContainer: {
    gap: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  cityInput: {
    marginBottom: 0,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 60, 
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
    maxHeight: 240,
  },
  dropdownScrollView: {
    maxHeight: 220,
  },
  dropdownItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginBottom: 4,
  },
  dropdownItemActive: {
    backgroundColor: colors.grey200,
  },
  dropdownItemText: {
    fontFamily: fonts.text2,
    fontWeight: weights.normal,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.black,
  },
  dropdownItemTextActive: {
    color: colors.black,
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: fonts.text2,
    fontWeight: weights.normal,
    fontSize: 14,
    color: colors.grey500,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontFamily: fonts.text2,
    fontWeight: weights.normal,
    fontSize: 14,
    color: colors.grey500,
    textAlign: 'center',
  },
  continueButton: {
    borderRadius: 16,
    paddingVertical: 16,
  },
});

export default RegistrationCityScreen;
