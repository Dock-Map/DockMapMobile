import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useResetPasswordRequest } from '@/src/modules/auth/api/use-reset-password-request';
import { ArrowLeftIcon } from '@/src/shared/components/icons';
import Button from '@/src/shared/components/ui-kit/button';
import ControlledInput from '@/src/shared/components/ui-kit/controlled-input';
import { resetPasswordRequestSchema, ResetPasswordRequestFormData } from '@/src/shared/schemas/auth-schemas';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';

const ForgotPasswordScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  
  const { mutateAsync: resetPasswordRequest, isPending } = useResetPasswordRequest();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ResetPasswordRequestFormData>({
    resolver: yupResolver(resetPasswordRequestSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });
  
  const styles = createStyles({ colors, sizes, fonts, weights });

  const handleBack = () => {
    router.back();
  };

  const onSubmit = async (data: ResetPasswordRequestFormData) => {
    try {
      await resetPasswordRequest(data);
      
      router.push(`/(auth)/(forgot-password)/forgot-password-confirmation?email=${encodeURIComponent(data.email)}` as any);
    } catch (error) {
      console.error('Ошибка при отправке запроса на восстановление пароля:', error);
    }
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
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Заголовок и описание */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Забыли пароль?</Text>
          <Text style={styles.subtitle}>
            Введите email, привязанный к аккаунту,{'\n'} чтобы восстановить доступ
          </Text>
        </View>

        {/* Поле ввода email */}
        <View style={styles.inputContainer}>
          <ControlledInput
            control={control}
            name="email"
            type="mail"
            label="Почта"
            placeholder="Введите email"
            error={errors.email}
          />
        </View>

        {/* Кнопка сбросить пароль */}
        <Button
          type="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          containerStyle={styles.continueButton}
        >
          {isPending ? 'Отправка...' : 'Сбросить пароль'}
        </Button>
      </ScrollView>
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
    paddingVertical: 26,
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  title: {
    fontFamily: fonts.h2,
    fontWeight: weights.medium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.text2,
    fontWeight: weights.normal,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.grey900,
    textAlign: 'center',
  },
  continueButton: {
    borderRadius: 16,
    paddingVertical: 16,
  },
});

export default ForgotPasswordScreen;
