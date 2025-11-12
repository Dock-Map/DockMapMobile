import { AppointmentsIcon } from "@/src/shared/components/icons/tabs-icon/apoitments-icon";
import { ChatIcon } from "@/src/shared/components/icons/tabs-icon/chat-icon";
import { FavoriteIcon } from "@/src/shared/components/icons/tabs-icon/favorite-icon";
import { HomeIcon } from "@/src/shared/components/icons/tabs-icon/home-icon";
import { ProfileIcon } from "@/src/shared/components/icons/tabs-icon/profile-icon";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Мемоизируем функции иконок
  const homeIcon = useCallback(
    ({ color, size }: any) => <HomeIcon color={color} />,
    []
  );
  const appointmentsIcon = useCallback(
    ({ color, size }: any) => <AppointmentsIcon color={color} />,
    []
  );
  const favoriteIcon = useCallback(
    ({ color, size }: any) => <FavoriteIcon color={color} />,
    []
  );
  const chatIcon = useCallback(
    ({ color, size }: any) => <ChatIcon color={color} />,
    []
  );
  const profileIcon = useCallback(
    ({ color, size }: any) => <ProfileIcon color={color} />,
    []
  );

  const tabBar = useMemo(
    () => {
      const TabBarComponent = ({ state, descriptors, navigation, style }: any) => {
        if (!isMountedRef.current) {
          return null;
        }

        // Проверяем, есть ли вложенные маршруты в активном табе
        const activeRoute = state.routes[state.index];
        const activeRouteState = activeRoute?.state;
        const hasNestedRoutes = activeRouteState && activeRouteState.index > 0;
        const isNestedScreen = activeRouteState?.routes?.length > 1;

        // Скрываем таб-бар, если находимся на вложенном экране
        if (hasNestedRoutes || isNestedScreen) {
          return null;
        }

        return (
          <View
            style={[
              style,
              {
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "transparent",
                alignItems: "center",
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <BlurView
              pointerEvents="none"
              intensity={20}
              tint="light"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                top: 10,
              }}
            />
            <BlurView
              intensity={35}
              tint="light"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 1,
                // iOS shadow
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                // Android shadow
                elevation: 5,
                width: Math.min(screenWidth * 0.9, 380),
                borderRadius: 24,
                flexDirection: "row",
                gap: 20,
                justifyContent: "space-evenly",
                paddingVertical: 12,
                paddingHorizontal: 16,
                overflow: "hidden",
              }}
            >
              {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                return (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      minWidth: 40,
                      minHeight: 40,
                      gap: 5,
                    }}
                    onPress={() => navigation.navigate(route.name)}
                    key={route.key}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    >
                      {options.tabBarIcon?.({
                        focused: isFocused,
                        color: isFocused ? "#19A7E9" : "#7D8EAA",
                        size: 24,
                      })}
                    </View>
                    <Text
                      style={{
                        color: isFocused ? "#19A7E9" : "#7D8EAA",
                        fontSize: 10,
                        lineHeight: 16,
                        fontWeight: "500",
                      }}
                    >
                      {route.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </BlurView>
          </View>
        );
      };
      TabBarComponent.displayName = 'TabBar';
      return TabBarComponent;
    },
    [screenWidth, insets]
  );

  return (
    <BottomSheetModalProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={tabBar}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: homeIcon,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: appointmentsIcon,
          }}
        />
        <Tabs.Screen
          name="favorite"
          options={{
            title: "Favorite",
            tabBarIcon: favoriteIcon,
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: "Chats",
            tabBarIcon: chatIcon,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: profileIcon,
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  );
}
