import React, { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import PanditShell from "@/components/pandit/PanditShell";
import {
  Colors,
  Fonts,
  MaxContentWidth,
  Radius,
  Spacing,
} from "@/constants/theme";

type SupportCategory = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};

const supportCategories: SupportCategory[] = [
  {
    icon: "calendar-outline",
    title: "Booking Support",
    subtitle: "Requests, bookings, schedules and customer details",
  },
  {
    icon: "wallet-outline",
    title: "Payments & Earnings",
    subtitle: "Settlement, earnings and payment related help",
  },
  {
    icon: "person-circle-outline",
    title: "Profile & KYC",
    subtitle: "Profile, verification and document related help",
  },
  {
    icon: "radio-outline",
    title: "Availability",
    subtitle: "Online status, working hours and service areas",
  },
  {
    icon: "phone-portrait-outline",
    title: "Technical Support",
    subtitle: "App, login or technical problems",
  },
];

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "How do I accept a new booking request?",
    answer:
      "Open Requests from the bottom navigation, select the booking request and review the customer details. You can accept the request when the final DivyaArpan customer price has been confirmed.",
  },
  {
    question: "Can I change the customer price?",
    answer:
      "No. The final customer price is controlled by DivyaArpan. Pandits can review the final price before accepting a booking.",
  },
  {
    question: "How do I change my availability?",
    answer:
      "Open Profile and select Availability to manage your online availability, working schedule and service areas.",
  },
  {
    question: "What should I do if I cannot attend an accepted booking?",
    answer:
      "Please contact DivyaArpan support as soon as possible so the support team can assist with the booking.",
  },
  {
    question: "How can I get help with my KYC?",
    answer:
      "For verification or document related issues, contact the DivyaArpan support team from this page.",
  },
];

function SupportCategoryRow({
  item,
  onPress,
}: {
  item: SupportCategory;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.categoryIcon}>
        <Ionicons
          name={item.icon}
          size={21}
          color={Colors.primary}
        />
      </View>

      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.title}</Text>

        <Text style={styles.categorySubtitle}>
          {item.subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={Colors.textMuted}
      />
    </Pressable>
  );
}

function FAQRow({
  item,
  expanded,
  onPress,
}: {
  item: FAQ;
  expanded: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.faqRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.faqQuestionRow}>
        <Text style={styles.faqQuestion}>
          {item.question}
        </Text>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={Colors.textSecondary}
        />
      </View>

      {expanded ? (
        <Text style={styles.faqAnswer}>
          {item.answer}
        </Text>
      ) : null}
    </Pressable>
  );
}

export default function HelpSupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(
    null
  );

  const handleCategoryPress = (title: string) => {
    if (title === "Booking Support") {
      router.replace("/requests");
      return;
    }

    if (title === "Payments & Earnings") {
      router.replace("/earnings");
      return;
    }

    if (title === "Profile & KYC") {
      router.replace("/profile");
      return;
    }

    if (title === "Availability") {
      router.replace("/availability");
      return;
    }

    if (title === "Technical Support") {
      setExpandedFaq(null);
    }
  };

  const openEmail = async () => {
    try {
      await Linking.openURL(
        "mailto:support@divyaarpan.com?subject=Pandit%20Partner%20Support"
      );
    } catch {
      // Email app may not be available in web preview.
    }
  };

  const openPhone = async () => {
    try {
      await Linking.openURL("tel:+919999999999");
    } catch {
      // Phone capability may not be available in web preview.
    }
  };

  return (
    <PanditShell
      activeTab="profile"
      onTabPress={(tab) => {
        if (tab === "home") {
          router.replace("/dashboard");
          return;
        }

        if (tab === "requests") {
          router.replace("/requests");
          return;
        }

        if (tab === "bookings") {
          router.replace("/bookings");
          return;
        }

        if (tab === "notifications") {
          router.replace("/notifications");
          return;
        }

        if (tab === "profile") {
          router.replace("/profile");
        }
      }}
      notificationCount={2}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}

          <View style={styles.header}>
            <Pressable
              onPress={() => router.replace("/profile")}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={Colors.text}
              />
            </Pressable>

            <View style={styles.headerText}>
              <Text style={styles.pageTitle}>
                Help & Support
              </Text>

              <Text style={styles.pageSubtitle}>
                Get assistance from DivyaArpan
              </Text>
            </View>
          </View>

          {/* Welcome */}

          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIcon}>
              <Ionicons
                name="headset-outline"
                size={27}
                color={Colors.primary}
              />
            </View>

            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>
                We're here to help
              </Text>

              <Text style={styles.welcomeText}>
                Our partner support team can help you with
                bookings, payments, profile and technical issues.
              </Text>
            </View>
          </View>

          {/* Common Help */}

          <Text style={styles.sectionTitle}>
            Common Help
          </Text>

          <View style={styles.card}>
            {supportCategories.map((item, index) => (
              <React.Fragment key={item.title}>
                <SupportCategoryRow
                  item={item}
                  onPress={() =>
                    handleCategoryPress(item.title)
                  }
                />

                {index <
                supportCategories.length - 1 ? (
                  <View style={styles.divider} />
                ) : null}
              </React.Fragment>
            ))}
          </View>

          {/* Contact */}

          <Text style={styles.sectionTitle}>
            Contact DivyaArpan
          </Text>

          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>
              Need personal assistance?
            </Text>

            <Text style={styles.contactSubtitle}>
              Our partner support team can assist you with
              account, booking and operational issues.
            </Text>

            <View style={styles.contactActions}>
              <Pressable
                onPress={openEmail}
                style={({ pressed }) => [
                  styles.contactButton,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.contactButtonIcon}>
                  <Ionicons
                    name="mail-outline"
                    size={19}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.contactButtonText}>
                  <Text style={styles.contactButtonTitle}>
                    Email Support
                  </Text>

                  <Text style={styles.contactButtonSubtitle}>
                    support@divyaarpan.com
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={openPhone}
                style={({ pressed }) => [
                  styles.contactButton,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.contactButtonIcon}>
                  <Ionicons
                    name="call-outline"
                    size={19}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.contactButtonText}>
                  <Text style={styles.contactButtonTitle}>
                    Call Support
                  </Text>

                  <Text style={styles.contactButtonSubtitle}>
                    Partner Support Team
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* FAQ */}

          <Text style={styles.sectionTitle}>
            Frequently Asked Questions
          </Text>

          <View style={styles.faqCard}>
            {faqs.map((item, index) => (
              <React.Fragment key={item.question}>
                <FAQRow
                  item={item}
                  expanded={expandedFaq === index}
                  onPress={() =>
                    setExpandedFaq(
                      expandedFaq === index ? null : index
                    )
                  }
                />

                {index < faqs.length - 1 ? (
                  <View style={styles.divider} />
                ) : null}
              </React.Fragment>
            ))}
          </View>

          {/* Partner Note */}

          <View style={styles.noteCard}>
            <View style={styles.noteIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color={Colors.success}
              />
            </View>

            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>
                DivyaArpan Partner Support
              </Text>

              <Text style={styles.noteText}>
                Please keep your Pandit Login ID and booking ID
                ready when contacting support. This helps us
                resolve your issue faster.
              </Text>
            </View>
          </View>

          {/* Footer */}

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>
              DivyaArpan Partner App
            </Text>

            <Text style={styles.footerVersion}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </PanditShell>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 110,
  },

  container: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  headerText: {
    flex: 1,
  },

  pageTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  pageSubtitle: {
    marginTop: 2,
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  welcomeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: "#f3d39b",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },

  welcomeIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  welcomeText: {
    marginTop: 4,
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xxl,
    overflow: "hidden",
  },

  categoryRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },

  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  categoryContent: {
    flex: 1,
    paddingRight: Spacing.sm,
  },

  categoryTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
  },

  categorySubtitle: {
    marginTop: 3,
    fontFamily: Fonts.sans,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },

  contactTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },

  contactSubtitle: {
    marginTop: 5,
    marginBottom: Spacing.lg,
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  contactActions: {
    gap: Spacing.sm,
  },

  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },

  contactButtonIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  contactButtonText: {
    flex: 1,
  },

  contactButtonTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    fontWeight: "800",
    color: Colors.text,
  },

  contactButtonSubtitle: {
    marginTop: 2,
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.textSecondary,
  },

  faqCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
    overflow: "hidden",
  },

  faqRow: {
    paddingVertical: Spacing.lg,
  },

  faqQuestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  faqQuestion: {
    flex: 1,
    fontFamily: Fonts.rounded,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: Colors.text,
    paddingRight: Spacing.md,
  },

  faqAnswer: {
    marginTop: Spacing.md,
    paddingRight: Spacing.xl,
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 19,
    color: Colors.textSecondary,
  },

  noteCard: {
    flexDirection: "row",
    backgroundColor: Colors.successSoft,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },

  noteIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  noteContent: {
    flex: 1,
  },

  noteTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    fontWeight: "800",
    color: Colors.success,
  },

  noteText: {
    marginTop: 4,
    fontFamily: Fonts.sans,
    fontSize: 11,
    lineHeight: 17,
    color: Colors.textSecondary,
  },

  footer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },

  footerTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textMuted,
  },

  footerVersion: {
    marginTop: 3,
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Colors.textMuted,
  },

  pressed: {
    opacity: 0.65,
  },
});
 