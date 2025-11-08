import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ReadIcon } from "@/src/shared/components/icons/ReadIcon";
import { showToast } from "@/src/shared/utils/show-toast";

export const ReadAllMessageButton = () => {

  const onPress = () => {
    showToast.success('Все сообщения прочитаны');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <ReadIcon />
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
      borderRadius: 12,
      flexGrow: 0,
    },
  });
  
