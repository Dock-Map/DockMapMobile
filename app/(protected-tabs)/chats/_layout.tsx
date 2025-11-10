import { Stack } from "expo-router";
import "react-native-reanimated";

export default function ChatsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}

