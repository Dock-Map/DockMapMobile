import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import EmptyPageImage from '../../../../assets/images/empty-page.png'
import Button from '@/src/shared/components/ui-kit/button'


export const EmptyPage = () => {
  return (
    <View style={styles.container}  >
      <Image source={EmptyPageImage} style={styles.image} />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Пока штиль…</Text>
        <Text style={styles.description}>
          Здесь появятся напоминания о бронях, новости клубов и другие важные события
        </Text>
      </View>

      <Button>
        К списку яхт-клубов
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 160,
    height: 160,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
    maxWidth: 343,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Onest',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    color: '#071013',
  },
  description: {
    fontFamily: 'Onest',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#465566',
    alignSelf: 'stretch',
  },
})