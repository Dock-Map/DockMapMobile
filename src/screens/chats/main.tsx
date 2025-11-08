import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ReadAllMessageButton } from "./ui/read-all";
import { SettingsButton } from "./ui/settings-button";
import { SupportButton } from "./ui/support-button";
import { NotificationsList } from "./ui/notifications-list";

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  description: string;
  type: "booking" | "system" | "support";
  unreadCount?: number;
  descriptionStyle?: "label" | "body";
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Бронирования",
    time: "08:55",
    description:
      "Напоминаем: завтра в 10:00 у вас забронировано место в яхт-клубе «Адмирал». Чтобы избежать задержек, приезжайте за 15 минут до начала стоянки.",
    type: "booking",
    unreadCount: 1,
    descriptionStyle: "label",
  },
  {
    id: "2",
    title: "Система",
    time: "пятница",
    description:
      "Включите уведомления, чтобы всегда быть в курсе новостей и обновлений.",
    type: "system",
    descriptionStyle: "body",
  },
  {
    id: "3",
    title: "Поддержка",
    time: "пятница",
    description: "Опишите вашу проблему и мы поможем вам!",
    type: "support",
    descriptionStyle: "label",
  },
];

export default function ChatsScreen() {
  const handleNotificationPress = (id: string) => {
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification?.type === "booking") {
      router.push("/(protected-tabs)/chats/booking" as any);
    } else {
      console.log("Notification pressed:", id);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Чаты</Text>

          <View style={styles.headerActions}>
            <ReadAllMessageButton />

            <SettingsButton />
          </View>
        </View>

        <SupportButton />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.notificationsWrapper}>
          <NotificationsList
            notifications={mockNotifications}
            onNotificationPress={handleNotificationPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
  },
  scrollContent: {
    paddingVertical: 8,
    alignItems: "center",
  },
  notificationsWrapper: {
    width: "100%",
    alignItems: "center",
  },
});
