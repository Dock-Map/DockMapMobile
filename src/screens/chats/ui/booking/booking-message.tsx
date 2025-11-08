import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BookingMessage } from "./types";

interface BookingMessageProps {
  message: BookingMessage;
}

export function BookingMessageComponent({ message }: BookingMessageProps) {

  const shouldShowActionButton = message.hasActionButton && message.actionButtonText;

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        {message.title && <Text style={styles.title}>{message.title}</Text>}
        <Text style={styles.content}>{message.content}</Text>
        <View style={[styles.footer, shouldShowActionButton ? { justifyContent: "space-between" } : { justifyContent: "flex-end" }]}>
          {shouldShowActionButton && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={message.onActionPress}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>
                {message.actionButtonText}
              </Text>
            </TouchableOpacity>
          )}
            <Text style={styles.time}>{message.time}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bubble: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    maxWidth: "85%",
    alignSelf: "flex-start",
  },
  title: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 20,
    color: "#071013",
    marginBottom: 8,
  },
  content: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: "#071013",
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: "#0097E0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 87,
  },
  actionButtonText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "#465566",
  },
});
