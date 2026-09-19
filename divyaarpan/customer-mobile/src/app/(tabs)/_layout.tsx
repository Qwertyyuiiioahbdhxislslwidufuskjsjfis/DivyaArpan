import { Platform, StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { DivyaTheme } from "@/constants/divya-theme";
import { useLanguage } from "@/i18n/LanguageProvider";

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  focused,
  active,
  inactive,
  sacred = false,
}: {
  focused: boolean;
  active: IconName;
  inactive: IconName;
  sacred?: boolean;
}) {
  if (sacred) {
    return (
      <View style={styles.sacredOuter}>
        <View style={[styles.sacredCircle, focused && styles.sacredCircleActive]}>
          <Text style={styles.sacredOm}>ॐ</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={focused ? active : inactive}
        size={focused ? 20 : 19}
        color={focused ? "#FFF9EE" : DivyaTheme.colors.muted}
      />
    </View>
  );
}

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: DivyaTheme.colors.vermilionDeep,
        tabBarInactiveTintColor: DivyaTheme.colors.muted,

        sceneStyle: {
          backgroundColor: "#FFF9F1",
        },

        tabBarStyle: {
          height: Platform.OS === "web" ? 82 : 88,
          paddingTop: 8,
          paddingBottom: Platform.OS === "web" ? 8 : 13,

          borderTopWidth: 1,
          borderTopColor: "rgba(171, 128, 83, 0.10)",

          backgroundColor: "#FFFDF9",

          shadowColor: "#3C211B",
          shadowOffset: {
            width: 0,
            height: -7,
          },
          shadowOpacity: 0.09,
          shadowRadius: 22,

          elevation: 14,
        },

        tabBarLabelStyle: {
          fontFamily: DivyaTheme.fonts.bodySemiBold,
          fontSize: 9,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              active="home"
              inactive="home-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="poojas"
        options={{
          title: t("poojas"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              active="flower"
              inactive="flower-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="temples"
        options={{
          title: t("mandirs"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              active="business"
              inactive="business-outline"
              sacred
            />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: t("pandit"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              active="people"
              inactive="people-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("you"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              active="person"
              inactive="person-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 39,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapActive: {
    backgroundColor: DivyaTheme.colors.vermilionDeep,
  },

  sacredOuter: {
    width: 58,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -12,
  },

  sacredCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,

    backgroundColor: "#F8EEDF",

    borderWidth: 2,
    borderColor: "#E9D3AB",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#421A17",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 7,
  },

  sacredCircleActive: {
    backgroundColor: DivyaTheme.colors.vermilionDeep,
    borderColor: "#F6E1B4",
  },

  sacredOm: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 25,
    lineHeight: 29,
  },
});
