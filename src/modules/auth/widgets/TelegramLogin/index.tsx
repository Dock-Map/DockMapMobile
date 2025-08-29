import { Icon } from "@/src/shared/components/ui-kit/icon";
import { useTheme } from "@/src/shared/use-theme";
import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import WebView from "react-native-webview";

const TelegramLoginWidget = ({
  user,
  onAuth,
}: {
  user: any;
  onAuth: (user: any) => void;
}) => {
  const { colors, sizes, fonts, weights } = useTheme();

  const socialButtonStyle: ViewStyle = {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.grey100,
    borderRadius: sizes.sm,
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.m,
    minHeight: 50,
    gap: sizes.s,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [webAuthUrl, setWebAuthUrl] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState(false);

  const isLoggedIn = !!user?.user?.id;

  const fetchWebAuthUrl = async () => {
    const response = await fetch(
      `https://dockmapapi-production.up.railway.app/auth/telegram/oauth-link`,
      {
        method: "GET",
      }
    );
    const data = await response.text();
    setWebAuthUrl(data);
    setShowWebView(true);
    setIsLoading(false);
  };

  const handleAuthSuccess = (data: any) => {
    setShowWebView(false);
    setWebAuthUrl(null);
    onAuth(data);
  };

  const styles = createStyles({ colors, sizes, fonts, weights });

  return (
    <>
      {!isLoggedIn && !webAuthUrl && (
        <TouchableOpacity
          style={[socialButtonStyle, { opacity: isLoading ? 0.6 : 1 }]}
          onPress={() => {
            setIsLoading(true);
            fetchWebAuthUrl();
          }}
        >
          <Icon name="telegram" size={24} color="#229ED9" />
          <Text style={styles.socialButtonText}>Telegram</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={() => {
          setShowWebView(false);
        }}
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={() => setShowWebView(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: webAuthUrl! }}
            style={styles.webview}
            onLoad={() => {
              setIsLoading(true);
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
            onNavigationStateChange={(navState) => {
              if (navState.url.includes("#tgAuthResult=")) {
                const serverUrl = navState.url.replace(
                  "#tgAuthResult=",
                  "?tgAuthResult="
                );

                fetch(serverUrl, { method: "GET" })
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data, "data");
                    handleAuthSuccess(data);
                  })
                  .catch((err) => {
                    console.log(err, "err");
                  });
              }
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const createStyles = ({
  colors,
  sizes,
  fonts,
  weights,
}: {
  colors: any;
  sizes: any;
  fonts: any;
  weights: any;
}) => StyleSheet.create({
  socialButtonText: {
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: sizes.text3,
    lineHeight: 20,
    color: colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  webview: {
    flex: 1,
  },
  closeButtonContainer: {
    alignItems: "flex-end",
    padding: 10,
  },
  closeButtonText: {
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TelegramLoginWidget;
