import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArrowLeftIcon, PenIcon } from '@/src/shared/components/icons';
import Button from '@/src/shared/components/ui-kit/button';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';

const ForgotPasswordConfirmationScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const styles = createStyles({ colors, sizes, fonts, weights });

  const handleBack = () => {
    router.back();
  };

  const handleEditEmail = () => {
    router.back();
  };

  const handleContinue = () => {
    router.push('/(auth)' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeftIcon width={24} height={24} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Восстановление доступа</Text>
        </View>
      </View>

      {/* Основной контент */}
      <View style={styles.content}>
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Проверьте вашу почту</Text>
            <Text style={styles.subtitle}>
              Мы отправили письмо с деталями для восстанволения доступа на этот адрес
            </Text>
          </View>

          {/* Email с кнопкой редактирования */}
          <View style={styles.emailContainer}>
            <Text style={styles.emailText}>{email}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditEmail}>
              <View style={styles.editIconContainer}>
                <PenIcon color={colors.grey500} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Кнопка продолжить */}
        <Button
          type="primary"
          onPress={handleContinue}
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
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emailText: {
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.primary600,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
    gap: 10,
  },
  editIconContainer: {
    backgroundColor: colors.grey200,
    borderRadius: 32,
    padding: 2,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    backgroundColor: colors.primary500,
    borderRadius: 16,
    // paddingVertical: 16,
  },
});

export default ForgotPasswordConfirmationScreen;
