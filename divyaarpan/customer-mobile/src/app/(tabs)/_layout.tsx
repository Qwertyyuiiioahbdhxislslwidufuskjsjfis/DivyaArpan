import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DivyaTheme } from "@/constants/divya-theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: DivyaTheme.colors.saffron,
        tabBarInactiveTintColor: "#91857D",
        tabBarStyle: {
          height: 72,
          paddingTop: 7,
          paddingBottom: 9,
          borderTopWidth: 1,
          borderTopColor: "#F0E2D6",
          backgroundColor: "#FFFCF8",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="temples"
        options={{
          title: "Temples",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="poojas"
        options={{
          title: "Poojas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flower-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
