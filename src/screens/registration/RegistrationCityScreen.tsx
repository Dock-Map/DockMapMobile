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

import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';
import { useGetCities } from '../../modules/user/api/use-get-cities';
import { CityDto } from '../../shared/api/types/data-contracts';
import Button from '@components/ui-kit/button';
import Input from '@components/ui-kit/input';
import { ArrowLeftIcon } from '../../shared/components/icons';
import { useAuthStore } from '../../modules/auth/stores/auth.store';
import { useCompleteRegistration } from '@/src/modules/auth/api/use-complete-registration';
import { TopBar } from '@/src/shared/components/molecules/TopBar';

const RegistrationCityScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const [selectedCity, setSelectedCity] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<CityDto[]>([]);
  const [pressedItemId, setPressedItemId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  const { registrationData } = useAuthStore();
  
  const { data: cities = [], isLoading, error } = useGetCities();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { mutateAsync: completeRegistration, isPending } = useCompleteRegistration();
  const styles = createStyles({ colors, sizes, fonts, weights });

  useEffect(() => {
    if (cities.length > 0) {
      setFilteredCities(cities);
    }
  }, [cities]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleCitySelect = useCallback((city: CityDto) => {
    setSelectedCity(city.name);
    setSelectedCityId(city.id);
    setShowDropdown(false);
    setPressedItemId(null);
  }, []);

  const handleClearCity = useCallback(() => {
    setSelectedCity('');
    setSelectedCityId(null);
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
    
    setSelectedCityId(null);
    
    if (query.trim() && !showDropdown) {
      setShowDropdown(true);
    }
    
    filterCities(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, [filterCities, showDropdown]);

  const handleContinue = () => {
    if (selectedCityId && selectedCity) {
      completeRegistration({
        cityId: selectedCityId,
        role: registrationData?.role as "owner",
      }).then(() => {
        router.replace('/(protected-tabs)/main' as any);
      });
    }
  };

  const renderCityItem = useCallback(({ item: city }: { item: CityDto }) => (
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

  const keyExtractor = useCallback((item: CityDto) => item.id.toString(), []);

  const ListEmptyComponent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary500} />
          <Text style={styles.loadingText}>Загрузка городов...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Ошибка загрузки городов
          </Text>
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
  }, [isLoading, error, colors, styles]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Top bar */}
      <TopBar title="Регистрация" badge="3" maxBadge="3" />

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
                  setTimeout(() => setShowDropdown(false), 150);
                }}
              />
            </View>


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

        <View style={styles.buttonContainer}>
          <Button
            type="primary"
            onPress={handleContinue}
            disabled={!selectedCityId || !selectedCity}
            isLoading={isPending}
            containerStyle={styles.continueButton}
          >
            Продолжить
          </Button>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
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
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  continueButton: {
    borderRadius: 16,
    paddingVertical: 16,
  },
});

export default RegistrationCityScreen;
