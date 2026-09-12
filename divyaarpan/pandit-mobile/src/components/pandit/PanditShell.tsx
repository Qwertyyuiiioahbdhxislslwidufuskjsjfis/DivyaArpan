import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors, Radius, Spacing } from "@/constants/theme";

type Tab =
  | "home"
  | "requests"
  | "bookings"
  | "notifications"
  | "profile";

type PanditShellProps = {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
  children: React.ReactNode;
  notificationCount?: number;
};

const tabs: {
  key: Tab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "home", label: "Home", icon: "home-outline" },
  { key: "requests", label: "Requests", icon: "document-text-outline" },
  { key: "bookings", label: "Bookings", icon: "calendar-outline" },
  {
    key: "notifications",
    label: "Alerts",
    icon: "notifications-outline",
  },
  { key: "profile", label: "Profile", icon: "person-outline" },
];

export default function PanditShell({
  activeTab,
  onTabPress,
  children,
  notificationCount = 0,
}: PanditShellProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>ॐ</Text>
          </View>

          <View>
            <Text style={styles.brand}>DivyaArpan</Text>
            <Text style={styles.partner}>PANDIT PARTNER</Text>
          </View>
        </View>

        <Pressable
          onPress={() => onTabPress("notifications")}
          style={styles.notificationButton}
        >
          <Ionicons
            name="notifications-outline"
            size={23}
            color={Colors.primaryDark}
          />

          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? "9+" : notificationCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.content}>{children}</View>

      <View style={styles.bottomBar}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              style={styles.tab}
            >
              <Ionicons
                name={active ? tab.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap : tab.icon}
                size={21}
                color={active ? Colors.primary : Colors.textMuted}
              />

              <Text
                style={[
                  styles.tabLabel,
                  active && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    minHeight: 76,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 25,
    color: Colors.primary,
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primaryDark,
  },
  partner: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    color: Colors.primary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceSoft,
  },
  badge: {
    position: "absolute",
    top: 3,
    right: 3,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "800",
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    height: 70,
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: "row",
    width: "100%",
  },
  tab: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: "800",
  },
});
