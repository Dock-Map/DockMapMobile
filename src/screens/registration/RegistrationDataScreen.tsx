import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../shared/components/ui-kit/button";
import ControlledInput from "../../shared/components/ui-kit/controlled-input";
import { useTheme } from "../../shared/use-theme";
import {
  ArrowLeftIcon,
  CheckIcon,
  InfoCircleIcon,
  CheckBoxIcon,
} from "../../shared/components/icons";
import {
  registrationDataSchema,
  RegistrationDataFormData,
} from "../../shared/schemas/auth-schemas";
import { useSignUpWithEmail } from "@/src/modules/auth/api/use-sign-up-with-email";
import { useAuthStore } from "@/src/modules/auth/stores/auth.store";
import { KeyboardScrollView } from "../auth/ui/KeyboardScrollView";
import { TopBar } from '@/src/shared/components/molecules/TopBar';

export const RegistrationDataScreen: React.FC = () => {
  const { colors, fonts, weights, sizes } = useTheme();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { mutateAsync: signUpWithEmail } = useSignUpWithEmail();
  const { setRegistrationData, registrationData } = useAuthStore();
  const styles = createStyles({ colors, fonts, weights, sizes });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationDataFormData>({
    resolver: yupResolver(registrationDataSchema) as any,
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data: any) => {
    try {
      await signUpWithEmail(data);
      console.log("Регистрация успешна");
      setRegistrationData({ ...data, role: registrationData?.role });
      router.push("/(auth)/registration-city");
    } catch (error) {
      console.log("Регистрация не успешна");
      console.error("Ошибка регистрации:", error);
    }
  };

  // Вычисляем валидность правил пароля
  const hasMinLength = password && password.length >= 8;
  const hasDigit = password && /\d/.test(password);
  const hasUpperCase = password && /[A-ZА-Я]/.test(password);
// partial.lemming.jefd@rapidletter.net
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Top bar */}
      <TopBar title="Регистрация" badge="2" maxBadge="3" />

      <KeyboardScrollView>
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.black }]}>
              Регистрация судовладельца
            </Text>
            <Text style={[styles.subtitle, { color: colors.grey900 }]}>
              Зарегистрируйте аккаунт и{"\n"}бронируйте яхт-клубы легко
            </Text>
          </View>

          {/* Поля формы */}
          <View style={styles.fieldsContainer}>
            <ControlledInput
              control={control}
              name="name"
              label="ФИО"
              placeholder="Иванов Иван"
              error={errors.name}
            />
            <ControlledInput
              control={control}
              name="email"
              label="Почта"
              placeholder="ivanov@gmail.com"
              error={errors.email}
            />

            <View style={styles.passwordContainer}>
              <ControlledInput
                control={control}
                name="password"
                label="Пароль"
                placeholder="Ivanov1998"
                type="password"
                error={errors.password}
              />

              <View style={styles.validationRules}>
                <View style={styles.ruleItem}>
                  {hasMinLength ? (
                    <CheckIcon width={16} height={16} color="#4ADE80" />
                  ) : (
                    <InfoCircleIcon width={16} height={16} color="#A1B0CA" />
                  )}
                  <Text
                    style={[
                      styles.ruleText,
                      {
                        color: hasMinLength ? "#4ADE80" : "#A1B0CA",
                      },
                    ]}
                  >
                    Минимум 8 символов
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  {hasDigit ? (
                    <CheckIcon width={16} height={16} color="#4ADE80" />
                  ) : (
                    <InfoCircleIcon width={16} height={16} color="#A1B0CA" />
                  )}
                  <Text
                    style={[
                      styles.ruleText,
                      {
                        color: hasDigit ? "#4ADE80" : "#A1B0CA",
                      },
                    ]}
                  >
                    Используйте хотя бы одну цифру
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  {hasUpperCase ? (
                    <CheckIcon width={16} height={16} color="#4ADE80" />
                  ) : (
                    <InfoCircleIcon width={16} height={16} color="#A1B0CA" />
                  )}
                  <Text
                    style={[
                      styles.ruleText,
                      {
                        color: hasUpperCase ? "#4ADE80" : "#A1B0CA",
                      },
                    ]}
                  >
                    Используйте хотя бы одну заглавную букву
                  </Text>
                </View>
              </View>
            </View>

            <ControlledInput
              control={control}
              name="confirmPassword"
              label="Повторите пароль"
              placeholder="Введите ещё раз"
              type="password"
              error={errors.confirmPassword}
            />
          </View>

          {/* Чекбокс согласия */}
          <View style={styles.agreementContainer}>
            <TouchableOpacity
              onPress={() => {
                const newValue = !agreeToTerms;
                setAgreeToTerms(newValue);
                setValue("agreeToTerms", newValue);
              }}
            >
              {agreeToTerms ? (
                <CheckBoxIcon width={18} height={18} color="#19A7E9" />
              ) : (
                <View style={styles.checkboxEmpty} />
              )}
            </TouchableOpacity>
            <Text style={[styles.agreementText, { color: colors.grey900 }]}>
              Я принимаю Условия использования и Политику конфиденциальности
            </Text>
          </View>
        </View>

        {/* Кнопка продолжить */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              console.log("Button pressed, agreeToTerms:", agreeToTerms);
              console.log("Form errors:", errors);
              handleSubmit(onSubmit)();
            }}
            style={styles.continueButton}
          >
            Продолжить
          </Button>
        </View>
      </KeyboardScrollView>
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  sizes,
  fonts,
  weights,
}: {
  colors: any;
  sizes: any;
  fonts: any;
  weights: any;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    formContainer: {
      gap: 24,
    },
    headerContainer: {
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontFamily: "Onest",
      fontWeight: "500",
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: -0.5,
      textAlign: "center",
    },
    subtitle: {
      fontFamily: "Onest",
      fontWeight: "400",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -0.5,
      textAlign: "center",
    },
    fieldsContainer: {
      gap: 16,
      width: "100%",
    },
    passwordContainer: {
      gap: 12,
    },
    validationRules: {
      gap: 8,
    },
    ruleItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    ruleText: {
      fontFamily: "Onest",
      fontWeight: "400",
      fontSize: 12,
      lineHeight: 16,
    },
    agreementContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    checkboxEmpty: {
      width: 18,
      height: 18,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: "#EAF0F6",
      backgroundColor: "#EAF0F6",
      marginTop: 3,
    },
    agreementText: {
      flex: 1,
      fontFamily: "Onest",
      fontWeight: "400",
      fontSize: 14,
      lineHeight: 20,
    },
    buttonContainer: {
      paddingHorizontal: 8,
      paddingBottom: 8,
    },
    continueButton: {
      borderRadius: 16,
    },
    disabledButton: {
      backgroundColor: "#EFF3F8",
    },
  });

export default RegistrationDataScreen;
