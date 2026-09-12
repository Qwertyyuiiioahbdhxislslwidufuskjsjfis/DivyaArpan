import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
} from "expo-router";
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
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

type Filter =
  | "All"
  | "Active"
  | "Today"
  | "Completed"
  | "Cancelled";

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
  panditId: number | null;
  amount: number | null;
  bookingType: string;
  urgency: string;
  status: string;
  paymentStatus: string;
  samagriCharges: number | null;
  completedAt: string | null;
};

type DashboardResponse = {
  unreadNotifications?: number;
  assignedBookings?: Booking[];
  completedBookings?: Booking[];
};

function money(paise: number | null | undefined) {
  if (paise == null) {
    return "Amount pending";
  }

  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function statusLabel(status: string) {
  switch (status) {
    case "PANDIT_ASSIGNED":
      return "Assigned";
    case "AWAITING_PAYMENT":
      return "Awaiting Payment";
    case "CONFIRMED":
      return "Confirmed";
    case "PANDIT_ON_THE_WAY":
      return "On the Way";
    case "IN_PROGRESS":
      return "Pooja in Progress";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) =>
          c.toUpperCase()
        );
  }
}

function statusIcon(
  status: string
): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case "PANDIT_ASSIGNED":
      return "person-add-outline";
    case "AWAITING_PAYMENT":
      return "card-outline";
    case "CONFIRMED":
      return "checkmark-circle-outline";
    case "PANDIT_ON_THE_WAY":
      return "navigate-outline";
    case "IN_PROGRESS":
      return "sparkles-outline";
    case "COMPLETED":
      return "checkmark-done-outline";
    case "CANCELLED":
      return "close-circle-outline";
    default:
      return "information-circle-outline";
  }
}

function isToday(dateValue: string) {
  const parsed = new Date(dateValue);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  const today = new Date();

  return (
    parsed.getFullYear() === today.getFullYear() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getDate() === today.getDate()
  );
}

export default function BookingsScreen() {
  const [filter, setFilter] =
    useState<Filter>("All");

  const [assigned, setAssigned] =
    useState<Booking[]>([]);

  const [completed, setCompleted] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [notificationCount, setNotificationCount] =
    useState(0);

  const loadBookings = useCallback(
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
              "Unable to load bookings."
          );
        }

        setAssigned(
          Array.isArray(
            data.assignedBookings
          )
            ? data.assignedBookings
            : []
        );

        setCompleted(
          Array.isArray(
            data.completedBookings
          )
            ? data.completedBookings
            : []
        );

        setNotificationCount(
          Number(
            data.unreadNotifications ?? 0
          )
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load bookings.";

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
      void loadBookings();
    }, [loadBookings])
  );

  const allBookings = useMemo(
    () => [...assigned, ...completed],
    [assigned, completed]
  );

  const visibleBookings = useMemo(() => {
    switch (filter) {
      case "Active":
        return assigned.filter(
          (booking) =>
            booking.status !== "CANCELLED"
        );

      case "Today":
        return allBookings.filter(
          (booking) =>
            isToday(booking.date)
        );

      case "Completed":
        return completed;

      case "Cancelled":
        return assigned.filter(
          (booking) =>
            booking.status === "CANCELLED"
        );

      default:
        return allBookings;
    }
  }, [
    filter,
    assigned,
    completed,
    allBookings,
  ]);

  const activeCount =
    assigned.filter(
      (booking) =>
        booking.status !== "CANCELLED"
    ).length;

  return (
    <PanditShell
      activeTab="bookings"
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
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              void loadBookings(true)
            }
          />
        }
      >
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              My Bookings
            </Text>

            <Text style={styles.subtitle}>
              Manage assigned, confirmed and
              completed bookings
            </Text>
          </View>

          <View style={styles.totalBadge}>
            <Text
              style={styles.totalNumber}
            >
              {activeCount}
            </Text>

            <Text style={styles.totalLabel}>
              Active
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.filters
          }
        >
          {(
            [
              "All",
              "Active",
              "Today",
              "Completed",
              "Cancelled",
            ] as Filter[]
          ).map((item) => (
            <Pressable
              key={item}
              onPress={() =>
                setFilter(item)
              }
              style={[
                styles.filterChip,
                filter === item &&
                  styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item &&
                    styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={styles.sectionTitle}
            >
              {filter === "All"
                ? "All Bookings"
                : filter}
            </Text>

            <Text
              style={styles.sectionSubtitle}
            >
              {visibleBookings.length} booking
              {visibleBookings.length === 1
                ? ""
                : "s"}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator
              size="large"
              color={Colors.primary}
            />

            <Text style={styles.stateText}>
              Loading bookings...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Ionicons
              name="alert-circle-outline"
              size={34}
              color={Colors.error}
            />

            <Text style={styles.errorText}>
              {error}
            </Text>

            <Pressable
              onPress={() =>
                void loadBookings()
              }
              style={styles.retryButton}
            >
              <Text
                style={styles.retryText}
              >
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : visibleBookings.length === 0 ? (
          <View style={styles.stateCard}>
            <Ionicons
              name="calendar-outline"
              size={36}
              color={Colors.primary}
            />

            <Text
              style={styles.emptyTitle}
            >
              No bookings found
            </Text>

            <Text style={styles.stateText}>
              Bookings matching this filter will
              appear here.
            </Text>
          </View>
        ) : (
          visibleBookings.map(
            (booking) => (
              <Pressable
                key={booking.id}
                onPress={() =>
                  router.push({
                    pathname:
                      "/bookings/[id]",
                    params: {
                      id: booking.bookingId,
                    },
                  })
                }
                style={({ pressed }) => [
                  styles.bookingCard,
                  pressed &&
                    styles.pressed,
                ]}
              >
                <View
                  style={styles.cardHeader}
                >
                  <View
                    style={
                      styles.serviceIcon
                    }
                  >
                    <Ionicons
                      name="sparkles-outline"
                      size={23}
                      color={Colors.primary}
                    />
                  </View>

                  <View
                    style={
                      styles.serviceInfo
                    }
                  >
                    <Text
                      style={
                        styles.serviceName
                      }
                    >
                      {booking.service}
                    </Text>

                    <Text
                      style={
                        styles.bookingId
                      }
                    >
                      {booking.bookingId}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.statusBadge
                    }
                  >
                    <Ionicons
                      name={statusIcon(
                        booking.status
                      )}
                      size={13}
                      color={Colors.primary}
                    />

                    <Text
                      style={
                        styles.statusText
                      }
                    >
                      {statusLabel(
                        booking.status
                      )}
                    </Text>
                  </View>
                </View>

                <View
                  style={styles.divider}
                />

                <View
                  style={styles.scheduleRow}
                >
                  <Info
                    icon="calendar-outline"
                    label="Date"
                    value={booking.date}
                  />

                  <Info
                    icon="time-outline"
                    label="Time"
                    value={booking.time}
                  />
                </View>

                <View
                  style={styles.locationBox}
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={Colors.primary}
                  />

                  <View
                    style={
                      styles.locationContent
                    }
                  >
                    <Text
                      style={styles.label}
                    >
                      Service Location
                    </Text>

                    <Text
                      style={
                        styles.locationValue
                      }
                    >
                      {[
                        booking.city,
                        booking.state,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={
                        styles.locationSubtext
                      }
                    >
                      {booking.address}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.textMuted}
                  />
                </View>

                <View
                  style={styles.customerRow}
                >
                  <View
                    style={styles.avatar}
                  >
                    <Text
                      style={
                        styles.avatarText
                      }
                    >
                      {booking.devoteeName
                        ?.trim()
                        .charAt(0)
                        .toUpperCase() ||
                        "D"}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.customerInfo
                    }
                  >
                    <Text
                      style={
                        styles.customerName
                      }
                    >
                      {booking.devoteeName}
                    </Text>

                    <Text
                      style={
                        styles.customerLocation
                      }
                    >
                      {booking.language}
                    </Text>
                  </View>
                </View>

                <View
                  style={styles.amountRow}
                >
                  <View>
                    <Text
                      style={
                        styles.amountLabel
                      }
                    >
                      DivyaArpan Booking Amount
                    </Text>

                    <Text
                      style={styles.amount}
                    >
                      {money(
                        booking.amount
                      )}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.detailsButton
                    }
                  >
                    <Text
                      style={
                        styles.detailsText
                      }
                    >
                      View Details
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={15}
                      color={Colors.primary}
                    />
                  </View>
                </View>
              </Pressable>
            )
          )
        )}

        <View style={styles.policyCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={Colors.primary}
          />

          <View
            style={styles.policyContent}
          >
            <Text
              style={styles.policyTitle}
            >
              DivyaArpan Booking Policy
            </Text>

            <Text
              style={styles.policyText}
            >
              Update each booking only when the
              corresponding service stage has
              actually been reached.
            </Text>
          </View>
        </View>

        <View
          style={{
            height: Spacing.xxl,
          }}
        />
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
    <View style={styles.scheduleItem}>
      <View style={styles.scheduleIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={Colors.primary}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Text style={styles.value}>
          {value || "Not provided"}
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
    opacity: 0.75,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    flex: 1,
    paddingRight: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  totalBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primarySoft,
  },

  totalNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  totalLabel: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: "700",
    color: Colors.primaryDark,
  },

  filters: {
    gap: 8,
    paddingVertical: Spacing.lg,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
    backgroundColor: Colors.white,
  },

  filterChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
  },

  filterTextActive: {
    color: Colors.white,
  },

  sectionHeader: {
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

  bookingCard: {
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },

  serviceIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primarySoft,
  },

  serviceInfo: {
    flex: 1,
    marginLeft: 11,
  },

  serviceName: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
  },

  bookingId: {
    marginTop: 3,
    fontSize: 11,
    color: Colors.textMuted,
  },

  statusBadge: {
    maxWidth: 120,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Colors.primarySoft,
  },

  statusText: {
    flexShrink: 1,
    fontSize: 9,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  scheduleRow: {
    flexDirection: "row",
    gap: 10,
    padding: Spacing.md,
  },

  scheduleItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  scheduleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primarySoft,
  },

  label: {
    fontSize: 10,
    color: Colors.textMuted,
  },

  value: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
  },

  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
  },

  locationContent: {
    flex: 1,
  },

  locationValue: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },

  locationSubtext: {
    marginTop: 2,
    fontSize: 11,
    color: Colors.textMuted,
  },

  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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

  customerInfo: {
    flex: 1,
    marginLeft: 10,
  },

  customerName: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
  },

  customerLocation: {
    marginTop: 2,
    fontSize: 11,
    color: Colors.textMuted,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
  },

  amountLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },

  amount: {
    marginTop: 3,
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  detailsText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.primary,
  },

  stateCard: {
    minHeight: 220,
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
  },

  stateText: {
    marginTop: 11,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },

  errorText: {
    marginTop: 11,
    textAlign: "center",
    fontSize: 13,
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
    gap: 10,
    marginTop: Spacing.sm,
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
