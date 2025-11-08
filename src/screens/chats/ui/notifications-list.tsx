import React from "react";
import { StyleSheet, View } from "react-native";
import { NotificationCard } from "./notification-card";
import { NotificationAvatar } from "./notification-avatar";
import { NotificationBadge } from "./notification-badge";
import { Image } from "expo-image";

import supportIcon from "../../../../assets/images/support-avatar.png";
import calendarIcon from "../../../../assets/images/calendar.png";
import settingsIcon from "../../../../assets/images/setings.png";

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  description: string;
  type: "booking" | "system" | "support";
  unreadCount?: number;
  descriptionStyle?: "label" | "body";
}

interface NotificationsListProps {
  notifications: NotificationItem[];
  onNotificationPress?: (id: string) => void;
}

export function NotificationsList({
  notifications,
  onNotificationPress,
}: NotificationsListProps) {
  const renderAvatar = (
    type: NotificationItem["type"],
    unreadCount?: number
  ) => {
    switch (type) {
      case "booking":
        return (
          <NotificationAvatar
            badge={
              unreadCount ? (
                <NotificationBadge count={unreadCount} />
              ) : undefined
            }
          >
            <Image source={calendarIcon} style={{ width: 44, height: 44 }} />
          </NotificationAvatar>
        );
      case "system":
        return (
          <NotificationAvatar>
            <Image source={settingsIcon} style={{ width: 44, height: 44 }} />
          </NotificationAvatar>
        );
      case "support":
        return (
          <NotificationAvatar gradient>
            <Image source={supportIcon} style={{ width: 44, height: 44 }} />
          </NotificationAvatar>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          title={notification.title}
          time={notification.time}
          description={notification.description}
          avatar={renderAvatar(notification.type, notification.unreadCount)}
          onPress={() => onNotificationPress?.(notification.id)}
          descriptionStyle={notification.descriptionStyle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    padding: 0,
    gap: 8,
    width: "100%",
    maxWidth: 343,
    flexShrink: 0,
  },
});
