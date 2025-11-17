import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorStateProps {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Не удалось загрузить клубы',
  subtitle = 'Проверьте подключение к сети и попробуйте ещё раз.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Повторить</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#FFE4E6',
    gap: 12,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#B91C1C',
  },
  subtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#7F1D1D',
  },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#DC2626',
  },
  buttonText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});


