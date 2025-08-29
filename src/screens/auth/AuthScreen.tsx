
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSignInWithEmail } from "@/src/modules/auth/api/use-sign-in-with-email";
import { useSignUpWithEmail } from "@/src/modules/auth/api/use-sign-up-with-email";
import { useAuthStore } from "@/src/modules/auth/stores/auth.store";
import TelegramLoginWidget from "@/src/modules/auth/widgets/TelegramLogin";
import VKAuthWithoutSdk from "@/src/modules/auth/widgets/VkLoginWithoutSdk";
import { RegisterResponseDto } from "@/src/shared/api/types/data-contracts";
import {
  ThemeColors,
  ThemeFonts,
  ThemeWeights,
  useTheme,
} from "@/src/shared/use-theme";
import { setRefreshToken, setToken } from "@/src/shared/utils/token";
import Button from "@components/ui-kit/button";
import PrivacyPolicy from '@components/ui-kit/privacy-policy';
import Tabs from "@components/ui-kit/tabs";
import Input from "../../shared/components/ui-kit/input";

const AuthScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { height: screenHeight } = Dimensions.get("window");

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: signUpWithEmail } = useSignUpWithEmail();
  const { mutateAsync: signInWithEmail } = useSignInWithEmail();

  const { setAuth, user } = useAuthStore();

  const isSmallScreen = screenHeight < 700;

  const initSocialAuth = async (data: RegisterResponseDto) => {
    setAuth(data.user);
    await setToken(data.accessToken);
    await setRefreshToken(data.refreshToken);
  };

  const styles = createStyles({ colors, sizes, fonts, weights });

  const tabs = [
    { id: "login", title: "Вход" },
    { id: "register", title: "Регистрация" },
  ];

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId as "login" | "register");
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      signInWithEmail({
        email,
        password,
      }).then((res) => {
        setAuth(res.user);
      });
    } catch (error) {
      console.error("Ошибка входа:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
   
    (global as any).registrationData = { email, password, name };
    router.push("/registration-city" as any);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Вход через ${provider}`);
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password' as any);
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

      {/* Логотип */}
      <View
        style={[
          styles.logoContainer,
          {
            paddingTop: isSmallScreen ? sizes.sm : sizes.m,
            paddingBottom: isSmallScreen ? sizes.sm : sizes.m,
          },
        ]}
      >
        <View style={styles.logoCard}>
          <MaskedView
            style={styles.gradientTextContainer}
            maskElement={
              <Text style={[styles.logoText, { 
                fontFamily: fonts.button,
                backgroundColor: 'transparent',
              }]}>
                Dock Map
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
                Dock Map
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
      </View>

      {/* Основной контент */}
      <View style={styles.mainContent}>
        {/* Белая карточка для основного контента */}
        <View style={styles.contentCard}>
          {/* Основной контент с отступом */}
          <View style={styles.scrollableContent}>
            {/* Табы */}
            <View style={styles.tabsContainer}>
              <Tabs
                type="type3"
                items={tabs}
                activeTabId={activeTab}
                onTabPress={handleTabPress}
                containerStyle={styles.tabsWrapper}
              />
            </View>

            {/* Форма */}
            <View style={styles.formContainer}>
              {activeTab === 'login' ? (
                <>
                  {/* Поля ввода */}
                  <View style={styles.inputsContainer}>
                    {/* Email */}
                    <Input
                      type="mail"
                      placeholder="Введите email"
                      value={email}
                      onChangeText={setEmail}
                    />

                    {/* Пароль и забыли пароль */}
                    <View style={styles.passwordContainer}>
                      <Input
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChangeText={setPassword}
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

                  {/* Кнопка входа */}
                  <Button
                    type="primary"
                    onPress={handleLogin}
                    disabled={!email || !password || isLoading}
                    containerStyle={styles.loginButton}
                  >
                    {isLoading ? 'Вход...' : 'Войти'}
                  </Button>
                </>
              ) : (
                <>
                  {/* Поля ввода для регистрации */}
                  <View style={styles.inputsContainer}>
                    {/* Имя */}
                    <Input
                      type="name"
                      placeholder="Введите имя"
                      value={name}
                      onChangeText={setName}
                    />

                    {/* Email */}
                    <Input
                      type="mail"
                      placeholder="Введите email"
                      value={email}
                      onChangeText={setEmail}
                    />

                    {/* Пароль */}
                    <Input
                      type="password"
                      placeholder="Введите пароль"
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>

                  {/* Кнопка регистрации */}
                  <Button
                    type="primary"
                    onPress={handleRegister}
                    disabled={!name || !email || !password || isLoading}
                    containerStyle={styles.registerButton}
                  >
                    Создать аккаунт
                  </Button>
                </>
              )}
            </View>

            {/* Социальные сети */}
            <View style={styles.socialContainer}>
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
          </View>

          {/* Политика конфиденциальности прижата к низу */}
          <PrivacyPolicy containerStyle={styles.privacyPolicyContainer} />
        </View>
      </View>
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
  logoContainer: {
    alignItems: 'center',
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
  mainContent: {
    flex: 1, 
    paddingHorizontal: 0, 
  },
  contentCard: {
    backgroundColor: colors.background,
    borderRadius: sizes.md,
    flex: 1, 
    borderTopLeftRadius: sizes.md,
    borderTopRightRadius: sizes.md,
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0, 
    justifyContent: 'space-between',
  },
  scrollableContent: {
    flex: 1,
    padding: sizes.m,
  },
  privacyPolicyContainer: {
    marginTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 34,
  },
  tabsContainer: {
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  tabsWrapper: {
    width: '100%',
  },
  formContainer: {
    gap: sizes.m,
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
    marginTop: sizes.s,
  },
  registerButton: {
    marginTop: sizes.s,
  },
  socialContainer: {
    gap: sizes.md,
    marginTop: sizes.m,
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

});

export default AuthScreen;
