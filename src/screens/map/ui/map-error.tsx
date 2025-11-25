import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const MapError = ({ error }: { error: string }) => {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ошибка инициализации карты:</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
});
