import { type ExpoConfig } from "@expo/config-types";
import { withAppDelegate, type ConfigPlugin } from "expo/config-plugins";

const withYandexMaps: ConfigPlugin = (config) => {
  return withAppDelegate(config, async (config) => {
    const appDelegate = config.modResults;

    // Add import
    if (!appDelegate.contents.includes("#import <YandexMapsMobile/YMKMapKitFactory.h>")) {
      // Replace the first line with the intercom import
      appDelegate.contents = appDelegate.contents.replace(
        /#import "AppDelegate.h"/g,
        `#import "AppDelegate.h"\n#import <YandexMapsMobile/YMKMapKitFactory.h>`
      );
    }

    const mapKitMethodInvocations = [
      `[YMKMapKit setApiKey:@"${config.extra?.mapKitApiKey}"];`,
      `[YMKMapKit setLocale:@"ru_RU"];`,
      `[YMKMapKit mapKit];`,
    ]
      .map((line) => `\t${line}`)
      .join("\n");

    // Add invocation
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!appDelegate.contents.includes(mapKitMethodInvocations)) {
      appDelegate.contents = appDelegate.contents.replace(
        /\s+return YES;/g,
        `\n\n${mapKitMethodInvocations}\n\n\treturn YES;`
      );
    }

    return config;
  });
};
const config: ExpoConfig = {
    name: "dock-map-mobile",
    slug: "dockmapmobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "dockmapmobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.dockmapmobile.mobile",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.dockmapmobile.mobile",
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [withYandexMaps],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "00bb6392-8683-410a-90c0-08a1f3976da8",
      },
      mapKitApiKey: "89bf64c3-270a-4dbe-ad31-b97fe38924c4",
    },
    owner: "dockmap",
} as ExpoConfig;

export default withYandexMaps(config);