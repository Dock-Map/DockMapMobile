import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface NotificationAvatarProps {
  children: ReactNode;
  gradient?: boolean;
  badge?: ReactNode;
}

export function NotificationAvatar({
  children,
  gradient = false,
  badge,
}: NotificationAvatarProps) {
  const content = (
    <View style={styles.avatarContainer}>
      {gradient ? (
        <LinearGradient
          colors={["#4ADEDE", "#0097E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarGradient}
        >
          <View style={styles.iconContainer}>{children}</View>
        </LinearGradient>
      ) : (
        <View style={styles.avatar}>
          <View style={styles.iconContainer}>{children}</View>
        </View>
      )}
      {badge && <View style={styles.badgeContainer}>{badge}</View>}
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    backgroundColor: "#EFF3F8",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 2,
  },
});

