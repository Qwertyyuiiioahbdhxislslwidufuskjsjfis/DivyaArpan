import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PanditShell from "@/components/pandit/PanditShell";
import {
  Colors,
  Radius,
  Spacing,
} from "@/constants/theme";
import { panditApiFetch } from "@/lib/api";

type Booking = {
  id: number;
  bookingId: string;
  service: string;
  city: string;
  state: string | null;
  address: string;
  pincode: string | null;
  language: string;
  date: string;
  time: string;
  sankalp: string | null;
  devoteeName: string;
  mobile: string;
  email: string | null;
  amount: number | null;
  bookingType: string;
  urgency: string;
  status: string;
  paymentStatus: string;
  samagriCharges: number | null;
};

type Offer = {
  id: number;
  bookingId: number;
  panditId: number;
  status: string;
  offeredAt: string;
  expiresAt: string | null;
  offeredAmount: number | null;
  booking: Booking;
};

type DashboardResponse = {
  unreadNotifications?: number;
  pendingOffers?: Offer[];
};

function money(paise: number | null | undefined) {
  if (paise == null) return "Price to be confirmed";

  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function locationText(booking: Booking) {
  return [
    booking.city,
    booking.state,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function RequestsScreen() {
  const [offers, setOffers] =
    useState<Offer[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] =
    useState("");
  const [notificationCount, setNotificationCount] =
    useState(0);

  const loadRequests = useCallback(
    async (refresh = false) => {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response =
          await panditApiFetch(
            "/api/pandit/dashboard"
          );

        const data =
          (await response.json()) as
            DashboardResponse & {
              message?: string;
            };

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load booking requests."
          );
        }

        setOffers(
          Array.isArray(data.pendingOffers)
            ? data.pendingOffers
            : []
        );

        setNotificationCount(
          Number(data.unreadNotifications ?? 0)
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load booking requests.";

        if (
          message === "AUTH_REQUIRED" ||
          message === "SESSION_EXPIRED"
        ) {
          router.replace("/");
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      void loadRequests();
    }, [loadRequests])
  );

  return (
    <PanditShell
      activeTab="requests"
      notificationCount={notificationCount}
      onTabPress={(tab) => {
        if (tab === "home")
          router.replace("/dashboard");
        if (tab === "requests")
          router.replace("/requests");
        if (tab === "bookings")
          router.replace("/bookings");
        if (tab === "notifications")
          router.replace("/notifications");
        if (tab === "profile")
          router.replace("/profile");
      }}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              void loadRequests(true)
            }
          />
        }
      >
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              Booking Requests
            </Text>

            <Text style={styles.subtitle}>
              Review and respond to customer requests
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {offers.length}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              New Requests
            </Text>

            <Text style={styles.sectionSubtitle}>
              Requests waiting for your response
            </Text>
          </View>

          {offers.length > 0 && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>
                {offers.length} NEW
              </Text>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator
              size="large"
              color={Colors.primary}
            />

            <Text style={styles.stateText}>
              Loading booking requests...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Ionicons
              name="alert-circle-outline"
              size={32}
              color={Colors.error}
            />

            <Text style={styles.errorText}>
              {error}
            </Text>

            <Pressable
              onPress={() =>
                void loadRequests()
              }
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : offers.length === 0 ? (
          <View style={styles.stateCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={38}
              color={Colors.success}
            />

            <Text style={styles.emptyTitle}>
              No pending requests
            </Text>

            <Text style={styles.stateText}>
              New booking requests assigned to you
              will appear here.
            </Text>
          </View>
        ) : (
          offers.map((offer) => {
            const booking = offer.booking;

            return (
              <Pressable
                key={offer.id}
                onPress={() =>
                  router.push({
                    pathname: "/requests/[id]",
                    params: {
                      id: String(offer.id),
                    },
                  })
                }
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.requestHeader}>
                  <View style={styles.serviceIcon}>
                    <Ionicons
                      name="sparkles-outline"
                      size={23}
                      color={Colors.primary}
                    />
                  </View>

                  <View style={styles.serviceInfo}>
                    <Text
                      style={styles.serviceName}
                    >
                      {booking.service}
                    </Text>

                    <Text
                      style={styles.bookingId}
                    >
                      {booking.bookingId}
                    </Text>
                  </View>

                  <View style={styles.pendingBadge}>
                    <View
                      style={styles.pendingDot}
                    />
                    <Text
                      style={styles.pendingText}
                    >
                      Pending
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Info
                    icon="calendar-outline"
                    label="Date & Time"
                    value={`${booking.date} · ${booking.time}`}
                  />

                  <Info
                    icon="location-outline"
                    label="Location"
                    value={locationText(booking)}
                  />
                </View>

                <View style={styles.devoteeRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {booking.devoteeName
                        ?.trim()
                        .charAt(0)
                        .toUpperCase() || "D"}
                    </Text>
                  </View>

                  <View style={styles.devoteeInfo}>
                    <Text
                      style={styles.devoteeName}
                    >
                      {booking.devoteeName}
                    </Text>

                    <Text
                      style={styles.devoteeLocation}
                    >
                      {locationText(booking)}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={19}
                    color={Colors.textMuted}
                  />
                </View>

                <View style={styles.requirements}>
                  <Requirement
                    icon="language-outline"
                    title="Language"
                    value={booking.language}
                  />

                  <Requirement
                    icon="hourglass-outline"
                    title="Booking"
                    value={
                      booking.bookingType ===
                      "IMMEDIATE"
                        ? "Immediate"
                        : "Scheduled"
                    }
                  />

                  <Requirement
                    icon="cube-outline"
                    title="Samagri"
                    value={
                      booking.samagriCharges !=
                        null &&
                      booking.samagriCharges > 0
                        ? "Included"
                        : "As per booking"
                    }
                  />
                </View>

                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.priceLabel}>
                      Final DivyaArpan Price
                    </Text>

                    <Text style={styles.price}>
                      {money(
                        offer.offeredAmount ??
                          booking.amount
                      )}
                    </Text>
                  </View>

                  <View style={styles.fixedBadge}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={13}
                      color={Colors.primary}
                    />

                    <Text style={styles.fixedText}>
                      Fixed
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsButton}>
                  <Text
                    style={styles.detailsButtonText}
                  >
                    View Full Request
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={Colors.primary}
                  />
                </View>
              </Pressable>
            );
          })
        )}

        <View style={styles.policyCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={21}
            color={Colors.primary}
          />

          <View style={styles.policyContent}>
            <Text style={styles.policyTitle}>
              Before accepting
            </Text>

            <Text style={styles.policyText}>
              Confirm that you can reach the service
              location and perform the selected pooja
              at the requested date and time.
            </Text>
          </View>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </PanditShell>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoItem}>
      <Ionicons
        name={icon}
        size={18}
        color={Colors.primary}
      />

      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>
        <Text style={styles.infoValue}>
          {value || "Not provided"}
        </Text>
      </View>
    </View>
  );
}

function Requirement({
  icon,
  title,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.requirement}>
      <Ionicons
        name={icon}
        size={16}
        color={Colors.textSecondary}
      />

      <View>
        <Text style={styles.requirementTitle}>
          {title}
        </Text>
        <Text style={styles.requirementValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  pressed: {
    opacity: 0.78,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  countBadge: {
    minWidth: 42,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  countText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },
  sectionSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: Colors.textMuted,
  },
  newBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FFF3D6",
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.primaryDark,
  },
  card: {
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  serviceIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF7E7",
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },
  bookingId: {
    marginTop: 3,
    fontSize: 12,
    color: Colors.textMuted,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#FFF7E7",
  },
  pendingDot: {
    width: 7,
    height: 7,
    marginRight: 5,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    padding: Spacing.md,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  infoValue: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },
  devoteeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF3D6",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primaryDark,
  },
  devoteeInfo: {
    flex: 1,
    marginLeft: 10,
  },
  devoteeName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  devoteeLocation: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.textMuted,
  },
  requirements: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  requirement: {
    flex: 1,
    minHeight: 62,
    padding: 9,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
  },
  requirementTitle: {
    marginTop: 5,
    fontSize: 10,
    color: Colors.textMuted,
  },
  requirementValue: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: Colors.text,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: "#FFF9ED",
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  price: {
    marginTop: 3,
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  fixedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Colors.white,
  },
  fixedText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primaryDark,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    margin: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primary,
  },
  stateCard: {
    minHeight: 210,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  stateText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },
  errorText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    color: Colors.error,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  retryText: {
    fontWeight: "800",
    color: Colors.white,
  },
  policyCard: {
    flexDirection: "row",
    gap: 11,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: "#FFF9ED",
  },
  policyContent: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
  },
  policyText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
});
