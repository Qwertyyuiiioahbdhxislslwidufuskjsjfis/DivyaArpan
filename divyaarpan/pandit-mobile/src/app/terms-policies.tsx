import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import PanditShell from "@/components/pandit/PanditShell";
import { Colors, Radius, Spacing } from "@/constants/theme";

type PolicySectionProps = {
  number: string;
  title: string;
  children: React.ReactNode;
};

function PolicySection({
  number,
  title,
  children,
}: PolicySectionProps) {
  return (
    <View style={styles.policySection}>
      <View style={styles.numberCircle}>
        <Text style={styles.numberText}>{number}</Text>
      </View>

      <View style={styles.policyContent}>
        <Text style={styles.policyTitle}>{title}</Text>
        <Text style={styles.policyText}>{children}</Text>
      </View>
    </View>
  );
}

export default function TermsPoliciesScreen() {
  const handleTabPress = (tab: string) => {
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
  };

  return (
    <PanditShell
      activeTab="profile"
      notificationCount={2}
      onTabPress={handleTabPress}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
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
            <Text style={styles.title}>Terms & Policies</Text>
            <Text style={styles.subtitle}>
              DivyaArpan Pandit Partner Terms
            </Text>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons
              name="document-text-outline"
              size={27}
              color={Colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <Text style={styles.introTitle}>
              Partner Agreement
            </Text>

            <Text style={styles.introDescription}>
              These guidelines explain the responsibilities,
              expectations and operating policies for verified
              DivyaArpan Pandit Partners.
            </Text>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={Colors.primary}
            />
          </View>

          <View style={styles.noticeText}>
            <Text style={styles.noticeTitle}>
              Important
            </Text>

            <Text style={styles.noticeDescription}>
              Please read these policies carefully before accepting
              and performing DivyaArpan bookings.
            </Text>
          </View>
        </View>

        {/* Sections */}
        <Text style={styles.sectionTitle}>
          Partner Terms
        </Text>

        <View style={styles.card}>
          <PolicySection
            number="1"
            title="Verified Partner"
          >
            Only Pandits who have completed the DivyaArpan
            verification process and have an active partner profile
            may accept and perform bookings through the platform.
          </PolicySection>

          <View style={styles.divider} />

          <PolicySection
            number="2"
            title="Booking Acceptance"
          >
            A Pandit may accept or reject a booking request based
            on availability, location and ability to perform the
            requested pooja. Once accepted, the Pandit is expected
            to honour the confirmed booking.
          </PolicySection>

          <View style={styles.divider} />

          <PolicySection
            number="3"
            title="Customer Pricing"
          >
            Final customer pricing is controlled by DivyaArpan.
            Pandits must not independently change, collect or
            negotiate the customer booking amount outside the
            approved DivyaArpan process.
          </PolicySection>

          <View style={styles.divider} />

          <PolicySection
            number="4"
            title="Professional Conduct"
          >
            Pandits are expected to maintain respectful,
            professional and appropriate conduct with every
            devotee and customer associated with a booking.
          </PolicySection>

          <View style={styles.divider} />

          <PolicySection
            number="5"
            title="Booking Status"
          >
            Pandits should keep booking status updated accurately,
            including On the Way, Arrived, Pooja Started and
            Completed, so that devotees and DivyaArpan can receive
            accurate booking information.
          </PolicySection>

          <View style={styles.divider} />

          <PolicySection
            number="6"
            title="Cancellation"
          >
            If a Pandit is unable to fulfil a confirmed booking,
            DivyaArpan support should be informed as soon as
            possible. Repeated cancellations or failure to attend
            confirmed bookings may affect partner eligibility.
          </PolicySection>

          <View style={styles.divider} />

          <PolicySection
            number="7"
            title="Customer Information"
          >
            Customer information received through DivyaArpan must
            be used only for legitimate booking-related purposes.
            Personal information must not be shared or misused.
          </PolicySection>

          <View style={styles.divider} />

          <PolicySection
            number="8"
            title="Payments & Settlements"
          >
            Pandit earnings are calculated according to the
            applicable DivyaArpan settlement rules. Settlement
            timing and amounts may depend on booking completion,
            payment status and applicable policies.
          </PolicySection>

          <View style={styles.divider} />

          <PolicySection
            number="9"
            title="Platform Usage"
          >
            The DivyaArpan Partner App should be used only for
            legitimate partner activities. Login credentials must
            be kept confidential and must not be shared with
            another person.
          </PolicySection>

          <View style={styles.divider} />

          <PolicySection
            number="10"
            title="Profile & Documents"
          >
            Pandits must keep their profile information and required
            verification documents accurate and up to date.
            DivyaArpan may review partner information when
            required for verification or compliance.
          </PolicySection>
        </View>

        {/* Privacy */}
        <Text style={styles.sectionTitle}>
          Privacy & Security
        </Text>

        <View style={styles.securityCard}>
          <View style={styles.securityIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={Colors.primary}
            />
          </View>

          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>
              Protect your account
            </Text>

            <Text style={styles.securityText}>
              Never share your DivyaArpan login ID or password with
              anyone. DivyaArpan support will never require you to
              disclose your password.
            </Text>
          </View>
        </View>

        {/* Updates */}
        <Text style={styles.sectionTitle}>
          Policy Updates
        </Text>

        <View style={styles.updateCard}>
          <Ionicons
            name="refresh-outline"
            size={22}
            color={Colors.primary}
          />

          <Text style={styles.updateText}>
            DivyaArpan may update partner terms and policies as the
            platform evolves. Partners will be expected to follow
            the latest applicable policies communicated through
            the platform.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={Colors.primary}
            />
          </View>

          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>
              Questions about these policies?
            </Text>

            <Text style={styles.contactText}>
              Contact DivyaArpan Partner Support if you need
              clarification about any partner policy.
            </Text>

            <Pressable
              onPress={() => router.push("/help-support")}
              style={({ pressed }) => [
                styles.contactButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.contactButtonText}>
                Contact Support
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color={Colors.primaryDark}
              />
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            DivyaArpan Partner App
          </Text>

          <Text style={styles.footerText}>
            Partner Terms & Policies
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </PanditShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: Spacing.lg,
    paddingBottom: 110,
  },

  headerRow: {
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

  pressed: {
    opacity: 0.65,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  introCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  introIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  introText: {
    flex: 1,
  },

  introTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  introDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  noticeCard: {
    flexDirection: "row",
    backgroundColor: Colors.warningSoft,
    borderWidth: 1,
    borderColor: "#f5d59a",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },

  noticeIcon: {
    width: 42,
    alignItems: "center",
    paddingTop: 2,
  },

  noticeText: {
    flex: 1,
  },

  noticeTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  noticeDescription: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 17,
    color: Colors.textSecondary,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
  },

  policySection: {
    flexDirection: "row",
    paddingVertical: Spacing.lg,
  },

  numberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  numberText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  policyContent: {
    flex: 1,
  },

  policyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.text,
  },

  policyText: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  securityCard: {
    flexDirection: "row",
    backgroundColor: Colors.successSoft,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },

  securityIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.success,
  },

  securityText: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 17,
    color: Colors.textSecondary,
  },

  updateCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    gap: Spacing.md,
  },

  updateText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  contactCard: {
    flexDirection: "row",
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: "#f5d59a",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },

  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  contactContent: {
    flex: 1,
  },

  contactTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  contactText: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 17,
    color: Colors.textSecondary,
  },

  contactButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },

  contactButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  footer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },

  footerBrand: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  footerText: {
    marginTop: 4,
    fontSize: 11,
    color: Colors.textSecondary,
  },

  version: {
    marginTop: 6,
    fontSize: 10,
    color: Colors.textMuted,
  },
});