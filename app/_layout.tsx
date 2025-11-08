import { ErrorBoundary } from "@components/ui-kit/error-boundary";
import Loading from "@components/ui-kit/loading";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useGetMe } from "@/src/modules/auth/api/use-get-me";
import { useAuthStore } from "@/src/modules/auth/stores/auth.store";
import { queryClient } from "@/src/shared/api/configs/query-client-config";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { ThemeProvider } from "../src/shared/use-theme";

// Подавляем известную ошибку React Native Fabric при hot reload
// Это не критичная ошибка и не влияет на работу приложения
// ВАЖНО: Эта ошибка приходит из нативного Android кода, поэтому её нельзя
// полностью подавить из JavaScript. Она видна только в Android Logcat.
if (__DEV__) {
  // Подавляем через LogBox (для React Native DevTools)
  LogBox.ignoreLogs([
    'Unable to find viewState',
    'RetryableMountingLayerException',
    'Surface stopped: false',
    'ReactNoCrashSoftException',
  ]);

  // Также фильтруем console.error (на случай если ошибка пройдет через JS)
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (
      typeof message === 'string' &&
      (message.includes('Unable to find viewState') ||
       message.includes('RetryableMountingLayerException') ||
       message.includes('Surface stopped: false') ||
       message.includes('ReactNoCrashSoftException'))
    ) {
      // Тихо игнорируем эту ошибку в dev режиме
      return;
    }
    originalError.apply(console, args);
  };
}

const RootStack = () => {
  const {
    isAuthenticated,
    isLoading,
    isCheckingAuth,
    isFirstEnter,
    isInitialized,
    setIsInitialized,
    setAuth,
    setCheckingAuth,
    user
  } = useAuthStore();

  const { data: userMe, isLoading: isLoadingGetMe } = useGetMe();

  useEffect(() => {
    if (!isInitialized || isLoading) {
      return;
    }

    if (userMe) {
      setAuth(userMe);
    } else if (!isLoadingGetMe) {
      setCheckingAuth(false);
    }

    if (isAuthenticated) {
      console.log(user?.cityId, "user?.cityIduser?.cityIduser?.cityIduser?.cityIduser?.cityId");

      if (!user?.cityId) {
        router.replace("/(auth)/registration-city");
      } else {
        router.replace("/(protected-tabs)");
      }
    } else if (isFirstEnter && !isCheckingAuth) {
      router.replace("/(auth)/onboarding");
    } else if (!isCheckingAuth) {
      router.replace("/(auth)");
    }
  }, [isAuthenticated, isLoading, isFirstEnter, user, setAuth, isInitialized, userMe, isLoadingGetMe, isCheckingAuth, setCheckingAuth]);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized();
    }
  }, [isInitialized, setIsInitialized]);

  if (isCheckingAuth) {
    return <Loading />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(protected-tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <ErrorBoundary>
              <RootStack />
              <Toaster
                // icons={{
                //   success: <Image width={24} height={24} source={imgSuccess} />,
                //   warning: <Image width={24} height={24} source={imgWarning} />,
                //   error: <Image width={24} height={24} source={imgWarning} />,
                // }}
                toastOptions={{
                  style: {
                    zIndex: 9999,
                  },
                  toastContainerStyle: {
                    zIndex: 9999,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  toastContentStyle: {
                    zIndex: 9999,
                    minWidth: 320,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  titleStyle: {
                    color: "#363636",
                    fontSize: 16,
                    lineHeight: 20,
                  },
                  descriptionStyle: {
                    fontSize: 12,
                    lineHeight: 14,
                    color: "#8E8E8E",
                  },
                }}
                style={{
                  // zIndex: 9999,
                  borderRadius: 22,
                  width: "100%",
                  paddingVertical: 16,
                  // paddingHorizontal: 41,
                }}
                closeButton
                offset={60}
                position="top-center"
              />
              <StatusBar style="auto" />
            </ErrorBoundary>
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
