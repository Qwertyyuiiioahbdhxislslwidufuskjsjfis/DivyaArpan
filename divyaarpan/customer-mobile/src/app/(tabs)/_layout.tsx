import { Platform, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { DivyaTheme } from "@/constants/divya-theme";

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  focused,
  active,
  inactive,
}: {
  focused: boolean;
  active: IconName;
  inactive: IconName;
}) {
  return (
    <View style={styles.icon}>
      <Ionicons
        name={focused ? active : inactive}
        size={focused ? 20 : 19}
        color={
          focused
            ? DivyaTheme.colors.vermilionDeep
            : DivyaTheme.colors.subtle
        }
      />

      {focused ? <View style={styles.activeDot} /> : null}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: DivyaTheme.colors.vermilionDeep,
        tabBarInactiveTintColor: DivyaTheme.colors.subtle,

        sceneStyle: {
          backgroundColor: DivyaTheme.colors.background,
        },

        tabBarStyle: {
          height: Platform.OS === "web" ? 66 : 72,
          paddingTop: 7,
          paddingBottom: Platform.OS === "web" ? 7 : 11,

          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "rgba(122,101,87,0.18)",

          backgroundColor: "rgba(251,247,240,0.98)",

          shadowColor: "#291814",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.035,
          shadowRadius: 14,
          elevation: 4,
        },

        tabBarLabelStyle: {
          fontFamily: DivyaTheme.fonts.bodySemiBold,
          fontSize: 8.5,
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
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
        name="temples"
        options={{
          title: "Temples",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              active="business"
              inactive="business-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="poojas"
        options={{
          title: "Poojas",
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
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              active="calendar"
              inactive="calendar-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
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
  icon: {
    height: 27,
    alignItems: "center",
    justifyContent: "center",
  },

  activeDot: {
    position: "absolute",
    bottom: -3,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: DivyaTheme.colors.vermilionDeep,
  },
});
