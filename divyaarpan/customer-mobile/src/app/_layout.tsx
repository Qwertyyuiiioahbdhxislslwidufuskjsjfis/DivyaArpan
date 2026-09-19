import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
  useFonts as useCormorantFonts,
} from "@expo-google-fonts/cormorant-garamond";

import {
  NotoSansDevanagari_500Medium,
  NotoSansDevanagari_600SemiBold,
  NotoSansDevanagari_700Bold,
  NotoSansDevanagari_800ExtraBold,
  useFonts as useDevanagariFonts,
} from "@expo-google-fonts/noto-sans-devanagari";

import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts as useManropeFonts,
} from "@expo-google-fonts/manrope";

import { DivyaTheme } from "@/constants/divya-theme";
import { LanguageProvider } from "@/i18n/LanguageProvider";

export default function RootLayout() {
  const [cormorantLoaded] = useCormorantFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const [devanagariLoaded] = useDevanagariFonts({
    NotoSansDevanagari_500Medium,
    NotoSansDevanagari_600SemiBold,
    NotoSansDevanagari_700Bold,
    NotoSansDevanagari_800ExtraBold,
  });

  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  const fontsLoaded = cormorantLoaded && manropeLoaded && devanagariLoaded;

  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.margin = "0";
      document.body.style.background = "#EDE7DE";
    }
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.loading} />;
  }

  return (
    <LanguageProvider>
      <View style={styles.outerCanvas}>
        <StatusBar style="dark" />

        <View style={styles.appFrame}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: DivyaTheme.colors.background,
            },
            animation: "fade_from_bottom",
          }}
        >
          <Stack.Screen name="(tabs)" />

          <Stack.Screen
            name="temple/kashi-vishwanath"
            options={{
              animation: "slide_from_right",
            }}
          />
        </Stack>
        </View>
      </View>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: DivyaTheme.colors.background,
  },

  outerCanvas: {
    flex: 1,
    backgroundColor:
      Platform.OS === "web"
        ? "#EDE7DE"
        : DivyaTheme.colors.background,
    alignItems: "center",
  },

  appFrame: {
    flex: 1,
    width: "100%",
    maxWidth: DivyaTheme.layout.maxAppWidth,
    backgroundColor: DivyaTheme.colors.background,

    ...(Platform.OS === "web"
      ? {
          shadowColor: "#2B211D",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 40,
        }
      : {}),
  },
});
