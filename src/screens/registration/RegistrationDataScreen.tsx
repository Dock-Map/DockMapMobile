import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../../shared/components/ui-kit/button';
import ControlledInput from '../../shared/components/ui-kit/controlled-input';
import { useTheme } from '../../shared/use-theme';
import { ArrowLeftIcon, CheckIcon, InfoCircleIcon, CheckBoxIcon } from '../../shared/components/icons';
import { registrationDataSchema, RegistrationDataFormData } from '../../shared/schemas/auth-schemas';

export const RegistrationDataScreen: React.FC = () => {
  const { colors, fonts, weights, sizes } = useTheme();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const styles = createStyles({ colors, fonts, weights, sizes });
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegistrationDataFormData>({
    resolver: yupResolver(registrationDataSchema) as any,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });
  
  const password = watch('password');

  const onSubmit = (data: any) => {
    console.log('onSubmit called with data:', data);
    
    // Сохраняем данные регистрации в глобальном объекте
    (global as any).registrationData = {
      ...(global as any).registrationData,
      ...data
    };
    
    console.log('Navigating to registration-city');
    // Переходим к выбору города
    router.push('/(auth)/registration-city' as any);
  };

  const handleBack = () => {
    router.back();
  };

  // Вычисляем валидность правил пароля
  const hasMinLength = password && password.length >= 8;
  const hasDigit = password && /\d/.test(password);
  const hasUpperCase = password && /[A-ZА-Я]/.test(password);

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
              <Text style={styles.badgeTextActive}>2</Text>/3
            </Text>
          </View>
        </View>
      </View>

      {/* Основной контент */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.black }]}>
              Регистрация судовладельца
            </Text>
            <Text style={[styles.subtitle, { color: colors.grey900 }]}>
              Зарегистрируйте аккаунт и{'\n'}бронируйте яхт-клубы легко
            </Text>
          </View>

          {/* Поля формы */}
          <View style={styles.fieldsContainer}>
            <ControlledInput
              control={control}
              name="fullName"
              label="ФИО"
              placeholder="Иванов Иван"
              error={errors.fullName}
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
                  <Text style={[styles.ruleText, { 
                    color: hasMinLength ? '#4ADE80' : '#A1B0CA'
                  }]}>
                    Минимум 8 символов
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  {hasDigit ? (
                    <CheckIcon width={16} height={16} color="#4ADE80" />
                  ) : (
                    <InfoCircleIcon width={16} height={16} color="#A1B0CA" />
                  )}
                  <Text style={[styles.ruleText, { 
                    color: hasDigit ? '#4ADE80' : '#A1B0CA'
                  }]}>
                    Используйте хотя бы одну цифру
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  {hasUpperCase ? (
                    <CheckIcon width={16} height={16} color="#4ADE80" />
                  ) : (
                    <InfoCircleIcon width={16} height={16} color="#A1B0CA" />
                  )}
                  <Text style={[styles.ruleText, { 
                    color: hasUpperCase ? '#4ADE80' : '#A1B0CA'
                  }]}>
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
                setValue('agreeToTerms', newValue);
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
              console.log('Button pressed, agreeToTerms:', agreeToTerms);
              console.log('Form errors:', errors);
              handleSubmit(onSubmit)();
            }}
            style={styles.continueButton}

          >
            Продолжить
          </Button>
        </View>
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
  colors: any;
  sizes: any;
  fonts: any;
  weights: any;
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
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
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  fieldsContainer: {
    gap: 16,
    width: '100%',
  },
  passwordContainer: {
    gap: 12,
  },
  validationRules: {
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ruleText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkboxEmpty: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#EAF0F6',
    backgroundColor: '#EAF0F6',
    marginTop: 3,
  },
  agreementText: {
    flex: 1,
    fontFamily: 'Onest',
    fontWeight: '400',
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
    backgroundColor: '#EFF3F8',
  },
});

export default RegistrationDataScreen;