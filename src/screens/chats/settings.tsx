import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowBackIcon } from "@/src/shared/components/icons";

interface SwitchComponentProps {
  name: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}
const SwitchComponent: React.FC<SwitchComponentProps> = ({
  name,
  subtitle,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{name}</Text>
        {subtitle && <Text style={styles.settingDescription}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        style={styles.switch}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
};

export default function NotificationSettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(false);

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowBackIcon width={24} height={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройки уведомлений</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Секция "Общие" */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Общие</Text>
          <SwitchComponent
            name="Пуш-уведомления"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
        </View>

        {/* Секция "Типы уведомлений" */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Типы уведомлений</Text>

          <SwitchComponent
            name="Бронирования"
            subtitle="Подтверждения и изменения брони"
            value={bookingNotifications}
            onValueChange={setBookingNotifications}
          />

          <SwitchComponent
            name="Напоминания"
            value={reminderNotifications}
            onValueChange={setReminderNotifications}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: "Onest",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#9CA3AF",
    marginBottom: 12,
    fontFamily: "Onest",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#EFF3F8",
    borderRadius: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#1F2937",
    fontFamily: "Onest",
  },
  settingDescription: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    marginTop: 4,
    fontFamily: "Onest",
  },
  switch: {
    width: 40,
    height: 20,
    borderRadius: 10,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "transparent",
  },
});
