import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSignUpWithEmail } from '@/src/modules/auth/api/use-sign-up-with-email';
import { useAuthStore } from '@/src/modules/auth/stores/auth.store';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';
import Button from '@components/ui-kit/button';
import { ArrowLeftIcon } from '../../shared/components/icons';

const RegistrationDataScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { setAuth, setIsFirstEnter } = useAuthStore();
  const { mutateAsync: signUpWithEmail } = useSignUpWithEmail();
  const [isLoading, setIsLoading] = useState(false);
  
  const styles = createStyles({ colors, sizes, fonts, weights });

  const handleComplete = async () => {
    // Получаем данные регистрации из global переменной
    const registrationData = (global as any).registrationData;
    
    if (!registrationData || !registrationData.email || !registrationData.password || !registrationData.name) {
      console.warn('Данные регистрации неполные');
      return;
    }

    setIsLoading(true);
    try {
      // Отправляем данные на сервер для регистрации
      const response = await signUpWithEmail({
        email: registrationData.email,
        password: registrationData.password,
        name: registrationData.name,
      });

      // Устанавливаем пользователя как аутентифицированного
      setAuth(response.user);
      
      // Отмечаем завершение первого входа
      setIsFirstEnter(false);
      
      // Очищаем временные данные
      delete (global as any).registrationData;
      
      // Переходим в защищённые табы
      router.replace('/(protected-tabs)' as any);
      
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

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
              <Text style={styles.badgeTextActive}>3</Text>/3
            </Text>
          </View>
        </View>
      </View>

      {/* Основной контент */}
      <View style={styles.content}>
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Заполните профиль</Text>
            <Text style={styles.subtitle}>
              Укажите ваши личные данные{'\n'} для создания аккаунта
            </Text>
          </View>
        </View>

        {/* Кнопка завершения */}
        <Button
          type="primary"
          onPress={handleComplete}
          containerStyle={styles.completeButton}
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Готово'}
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
  completeButton: {
    borderRadius: 16,
    paddingVertical: 16,
  },
});

export default RegistrationDataScreen;
