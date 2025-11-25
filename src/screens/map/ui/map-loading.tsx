import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, View , ActivityIndicator , Text } from 'react-native'

export const MapLoading = () => {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Загрузка карты...</Text>
    </View>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});