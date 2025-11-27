import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@/src/shared/use-theme';
import ControlledInput from '@/src/shared/components/ui-kit/controlled-input';
import Button from '@/src/shared/components/ui-kit/button';
import { createClubFormSchema, CreateClubFormData } from './model/zod';

interface CreateClubFormProps {
  point: GeoJSON.Feature;
  onSubmit?: (data: CreateClubFormData & { latitude?: number; longitude?: number }) => void;
}

export const CreateClubForm: React.FC<CreateClubFormProps> = ({ 
  point, 
  onSubmit: onSubmitProp 
}) => {
  const { colors, fonts, weights, sizes } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClubFormData>({
    resolver: zodResolver(createClubFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      description: '',
      imageUrl: '',
      totalSpots: undefined,
      availableSpots: undefined,
      features: [],
      tariffs: [],
      services: [],
    },
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features' as any,
  });

  const { fields: tariffFields, append: appendTariff, remove: removeTariff } = useFieldArray({
    control,
    name: 'tariffs',
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control,
    name: 'services',
  });

  const onSubmit = (data: CreateClubFormData) => {
    const submitData = {
      ...data,
      // @ts-ignore
      latitude: point.geometry?.coordinates?.[1] as number,
      // @ts-ignore
      longitude: point.geometry?.coordinates?.[0] as number,
    };
    onSubmitProp?.(submitData);
  };

  const styles = createStyles({ colors, fonts, weights, sizes });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Основные поля */}
      <View style={styles.section}>
        <ControlledInput
          control={control}
          name="name"
          label="Название клуба"
          placeholder="Введите название клуба"
          error={errors.name}
        />
      </View>

      <View style={styles.section}>
        <ControlledInput
          control={control}
          name="address"
          label="Адрес"
          placeholder="Введите адрес клуба"
          error={errors.address}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <ControlledInput
              control={control}
              name="phone"
              label="Телефон"
              placeholder="+7 (XXX) XXX-XX-XX"
              error={error}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <ControlledInput
          control={control}
          name="email"
          label="Email (необязательно)"
          placeholder="email@example.com"
          type="mail"
          error={errors.email}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Описание (необязательно)</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textArea}
              placeholder="Введите описание клуба"
              placeholderTextColor={colors.grey500}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}
      </View>

      <View style={styles.section}>
        <ControlledInput
          control={control}
          name="imageUrl"
          label="URL изображения (необязательно)"
          placeholder="https://example.com/image.jpg"
          error={errors.imageUrl}
        />
      </View>

      {/* Количество мест */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Всего мест (необязательно)</Text>
          <Controller
            control={control}
            name="totalSpots"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[styles.numberInput, error && styles.numberInputError]}
                  placeholder="0"
                  placeholderTextColor={colors.grey500}
                  value={value?.toString() || ''}
                  onChangeText={(text: string) => {
                    const num = text ? Number(text) : undefined;
                    onChange(num);
                  }}
                  onBlur={onBlur}
                  keyboardType="numeric"
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </>
            )}
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Доступно мест (необязательно)</Text>
          <Controller
            control={control}
            name="availableSpots"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[styles.numberInput, error && styles.numberInputError]}
                  placeholder="0"
                  placeholderTextColor={colors.grey500}
                  value={value?.toString() || ''}
                  onChangeText={(text: string) => {
                    const num = text ? Number(text) : undefined;
                    onChange(num);
                  }}
                  onBlur={onBlur}
                  keyboardType="numeric"
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </>
            )}
          />
        </View>
      </View>

      {/* Особенности */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Особенности (необязательно)</Text>
          <TouchableOpacity
            onPress={() => appendFeature('')}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Добавить</Text>
          </TouchableOpacity>
        </View>
        {featureFields.map((field, index) => (
          <View key={field.id} style={styles.arrayItem}>
            <Controller
              control={control}
              name={`features.${index}` as any}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <TextInput
                    style={[styles.textInput, error && styles.textInputError]}
                    placeholder="Например: Охрана территории"
                    placeholderTextColor={colors.grey500}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
            />
            <TouchableOpacity
              onPress={() => removeFeature(index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Тарифы */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Тарифы (необязательно)</Text>
          <TouchableOpacity
            onPress={() => appendTariff({ unit: '', pricePerUnit: 0 })}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Добавить</Text>
          </TouchableOpacity>
        </View>
        {tariffFields.map((field, index) => (
          <View key={field.id} style={styles.arrayItem}>
            <Controller
              control={control}
              name={`tariffs.${index}.unit` as any}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <TextInput
                    style={[styles.textInput, error && styles.textInputError]}
                    placeholder="Единица (день/месяц/год)"
                    placeholderTextColor={colors.grey500}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
            />
            <Controller
              control={control}
              name={`tariffs.${index}.pricePerUnit` as any}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <TextInput
                    style={[styles.numberInput, error && styles.numberInputError]}
                    placeholder="Цена"
                    placeholderTextColor={colors.grey500}
                    value={value?.toString() || ''}
                    onChangeText={(text: string) => {
                      const num = text ? Number(text) : 0;
                      onChange(num);
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                  />
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
            />
            <TouchableOpacity
              onPress={() => removeTariff(index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Сервисы */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Сервисы (необязательно)</Text>
          <TouchableOpacity
            onPress={() => appendService({ name: '', pricePerUnit: 0, unit: '' })}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Добавить</Text>
          </TouchableOpacity>
        </View>
        {serviceFields.map((field, index) => (
          <View key={field.id} style={styles.arrayItem}>
            <Controller
              control={control}
              name={`services.${index}.name` as any}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <TextInput
                    style={[styles.textInput, error && styles.textInputError]}
                    placeholder="Название сервиса"
                    placeholderTextColor={colors.grey500}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
            />
            <Controller
              control={control}
              name={`services.${index}.pricePerUnit` as any}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <TextInput
                    style={[styles.numberInput, error && styles.numberInputError]}
                    placeholder="Цена"
                    placeholderTextColor={colors.grey500}
                    value={value?.toString() || ''}
                    onChangeText={(text: string) => {
                      const num = text ? Number(text) : 0;
                      onChange(num);
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                  />
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
            />
            <Controller
              control={control}
              name={`services.${index}.unit` as any}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <TextInput
                    style={[styles.textInput, error && styles.textInputError]}
                    placeholder="Единица измерения"
                    placeholderTextColor={colors.grey500}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
            />
            <TouchableOpacity
              onPress={() => removeService(index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.submitSection}>
        <Button
          onPress={handleSubmit(onSubmit)}
          type="primary"
          size="base"
        >
          Создать клуб
        </Button>
      </View>
    </ScrollView>
  );
};

const createStyles = ({ colors, fonts, weights, sizes }: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    section: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: fonts.text2,
      fontWeight: weights.medium,
      fontSize: 16,
      color: colors.black,
    },
    label: {
      fontFamily: fonts.text3,
      fontWeight: weights.medium,
      fontSize: 12,
      lineHeight: 16,
      color: colors.grey900,
      marginBottom: 4,
    },
    textArea: {
      minHeight: 100,
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.grey100,
      fontFamily: fonts.text2,
      fontSize: 16,
      color: colors.black,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    halfWidth: {
      flex: 1,
    },
    arrayItem: {
      marginBottom: 12,
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.grey100,
      gap: 12,
    },
    textInput: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.white,
      fontFamily: fonts.text2,
      fontSize: 16,
      color: colors.black,
      borderWidth: 1,
      borderColor: colors.grey200,
    },
    textInputError: {
      borderColor: colors.red,
    },
    numberInput: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.white,
      fontFamily: fonts.text2,
      fontSize: 16,
      color: colors.black,
      borderWidth: 1,
      borderColor: colors.grey200,
    },
    numberInputError: {
      borderColor: colors.red,
    },
    addButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.primary500,
    },
    addButtonText: {
      fontFamily: fonts.button,
      fontWeight: weights.medium,
      fontSize: 14,
      color: colors.white,
    },
    removeButton: {
      marginTop: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.red,
      alignSelf: 'flex-start',
    },
    removeButtonText: {
      fontFamily: fonts.button,
      fontWeight: weights.medium,
      fontSize: 14,
      color: colors.white,
    },
    errorText: {
      fontFamily: fonts.text3,
      fontSize: 12,
      color: colors.red,
      marginTop: 4,
    },
    submitSection: {
      marginTop: 20,
      marginBottom: 20,
    },
  });
