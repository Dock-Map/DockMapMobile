import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface PriceMarkerProps {
  price: string;
  onPress?: () => void;
}

export const PriceMarker: React.FC<PriceMarkerProps> = ({ price, onPress }) => {
  return (
    <View style={styles.container} collapsable={false}>
      {/* Точка (маркер) */}
      <View style={styles.point} />
      
      {/* Ценник */}
      <TouchableOpacity
        style={styles.bubble}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.priceText}>{price}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  point: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00C4CC",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginBottom: 4,
  },
  bubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: "#1A1A1A",
  },
});

