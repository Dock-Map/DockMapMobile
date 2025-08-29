import { Icon } from "@/src/shared/components/ui-kit/icon";
import { useTheme } from "@/src/shared/use-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import "react-native-get-random-values";

interface VKAuthConfig {
  clientId: string;
  redirectUri: string; // URL вашего бэкенда, который обрабатывает callback
  scope?: string;
  state?: string;
}

interface VKAuthWithoutSdkProps {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  config: VKAuthConfig;
}

interface VKUserInfo {
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    authProvider: string;
    email: string | null;
    id: string;
  };
}

// Генерация случайной строки для code_verifier
function generateCodeVerifier(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43;

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

// Генерация state параметра
function generateState(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let result = "";
  const length = Math.floor(Math.random() * (64 - 32 + 1)) + 32;

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

// Создание SHA256 хеша с expo-crypto
async function sha256(message: string): Promise<string> {
  try {
    const hashHex = await crypto.digestStringAsync(
      crypto.CryptoDigestAlgorithm.SHA256,
      message
    );
    return hashHex;
  } catch (error) {
    console.error("Ошибка в sha256:", error);
    throw new Error("Не удалось создать SHA256 хеш");
  }
}

// Конвертация hex в base64url
function hexToBase64Url(hex: string): string {
  try {
    const bytes = new Uint8Array(
      hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    const base64 = btoa(String.fromCharCode(...bytes));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } catch (error) {
    console.error("Ошибка в hexToBase64Url:", error);
    throw new Error("Не удалось конвертировать hex в base64url");
  }
}

// Создание code_challenge из code_verifier
async function createCodeChallenge(codeVerifier: string): Promise<string> {
  try {
    console.log("Создаем code_challenge для:", codeVerifier);

    const hashHex = await sha256(codeVerifier);
    console.log("SHA256 хеш:", hashHex);

    const codeChallenge = hexToBase64Url(hashHex);
    console.log("Code Challenge:", codeChallenge);

    return codeChallenge;
  } catch (error) {
    console.error("Ошибка при создании code_challenge:", error);
    throw new Error("Не удалось создать code_challenge");
  }
}

// Создание URL для авторизации
async function createAuthUrl(config: VKAuthConfig): Promise<{
  authUrl: string;
  codeVerifier: string;
  state: string;
}> {
  try {
    const codeVerifier = generateCodeVerifier();
    console.log("Сгенерирован code_verifier:", codeVerifier);

    const codeChallenge = await createCodeChallenge(codeVerifier);
    const state = config.state || generateState();

    console.log("Сгенерирован state:", state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: config.clientId,
      scope: config.scope || "email phone",
      redirect_uri: config.redirectUri,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const authUrl = `https://id.vk.com/authorize?${params.toString()}`;

    console.log("Создан URL авторизации:", authUrl);

    return {
      authUrl,
      codeVerifier,
      state,
    };
  } catch (error) {
    console.error("Ошибка при создании URL авторизации:", error);
    throw error;
  }
}

type AuthResponseParams = {
  code?: string;
  state?: string;
  device_id?: string;
  type?: string;
  expires_in?: string;
  ext_id?: string;
};

function parseAuthResponse(url: string): AuthResponseParams | null {
  try {
    const params = new URLSearchParams(url.split("?")[1]);
    const code = params.get("code") || "";
    const state = params.get("state") || "";
    const deviceId = params.get("device_id") || "";
    const type = params.get("type") || "";
    const expiresIn = params.get("expires_in") || "";
    const extId = params.get("ext_id") || "";

    return {
      code: code,
      state: state,
      device_id: deviceId,
      type: type,
      expires_in: expiresIn,
      ext_id: extId,
    };
  } catch (error) {
    console.error("Ошибка при парсинге URL:", error);
    return null;
  }
}

const sendAuthResponse = async (
  params: AuthResponseParams & { codeVerifier: string; state: string },
  config: VKAuthConfig
) => {
  const response = await fetch(`${config.redirectUri}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  console.log(data, "data");
  return data;
};

const VKAuthWithoutSdk: React.FC<VKAuthWithoutSdkProps> = ({
  onSuccess,
  onError,
  config,
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
  const [userInfo, setUserInfo] = useState<VKUserInfo | null>(null);

  const handleVKLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const { authUrl, codeVerifier, state } = await createAuthUrl(config);

      // Сохраняем code_verifier и state для передачи на бэкенд
      await AsyncStorage.setItem("vk_code_verifier", codeVerifier);
      await AsyncStorage.setItem("vk_state", state);

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        "dockmap://auth/vk-callback"
      );

      if (result.type === "success" && result.url) {
        const url = result.url;
        const parsed = parseAuthResponse(url);
        if (parsed) {
          const data = await sendAuthResponse(
            { ...parsed, codeVerifier, state },
            config
          );
          setUserInfo(data);
          onSuccess(data);
        }
      } else if (result.type === "cancel") {
        console.log("Пользователь отменил авторизацию");
      } else {
        throw new Error("Ошибка при авторизации");
      }
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  }, [config, onSuccess, onError]);

  const styles = createStyles({ colors, sizes, fonts, weights });

  return (
    <>
      {!userInfo ? (
        <TouchableOpacity
          style={socialButtonStyle}
          onPress={handleVKLogin}
        >
          <Icon name="vk" size={24} color="#0077FF" />
          <Text style={styles.socialButtonText}>Вконтакте</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.userContainer}>
          {userInfo && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userInfo.user.name.replace("Veremejtsjik", "Moriss")}
              </Text>
              <Text style={styles.userName}>{userInfo.user.authProvider}</Text>
            </View>
          )}
        </View>
      )}
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
  userContainer: {
    width: "100%",
    alignItems: "center",
  },
  userInfo: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  refreshButton: {
    backgroundColor: "#28a745",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
  },
  infoContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
  },
});

export default VKAuthWithoutSdk;
