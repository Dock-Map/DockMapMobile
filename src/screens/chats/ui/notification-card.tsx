import React, { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationCardProps {
  title: string;
  time: string;
  description: string;
  avatar: ReactNode;
  onPress?: () => void;
  descriptionStyle?: "label" | "body";
}

export function NotificationCard({
  title,
  time,
  description,
  avatar,
  onPress,
  descriptionStyle = "label",
}: NotificationCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrapper}>{avatar}</View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text
          style={[
            styles.description,
            descriptionStyle === "body" ? styles.descriptionBody : null,
          ]}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    gap: 12,
    width: "100%",
    maxWidth: 343,
    minHeight: 86,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#071013",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarWrapper: {
    flexShrink: 0,
  },
  content: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
    flex: 1,
    height: 62,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    height: 20,
  },
  title: {
    flex: 1,
    fontFamily: "Onest",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#071013",
  },
  time: {
    fontFamily: "Onest",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "#465566",
    flexShrink: 0,
  },
  description: {
    fontFamily: "Onest",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#071013",
    width: "100%",
    minHeight: 40,
  },
  descriptionBody: {
    fontWeight: "400",
    color: "#465566",
  },
});

