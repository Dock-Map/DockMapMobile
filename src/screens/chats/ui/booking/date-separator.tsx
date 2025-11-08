import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DateSeparatorProps {
  date: string;
  isNewMessages?: boolean;
}

export function DateSeparator({
  date,
  isNewMessages = false,
}: DateSeparatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.date}>{date}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  date: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "#465566",
    flexShrink: 0,
  },
});

