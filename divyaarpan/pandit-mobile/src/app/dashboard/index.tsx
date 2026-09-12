import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
} from "expo-router";
import React, {
  useCallback,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
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
  status: string;
  date: string | null;
  time: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  devoteeName: string | null;
  amount: number | null;
  samagriRequired: boolean;
};

type Offer = {
  id: number;
  offeredAmount: number | null;
  booking: Booking;
};

type DashboardData = {
  pandit: {
    id: number;
    panditCode: string;
    name: string;
    rating: number | null;
    experienceYears: number | null;
    isOnline: boolean;
    verificationStatus: string;
  };
  statistics: {
    pendingOffers: number;
    assignedBookings: number;
    completedBookings: number;
    todayEarnings: number;
    monthEarnings: number;
    totalEarnings: number;
  };
  unreadNotifications: number;
  pendingOffers: Offer[];
  assignedBookings: Booking[];
  completedBookings: Booking[];
};

function money(value: number | null | undefined) {
  return `₹${Math.round(
    Number(value ?? 0) / 100
  ).toLocaleString("en-IN")}`;
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
      return "In Progress";
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

function formatDate(
  dateValue: string | null,
  timeValue: string | null
) {
  if (!dateValue) {
    return timeValue || "Schedule pending";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return [dateValue, timeValue]
      .filter(Boolean)
      .join(" · ");
  }

  return [
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    timeValue,
  ]
    .filter(Boolean)
    .join(" · ");
}

function isToday(dateValue: string | null) {
  if (!dateValue) return false;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function DashboardScreen() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updatingOnline, setUpdatingOnline] =
    useState(false);

  const loadDashboard = useCallback(
    async (showLoader = true) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        const response =
          await panditApiFetch(
            "/api/pandit/dashboard"
          );

        const result =
          await response.json();

        if (!response.ok) {
          if (
            result.verificationStatus ===
            "PENDING"
          ) {
            router.replace(
              "/verification-pending"
            );
            return;
          }

          throw new Error(
            result.message ||
              "Unable to load dashboard."
          );
        }

        setData(result);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "";

        if (
          message === "AUTH_REQUIRED" ||
          message === "SESSION_EXPIRED"
        ) {
          router.replace("/");
          return;
        }

        console.error(
          "Unable to load dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const toggleOnline =
    async () => {
      if (
        !data ||
        updatingOnline
      ) {
        return;
      }

      const next =
        !data.pandit.isOnline;

      setUpdatingOnline(true);

      try {
        const response =
          await panditApiFetch(
            `/api/pandits/${data.pandit.id}/online-status`,
            {
              method: "PATCH",
              body: JSON.stringify({
                isOnline: next,
              }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to update online status."
          );
        }

        setData((current) =>
          current
            ? {
                ...current,
                pandit: {
                  ...current.pandit,
                  isOnline:
                    result.pandit
                      ?.isOnline ?? next,
                },
              }
            : current
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to update online status.";

        if (
          message ===
            "AUTH_REQUIRED" ||
          message ===
            "SESSION_EXPIRED"
        ) {
          router.replace("/");
          return;
        }

        Alert.alert(
          "Online Status",
          message
        );
      } finally {
        setUpdatingOnline(false);
      }
    };

  if (
    loading &&
    !data
  ) {
    return (
      <PanditShell
        activeTab="home"
        notificationCount={0}
        onTabPress={() => {}}
      >
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />
          <Text style={styles.loadingText}>
            Loading dashboard...
          </Text>
        </View>
      </PanditShell>
    );
  }

  if (!data) {
    return (
      <PanditShell
        activeTab="home"
        notificationCount={0}
        onTabPress={() => {}}
      >
        <View
          style={styles.loadingContainer}
        >
          <Ionicons
            name="alert-circle-outline"
            size={36}
            color={Colors.textSecondary}
          />
          <Text style={styles.loadingText}>
            Dashboard could not be loaded.
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={() =>
              loadDashboard()
            }
          >
            <Text
              style={styles.retryButtonText}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      </PanditShell>
    );
  }

  const {
    pandit,
    statistics,
    unreadNotifications,
    pendingOffers,
    assignedBookings,
  } = data;

  const todayBookings =
    assignedBookings.filter(
      (booking) =>
        isToday(
          booking.date
        ) &&
        booking.status !==
          "CANCELLED"
    );

  const schedule =
    todayBookings[0] ??
    assignedBookings.find(
      (booking) =>
        booking.status !==
        "CANCELLED"
    ) ??
    null;

  const pendingOffer =
    pendingOffers[0] ?? null;

  return (
    <PanditShell
      activeTab="home"
      notificationCount={
        unreadNotifications
      }
      onTabPress={(tab) => {
        if (tab === "home")
          router.replace(
            "/dashboard"
          );

        if (tab === "requests")
          router.replace(
            "/requests"
          );

        if (tab === "bookings")
          router.replace(
            "/bookings"
          );

        if (
          tab ===
          "notifications"
        )
          router.replace(
            "/notifications"
          );

        if (tab === "profile")
          router.replace(
            "/profile"
          );
      }}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View
          style={styles.welcomeRow}
        >
          <View
            style={styles.welcomeText}
          >
            <Text
              style={styles.greeting}
            >
              Namaste, {pandit.name} 🙏
            </Text>

            <Text
              style={styles.subtitle}
            >
              Your DivyaArpan partner
              dashboard
            </Text>
          </View>

          <Pressable
            disabled={updatingOnline}
            onPress={toggleOnline}
            style={[
              styles.onlineBadge,
              !pandit.isOnline &&
                styles.offlineBadge,
            ]}
          >
            {updatingOnline ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
              />
            ) : (
              <>
                <View
                  style={[
                    styles.onlineDot,
                    !pandit.isOnline &&
                      styles.offlineDot,
                  ]}
                />

                <Text
                  style={[
                    styles.onlineText,
                    !pandit.isOnline &&
                      styles.offlineText,
                  ]}
                >
                  {pandit.isOnline
                    ? "Online"
                    : "Offline"}
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <View
          style={styles.availabilityCard}
        >
          <View
            style={styles.availabilityIcon}
          >
            <Ionicons
              name={
                pandit.isOnline
                  ? "radio-outline"
                  : "moon-outline"
              }
              size={22}
              color={
                pandit.isOnline
                  ? Colors.success
                  : Colors.textSecondary
              }
            />
          </View>

          <View
            style={
              styles.availabilityContent
            }
          >
            <Text
              style={
                styles.availabilityTitle
              }
            >
              {pandit.isOnline
                ? "You are available"
                : "You are offline"}
            </Text>

            <Text
              style={
                styles.availabilityText
              }
            >
              {pandit.isOnline
                ? "You can receive new booking requests."
                : "You won't receive new booking requests."}
            </Text>
          </View>

          <Pressable
            disabled={updatingOnline}
            onPress={toggleOnline}
            style={styles.toggleButton}
          >
            <Text
              style={
                styles.toggleButtonText
              }
            >
              {updatingOnline
                ? "Updating..."
                : pandit.isOnline
                  ? "Go Offline"
                  : "Go Online"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="document-text-outline"
            label="New Requests"
            value={String(
              statistics.pendingOffers
            )}
            accent="warning"
            onPress={() =>
              router.push(
                "/requests"
              )
            }
          />

          <StatCard
            icon="calendar-outline"
            label="Today's Bookings"
            value={String(
              todayBookings.length
            )}
            accent="primary"
            onPress={() =>
              router.push(
                "/bookings"
              )
            }
          />

          <StatCard
            icon="checkmark-circle-outline"
            label="Completed"
            value={String(
              statistics.completedBookings
            )}
            accent="success"
            onPress={() =>
              router.push(
                "/bookings"
              )
            }
          />

          <StatCard
            icon="wallet-outline"
            label="This Month"
            value={money(
              statistics.monthEarnings
            )}
            accent="primary"
            onPress={() =>
              router.push(
                "/earnings"
              )
            }
          />
        </View>

        <View
          style={styles.sectionHeader}
        >
          <Text
            style={styles.sectionTitle}
          >
            Quick Actions
          </Text>
        </View>

        <View
          style={styles.quickActions}
        >
          <QuickAction
            icon="document-text-outline"
            label="Requests"
            onPress={() =>
              router.push(
                "/requests"
              )
            }
          />

          <QuickAction
            icon="calendar-outline"
            label="Bookings"
            onPress={() =>
              router.push(
                "/bookings"
              )
            }
          />

          <QuickAction
            icon="time-outline"
            label="Availability"
            onPress={() =>
              router.push(
                "/availability"
              )
            }
          />

          <QuickAction
            icon="wallet-outline"
            label="Earnings"
            onPress={() =>
              router.push(
                "/earnings"
              )
            }
          />
        </View>

        <View
          style={styles.sectionHeader}
        >
          <Text
            style={styles.sectionTitle}
          >
            Today's Schedule
          </Text>

          <Pressable
            onPress={() =>
              router.push(
                "/bookings"
              )
            }
          >
            <Text
              style={styles.viewAll}
            >
              View All
            </Text>
          </Pressable>
        </View>

        {schedule ? (
          <View
            style={styles.bookingCard}
          >
            <View
              style={
                styles.bookingHeader
              }
            >
              <View
                style={
                  styles.bookingIcon
                }
              >
                <Ionicons
                  name="sparkles-outline"
                  size={22}
                  color={Colors.primary}
                />
              </View>

              <View
                style={
                  styles.bookingInfo
                }
              >
                <Text
                  style={
                    styles.serviceName
                  }
                >
                  {schedule.service}
                </Text>

                <Text
                  style={
                    styles.bookingId
                  }
                >
                  Booking ID ·{" "}
                  {schedule.bookingId}
                </Text>
              </View>

              <View
                style={
                  styles.confirmedBadge
                }
              >
                <Text
                  style={
                    styles.confirmedText
                  }
                >
                  {statusLabel(
                    schedule.status
                  )}
                </Text>
              </View>
            </View>

            <View
              style={styles.divider}
            />

            <View
              style={
                styles.bookingDetails
              }
            >
              <DetailItem
                icon="time-outline"
                label="Schedule"
                value={formatDate(
                  schedule.date,
                  schedule.time
                )}
              />

              <DetailItem
                icon="location-outline"
                label="Location"
                value={
                  [
                    schedule.address,
                    schedule.city,
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                  "Location pending"
                }
              />
            </View>

            <View
              style={
                styles.customerRow
              }
            >
              <View
                style={
                  styles.customerAvatar
                }
              >
                <Text
                  style={
                    styles.customerAvatarText
                  }
                >
                  {(
                    schedule.devoteeName ||
                    "D"
                  )
                    .charAt(0)
                    .toUpperCase()}
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
                  {schedule.devoteeName ||
                    "Devotee"}
                </Text>

                <Text
                  style={
                    styles.customerLocation
                  }
                >
                  {[
                    schedule.city,
                    schedule.state,
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                    "Location pending"}
                </Text>
              </View>

              <Text
                style={
                  styles.bookingPrice
                }
              >
                {money(
                  schedule.amount
                )}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                router.push({
                  pathname:
                    "/bookings/[id]",
                  params: {
                    id: schedule.bookingId,
                  },
                })
              }
              style={
                styles.viewBookingButton
              }
            >
              <Text
                style={
                  styles.viewBookingText
                }
              >
                View Booking
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={Colors.primary}
              />
            </Pressable>
          </View>
        ) : (
          <View
            style={styles.emptyCard}
          >
            <Ionicons
              name="calendar-outline"
              size={28}
              color={
                Colors.textSecondary
              }
            />

            <Text
              style={styles.emptyTitle}
            >
              No active booking
            </Text>

            <Text
              style={styles.emptyText}
            >
              Your assigned bookings
              will appear here.
            </Text>
          </View>
        )}

        <View
          style={styles.sectionHeader}
        >
          <Text
            style={styles.sectionTitle}
          >
            Booking Requests
          </Text>

          <Pressable
            onPress={() =>
              router.push(
                "/requests"
              )
            }
          >
            <Text
              style={styles.viewAll}
            >
              View All
            </Text>
          </Pressable>
        </View>

        {pendingOffer ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname:
                  "/requests/[id]",
                params: {
                  id: String(
                    pendingOffer.id
                  ),
                },
              })
            }
            style={styles.requestCard}
          >
            <View
              style={styles.requestTop}
            >
              <View
                style={
                  styles.requestIcon
                }
              >
                <Ionicons
                  name="sparkles-outline"
                  size={22}
                  color={Colors.primary}
                />
              </View>

              <View
                style={
                  styles.requestInfo
                }
              >
                <Text
                  style={
                    styles.requestService
                  }
                >
                  {
                    pendingOffer
                      .booking.service
                  }
                </Text>

                <Text
                  style={
                    styles.requestLocation
                  }
                >
                  {[
                    pendingOffer
                      .booking.address,
                    pendingOffer
                      .booking.city,
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                    "Location pending"}
                </Text>
              </View>

              <View
                style={
                  styles.pendingBadge
                }
              >
                <Text
                  style={
                    styles.pendingText
                  }
                >
                  Pending
                </Text>
              </View>
            </View>

            <View
              style={
                styles.requestMeta
              }
            >
              <MetaItem
                icon="calendar-outline"
                text={formatDate(
                  pendingOffer.booking
                    .date,
                  pendingOffer.booking
                    .time
                )}
              />

              <MetaItem
                icon="cube-outline"
                text={
                  pendingOffer.booking
                    .samagriRequired
                    ? "Samagri Required"
                    : "Samagri Not Required"
                }
              />
            </View>

            <View
              style={styles.priceRow}
            >
              <View>
                <Text
                  style={
                    styles.priceLabel
                  }
                >
                  Pandit Offer Amount
                </Text>

                <Text
                  style={styles.price}
                >
                  {money(
                    pendingOffer
                      .offeredAmount ??
                      pendingOffer.booking
                        .amount
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.arrowCircle
                }
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.primary}
                />
              </View>
            </View>
          </Pressable>
        ) : (
          <View
            style={styles.emptyCard}
          >
            <Ionicons
              name="document-text-outline"
              size={28}
              color={
                Colors.textSecondary
              }
            />

            <Text
              style={styles.emptyTitle}
            >
              No new requests
            </Text>

            <Text
              style={styles.emptyText}
            >
              New booking requests
              will appear here.
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <View
            style={styles.infoIcon}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color={Colors.primary}
            />
          </View>

          <View
            style={styles.infoContent}
          >
            <Text
              style={styles.infoTitle}
            >
              DivyaArpan Booking Policy
            </Text>

            <Text
              style={styles.infoText}
            >
              The final customer price
              is fixed by DivyaArpan.
              Pandit partners cannot
              change the booking amount.
            </Text>
          </View>
        </View>

        <View
          style={{
            height: Spacing.xl,
          }}
        />
      </ScrollView>
    </PanditShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent:
    | "primary"
    | "warning"
    | "success";
  onPress?: () => void;
}) {
  const iconColor =
    accent === "success"
      ? Colors.success
      : accent === "warning"
        ? Colors.warning
        : Colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.statCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.statIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={iconColor}
        />
      </View>

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={styles.quickActionIcon}
      >
        <Ionicons
          name={icon}
          size={21}
          color={Colors.primary}
        />
      </View>

      <Text
        style={styles.quickActionText}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailItem}>
      <Ionicons
        name={icon}
        size={17}
        color={Colors.textSecondary}
      />

      <View
        style={styles.detailItemText}
      >
        <Text
          style={styles.detailLabel}
        >
          {label}
        </Text>

        <Text
          style={styles.detailValue}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function MetaItem({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.metaItem}>
      <Ionicons
        name={icon}
        size={15}
        color={Colors.textSecondary}
      />
      <Text style={styles.metaText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  loadingContainer: {
    flex: 1,
    minHeight: 500,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: Spacing.xl,
  },

  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: Radius.md,
  },

  retryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  welcomeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },

  welcomeText: {
    flex: 1,
  },

  greeting: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },

  onlineBadge: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#ecfdf5",
  },

  offlineBadge: {
    backgroundColor: "#f4f4f5",
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },

  offlineDot: {
    backgroundColor: Colors.textSecondary,
  },

  onlineText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: "800",
  },

  offlineText: {
    color: Colors.textSecondary,
  },

  availabilityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },

  availabilityIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  availabilityContent: {
    flex: 1,
  },

  availabilityTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  availabilityText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  toggleButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: Spacing.xl,
  },

  statCard: {
    width: "48%",
    minHeight: 112,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    marginBottom: 9,
  },

  statValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "900",
  },

  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },

  sectionTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "800",
  },

  viewAll: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: Spacing.xl,
  },

  quickAction: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  quickActionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  quickActionText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  bookingCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },

  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  bookingIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  bookingInfo: {
    flex: 1,
  },

  serviceName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  bookingId: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },

  confirmedBadge: {
    maxWidth: 110,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ecfdf5",
  },

  confirmedText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },

  bookingDetails: {
    flexDirection: "row",
    gap: 12,
  },

  detailItem: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  detailItemText: {
    flex: 1,
  },

  detailLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
  },

  detailValue: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },

  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    gap: 10,
  },

  customerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  customerAvatarText: {
    color: Colors.primary,
    fontWeight: "900",
  },

  customerInfo: {
    flex: 1,
  },

  customerName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "800",
  },

  customerLocation: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  bookingPrice: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },

  viewBookingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: Spacing.md,
    paddingVertical: 11,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  viewBookingText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  requestCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },

  requestTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  requestIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  requestInfo: {
    flex: 1,
  },

  requestService: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  requestLocation: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },

  pendingBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#fff7ed",
  },

  pendingText: {
    color: Colors.warning,
    fontSize: 10,
    fontWeight: "800",
  },

  requestMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: Spacing.md,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  metaText: {
    color: Colors.textSecondary,
    fontSize: 11,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },

  priceLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
  },

  price: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },

  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  infoCard: {
    flexDirection: "row",
    gap: 10,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "800",
  },

  infoText: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },

  emptyTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 9,
  },

  emptyText: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },

  pressed: {
    opacity: 0.72,
  },
});
