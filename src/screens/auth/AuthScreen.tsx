
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSignInWithEmail } from "@/src/modules/auth/api/use-sign-in-with-email";
import { useAuthStore } from "@/src/modules/auth/stores/auth.store";
import TelegramLoginWidget from "@/src/modules/auth/widgets/TelegramLogin";
import VKAuthWithoutSdk from "@/src/modules/auth/widgets/VkLoginWithoutSdk";
import { RegisterResponseDto } from "@/src/shared/api/types/data-contracts";
import ControlledInput from "@/src/shared/components/ui-kit/controlled-input";
import { signInSoftSchema, SignInSoftFormData } from "@/src/shared/schemas/auth-schemas";
import {
  ThemeColors,
  ThemeFonts,
  ThemeWeights,
  useTheme,
} from "@/src/shared/use-theme";
import { setRefreshToken, setToken } from "@/src/shared/utils/token";
import Button from "@components/ui-kit/button";

const AuthScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { height: screenHeight } = Dimensions.get("window");

  const { mutateAsync: signInWithEmail, isPending } = useSignInWithEmail();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitted }
  } = useForm<SignInSoftFormData>({
    resolver: yupResolver(signInSoftSchema),
    mode: 'onSubmit', // Валидация только при отправке
    reValidateMode: 'onBlur', // Перевалидация при потере фокуса
  });

  const { setAuth, user } = useAuthStore();

  const isSmallScreen = screenHeight < 700;

  const initSocialAuth = async (data: RegisterResponseDto) => {
    setAuth(data.user);
    await setToken(data.accessToken);
    await setRefreshToken(data.refreshToken);
  };

  const styles = createStyles({ colors, sizes, fonts, weights });

  const onSubmit = async (data: SignInSoftFormData) => {
    try {
      const res = await signInWithEmail(data);
      setAuth(res.user);
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  const handleRegister = () => {
    // Первый экран регистрации по маршрутам — registration-role
    router.push("/(auth)/registration-role");
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/(forgot-password)/forgot-password');
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Градиентный фон */}
      <LinearGradient
        colors={[
          "#4ADEDE",
          "#32C3E4",
          "#19A7E9",
          "#28ADEA",
          "#4BBAEE",
          "#5DC1F0",
          "#74CAF2",
        ]}
        style={styles.gradientBackground}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Логотип и заголовок */}
      <View style={styles.headerContainer}>
        <View style={styles.logoCard}>
          <MaskedView
            style={styles.gradientTextContainer}
            maskElement={
              <Text style={[styles.logoText, { 
                fontFamily: fonts.button,
                backgroundColor: 'transparent',
              }]}>
                Logo
              </Text>
            }
          >
            <LinearGradient
              colors={['#FFFFFF', '#C0EDFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradientText}
            >
              <Text style={[styles.logoText, { 
                fontFamily: fonts.button,
                opacity: 0,
              }]}>
                Logo
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Вход в аккаунт</Text>
          <Text style={styles.subtitleText}>Войдите, чтобы управлять бронями{'\n'}и профилем</Text>
        </View>
      </View>

      {/* Основной контент */}
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Белая карточка для основного контента */}
        <View style={styles.contentCard}>
          <View style={styles.formContent}>
            {/* Поля ввода */}
            <View style={styles.inputsContainer}>
              {/* Email */}
              <ControlledInput
                control={control}
                name="email"
                type="mail"
                label="Почта"
                placeholder="name@example.com"
                error={errors.email}
              />

              {/* Пароль и забыли пароль */}
              <View style={styles.passwordContainer}>
                <ControlledInput
                  control={control}
                  name="password"
                  type="password"
                  label="Пароль"
                  placeholder="Введите пароль"
                  error={errors.password}
                />
                
                {/* Забыли пароль */}
                <TouchableOpacity
                  style={styles.forgotPasswordContainer}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>
                    Забыли пароль?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Кнопка входа и социальные сети */}
            <View style={styles.actionsContainer}>
              <Button
                type="primary"
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
                containerStyle={styles.loginButton}
              >
                {isPending ? 'Вход...' : 'Войти'}
              </Button>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>или войти через</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TelegramLoginWidget
                  user={user}
                  onAuth={(data: RegisterResponseDto) => {
                    initSocialAuth(data);
                  }}
                />

                <VKAuthWithoutSdk
                  config={{
                    clientId: "54007159",
                    redirectUri:
                      "https://dockmapapi-production.up.railway.app/auth/vk/callback",
                    scope: "email phone",
                  }}
                  onSuccess={(data: RegisterResponseDto) => {
                    initSocialAuth(data);
                  }}
                  onError={(error) => {
                    console.log(error, "error");
                  }}
                />
              </View>
            </View>

            {/* Ссылка на регистрацию */}
            <View style={styles.registrationContainer}>
              <Text style={styles.registrationText}>Нет аккаунта?</Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registrationLink}>Регистрация</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  sizes,
  fonts,
  weights,
}: {
  colors: ThemeColors;
  sizes: any;
  fonts: ThemeFonts;
  weights: ThemeWeights;
}) => StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: sizes.m,
    paddingBottom: sizes.m,
    paddingHorizontal: sizes.m,
    gap: sizes.m,
  },
  logoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -1,
    fontWeight: '700',
  },
  gradientTextContainer: {
    alignSelf: 'center',
  },
  gradientText: {
    alignSelf: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    gap: sizes.s,
  },
  titleText: {
    fontFamily: fonts.h1,
    fontWeight: weights.semibold,
    fontSize: sizes.h1,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: colors.white,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: fonts.text2,
    fontWeight: weights.normal,
    fontSize: sizes.text2,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.white,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1, 
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
  },
  contentCard: {
    backgroundColor: '#FAFCFE',
    borderRadius: 32,
    flex: 1, 
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0, 
    justifyContent: 'space-between',
  },
  formContent: {
    flex: 1,
    padding: sizes.m,
    justifyContent: 'space-between',
    gap: sizes.md,
  },

  inputsContainer: {
    gap: sizes.sm,
  },
  passwordContainer: {
    gap: sizes.s,
  },
  inputContainer: {
    marginBottom: 0,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    paddingVertical: 12,
  },
  forgotPasswordText: {
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: sizes.text3,
    lineHeight: 20,
    color: colors.primary600,
  },
  loginButton: {
    marginTop: 0,
  },
  registerButton: {
    marginTop: sizes.s,
  },
  actionsContainer: {
    gap: sizes.m,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.s,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grey200,
  },
  dividerText: {
    fontFamily: fonts.text3,
    fontWeight: weights.normal,
    fontSize: sizes.text3,
    lineHeight: 20,
    color: colors.grey700,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: sizes.s,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey100,
    borderRadius: sizes.sm,
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.m,
    gap: sizes.s,
  },
  socialButtonText: {
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: sizes.text3,
    lineHeight: 20,
    color: colors.black,
  },
  registrationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: sizes.s,
    paddingBottom: 34,
  },
  registrationText: {
    fontFamily: fonts.text3,
    fontWeight: weights.normal,
    fontSize: sizes.text3,
    lineHeight: 20,
    color: colors.grey700,
  },
  registrationLink: {
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: sizes.text3,
    lineHeight: 20,
    color: colors.primary600,
  },

});

export default AuthScreen;
