import { Stack } from "expo-router";
import "react-native-reanimated";

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="search" />
      <Stack.Screen name="details" />
    </Stack>
  );
}

