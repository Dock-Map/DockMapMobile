import { AppointmentsIcon } from "@/src/shared/components/icons/tabs-icon/apoitments-icon";
import { ChatIcon } from "@/src/shared/components/icons/tabs-icon/chat-icon";
import { FavoriteIcon } from "@/src/shared/components/icons/tabs-icon/favorite-icon";
import { HomeIcon } from "@/src/shared/components/icons/tabs-icon/home-icon";
import { ProfileIcon } from "@/src/shared/components/icons/tabs-icon/profile-icon";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
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
      const TabBarComponent = ({ state, descriptors, navigation }: any) => {
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
            style={{ position: "relative", backgroundColor: "transparent" }}
          >
            <LinearGradient
              colors={["rgba(25, 167, 233, 0.12)", "rgba(25, 167, 233, 0.16)"]}
              style={{
                height: 90,
                width: "100%",
              }}
            >
              <BlurView
                intensity={20}
                tint="light"
                style={{
                  height: 90,
                  width: "100%",
                  paddingHorizontal: 16,
                }}
              />
            </LinearGradient>
            <View
              style={{
                backgroundColor: "white",
                zIndex: 0,
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
                position: "absolute",
                width: "90%",
                top: -insets.bottom + 10,
                left: screenWidth * 0.5,
                transform: [{ translateX: -(screenWidth * 0.45) }],
                borderRadius: 24,
                flexDirection: "row",
                gap: 20,
                justifyContent: "space-evenly",
                paddingVertical: 12,
                paddingHorizontal: 16,
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
            </View>
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
