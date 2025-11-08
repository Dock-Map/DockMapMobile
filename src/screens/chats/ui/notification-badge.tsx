import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    width: 16,
    height: 16,
    backgroundColor: "#FF0035",
    borderRadius: 100,
    shadowColor: "#FF0035",
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.5,
    elevation: 3,
  },
  badgeText: {
    fontFamily: "Onest",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
  },
});

