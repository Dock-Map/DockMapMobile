import { SettingsIcon } from "@/src/shared/components/icons/SettingsIcon";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export const SettingsButton = () => {
  const router = useRouter();
  const onPress = () => {
    router.push("/(protected-tabs)/chats/settings" as any);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <SettingsIcon />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    width: 44,
    height: 44,
    backgroundColor: "#EFF3F8",
    borderRadius: 12,
    flexGrow: 0,
  },
});
