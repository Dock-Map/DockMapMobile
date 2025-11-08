import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowBackIcon } from "@/src/shared/components/icons";
import calendarIcon from "../../../assets/images/calendar.png";
import { Image } from "expo-image";
import { BookingMessagesList, BookingMessagesGroup } from "./ui/booking";

const mockMessagesGroups: BookingMessagesGroup[] = [
  {
    date: new Date().toISOString(),
    messages: [
      {
        id: "1",
        type: "reminder",
        content:
          "Напоминаем: завтра в 10:00 у вас забронировано место в яхт-клубе «Адмирал». Чтобы избежать задержек, приезжайте за 15 минут до начала стоянки.",
        time: "08:55",
      },
    ],
  },
  {
    date: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: "2",
        type: "booking_confirmed",
        title: "Бронь подтверждена",
        content:
          "Ваша бронь успешно подтверждена: место № 24 в яхт-клубе «Лазурный берег» закреплено за вашей яхтой с 12 по 15 сентября.",
        time: "14:21",
        hasActionButton: true,
        actionButtonText: "К брони",
        onActionPress: () => {
          console.log("Navigate to booking details");
        },
      },
      {
        id: "3",
        type: "booking_cancelled",
        title: "Отмена брони",
        content:
          "Вы отменили бронь места № 24 в яхт-клубе Лазурный берег.",
        time: "12:00",
      },
    ],
  },
  {
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    messages: [
      {
        id: "4",
        type: "booking_confirmed",
        title: "Бронь подтверждена",
        content:
          "Ваша бронь успешно подтверждена: место № 24 в яхт-клубе «Лазурный берег» закреплено за вашей яхтой с 12 по 15 сентября.",
        time: "14:21",
        date: "9 сентября",
        hasActionButton: true,
        actionButtonText: "К брони",
        onActionPress: () => {
          console.log("Navigate to booking details");
        },
      },
      {
        id: "5",
        type: "notification",
        content: "Уведомление",
        time: "12:00",
      },
    ],
  },
];

export default function BookingScreen() {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowBackIcon style={styles.backIcon} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Image source={calendarIcon} style={styles.headerTitleIcon} />
            <Text style={styles.headerTitle}>Бронирования</Text>
          </View>
        </View>
      </View>
      <BookingMessagesList
        messagesGroups={mockMessagesGroups}
        newMessagesCount={1}
      />
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    // flex: 1,
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
    color: "#1F2937",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  headerTitleIcon: {
    backgroundColor: "#EFF3F8",
    width: 44,
    height: 44,
    borderRadius: 16,
    padding: 10,
  },
  headerRight: {
    padding: 4,
  },
  headerRightIcon: {
    width: 24,
    height: 24,
  },
});

