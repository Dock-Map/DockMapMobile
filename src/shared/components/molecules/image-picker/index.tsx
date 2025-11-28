import { Alert, Image, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePickerExpo from 'expo-image-picker';
import Button from '@/src/shared/components/ui-kit/button';
import { useTheme } from '@/src/shared/use-theme';
import { Icon } from '@/src/shared/components/ui-kit/icon';

interface ImagePickerProps {
  image: ImagePickerExpo.ImagePickerAsset | null;
  onImageSelected: (image: ImagePickerExpo.ImagePickerAsset | null) => void;
}

export default function ImagePicker({ image, onImageSelected }: ImagePickerProps) {
  const { colors } = useTheme();

  const pickImage = async () => {
    const permissionResult = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Требуется разрешение', 'Для выбора изображения необходимо разрешение на доступ к медиатеке.');
      return;
    }

    let result = await ImagePickerExpo.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0]);
    }
  };

  const removeImage = () => {
    onImageSelected(null);
  };

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <TouchableOpacity 
            style={[styles.removeButton, { backgroundColor: colors.white }]} 
            onPress={removeImage}
            activeOpacity={0.8}
          >
            <Icon name="xCircle" size={20} color={String(colors.red)} />
          </TouchableOpacity>
          <View style={styles.changeButton}>
            <Button type="secondary" size="small" onPress={pickImage}>
              Изменить фото
            </Button>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.placeholder, { backgroundColor: colors.grey100, borderColor: colors.grey400 }]} 
          onPress={pickImage}
          activeOpacity={0.8}
        >
          <View style={styles.placeholderContent}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary500_12 }]}>
              <Icon name="widget" size={24} color={String(colors.primary500)} />
            </View>
            <Text style={[styles.placeholderText, { color: colors.grey700 }]}>
              Добавить фото
            </Text>
            <Text style={[styles.placeholderSubtext, { color: colors.grey500 }]}>
              Нажмите, чтобы выбрать изображение
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  placeholder: {
    width: '100%',
    minHeight: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholderContent: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Onest',
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Onest',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#EFF3F8',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
});