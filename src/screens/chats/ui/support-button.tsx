import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import supportIcon from "../../../../assets/images/support-avatar.png";
import { Image } from "expo-image";

export const SupportButton = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Image source={supportIcon} style={styles.image} />
      <Text style={styles.text} numberOfLines={1}>
        Поддержка
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 0,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  text: {
    fontSize: 10,
    fontWeight: "bold",
    flexShrink: 0,
  },
});
