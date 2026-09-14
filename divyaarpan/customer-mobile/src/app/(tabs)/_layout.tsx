import { Platform, StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { DivyaTheme } from "@/constants/divya-theme";

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  focused,
  active,
  inactive,
  special = false,
}: {
  focused: boolean;
  active: IconName;
  inactive: IconName;
  special?: boolean;
}) {
  if (special) {
    return (
      <View style={styles.specialOuter}>
        <View style={styles.specialCircle}>
          <Text style={styles.specialOm}>ॐ</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={focused ? active : inactive}
        size={focused ? 20 : 19}
        color={
          focused
            ? "#FFF8EC"
            : DivyaTheme.colors.muted
        }
      />
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
        tabBarInactiveTintColor: DivyaTheme.colors.muted,

        sceneStyle: {
          backgroundColor: "#FFF9F1",
        },

        tabBarStyle: {
          height: Platform.OS === "web" ? 82 : 88,
          paddingTop: 8,
          paddingBottom: Platform.OS === "web" ? 8 : 13,

          borderTopWidth: 0,

          backgroundColor: "#FFFDF9",

          shadowColor: "#3C211B",
          shadowOffset: {
            width: 0,
            height: -8,
          },
          shadowOpacity: 0.12,
          shadowRadius: 24,

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
              special
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

  specialOuter: {
    width: 58,
    height: 42,

    alignItems: "center",
    justifyContent: "center",

    marginTop: -12,
  },

  specialCircle: {
    width: 54,
    height: 54,

    borderRadius: 27,

    backgroundColor: "#6D1D24",

    borderWidth: 3,
    borderColor: "#FFF8EE",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#421A17",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,

    elevation: 8,
  },

  specialOm: {
    fontFamily: DivyaTheme.fonts.displayMedium,

    color: "#E7C276",

    fontSize: 25,
    lineHeight: 29,
  },
});
