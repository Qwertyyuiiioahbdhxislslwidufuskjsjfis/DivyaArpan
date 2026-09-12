import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
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
  city: string;
  state: string | null;
  address: string;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
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
  poojaCharges: number | null;
  travelCharges: number | null;
  discount: number | null;
  completedAt: string | null;
};

type BookingResponse = {
  success?: boolean;
  booking?: Booking;
  error?: string;
};

type Stage = {
  status: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
};

const progressStages: Stage[] = [
  {
    status: "CONFIRMED",
    label: "Confirmed",
    icon: "checkmark-circle-outline",
    description:
      "Customer payment and booking confirmation completed.",
  },
  {
    status: "PANDIT_ON_THE_WAY",
    label: "On the Way",
    icon: "navigate-outline",
    description:
      "Pandit is travelling to the service location.",
  },
  {
    status: "IN_PROGRESS",
    label: "Pooja Started",
    icon: "sparkles-outline",
    description:
      "Pooja or service is currently in progress.",
  },
  {
    status: "COMPLETED",
    label: "Completed",
    icon: "checkmark-done-outline",
    description:
      "Pooja or service has been completed.",
  },
];

function money(
  paise: number | null | undefined
) {
  if (paise == null) {
    return "Amount pending";
  }

  return `₹${(paise / 100).toLocaleString(
    "en-IN"
  )}`;
}

function statusLabel(status: string) {
  switch (status) {
    case "PANDIT_ASSIGNED":
      return "Pandit Assigned";

    case "AWAITING_PAYMENT":
      return "Awaiting Customer Payment";

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

function nextAction(status: string) {
  switch (status) {
    case "CONFIRMED":
      return {
        status: "PANDIT_ON_THE_WAY",
        label: "Start Journey",
        icon: "navigate-outline" as const,
        confirmTitle: "Start Journey?",
        confirmMessage:
          "Confirm that you are now leaving for the devotee's service location.",
      };

    case "PANDIT_ON_THE_WAY":
      return {
        status: "IN_PROGRESS",
        label: "Start Pooja",
        icon: "sparkles-outline" as const,
        confirmTitle: "Start Pooja?",
        confirmMessage:
          "Confirm that you have reached the service location and are starting the booked pooja.",
      };

    case "IN_PROGRESS":
      return {
        status: "COMPLETED",
        label: "Complete Pooja",
        icon:
          "checkmark-done-outline" as const,
        confirmTitle: "Complete Booking?",
        confirmMessage:
          "Confirm that the booked pooja or service has been fully completed.",
      };

    default:
      return null;
  }
}

export default function BookingDetailsScreen() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [notificationCount] =
    useState(0);

  const loadBooking =
    useCallback(async () => {
      if (!id) {
        setError(
          "Booking ID is missing."
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response =
          await panditApiFetch(
            `/api/pandit-bookings/${encodeURIComponent(
              id
            )}`
          );

        const data =
          (await response.json()) as
            BookingResponse;

        if (
          !response.ok ||
          !data.success ||
          !data.booking
        ) {
          throw new Error(
            data.error ||
              "Unable to load booking."
          );
        }

        setBooking(data.booking);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load booking.";

        if (
          message ===
            "AUTH_REQUIRED" ||
          message ===
            "SESSION_EXPIRED"
        ) {
          router.replace("/");
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    }, [id]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  const action = useMemo(
    () =>
      booking
        ? nextAction(
            booking.status
          )
        : null,
    [booking]
  );

  const currentProgressIndex =
    useMemo(() => {
      if (!booking) return -1;

      return progressStages.findIndex(
        (stage) =>
          stage.status ===
          booking.status
      );
    }, [booking]);

  async function updateStatus(
    newStatus: string
  ) {
    if (
      !booking ||
      updating
    ) {
      return;
    }

    setUpdating(true);

    try {
      const response =
        await panditApiFetch(
          `/api/pandit-bookings/${encodeURIComponent(
            booking.bookingId
          )}/status`,
          {
            method: "PUT",
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

      const data =
        (await response.json()) as {
          success?: boolean;
          error?: string;
          message?: string;
          booking?: Booking;
        };

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to update booking status."
        );
      }

      if (data.booking) {
        setBooking(data.booking);
      } else {
        await loadBooking();
      }

      Alert.alert(
        "Booking Updated",
        data.message ||
          "Booking status updated successfully."
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update booking.";

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
        "Unable to Update",
        message
      );

      await loadBooking();
    } finally {
      setUpdating(false);
    }
  }

  function confirmStatusUpdate() {
    if (!action) return;

    Alert.alert(
      action.confirmTitle,
      action.confirmMessage,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: action.label,
          onPress: () =>
            void updateStatus(
              action.status
            ),
        },
      ]
    );
  }

  async function openNavigation() {
    if (!booking) return;

    const query =
      booking.latitude != null &&
      booking.longitude != null
        ? `${booking.latitude},${booking.longitude}`
        : [
            booking.address,
            booking.city,
            booking.state,
            booking.pincode,
          ]
            .filter(Boolean)
            .join(", ");

    const url =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
      )}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Navigation unavailable",
        "Unable to open the map application."
      );
    }
  }

  return (
    <PanditShell
      activeTab="bookings"
      notificationCount={
        notificationCount
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
          tab === "notifications"
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
        <Pressable
          onPress={() =>
            router.back()
          }
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={Colors.text}
          />

          <Text
            style={styles.backText}
          >
            My Bookings
          </Text>
        </Pressable>

        {loading ? (
          <View
            style={styles.stateCard}
          >
            <ActivityIndicator
              size="large"
              color={Colors.primary}
            />

            <Text
              style={styles.stateText}
            >
              Loading booking...
            </Text>
          </View>
        ) : error || !booking ? (
          <View
            style={styles.stateCard}
          >
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color={Colors.error}
            />

            <Text
              style={styles.errorText}
            >
              {error ||
                "Booking not found."}
            </Text>

            <Pressable
              onPress={() =>
                router.replace(
                  "/bookings"
                )
              }
              style={
                styles.retryButton
              }
            >
              <Text
                style={
                  styles.retryText
                }
              >
                Back to Bookings
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View
              style={styles.hero}
            >
              <View
                style={
                  styles.heroIcon
                }
              >
                <Ionicons
                  name="sparkles-outline"
                  size={30}
                  color={Colors.primary}
                />
              </View>

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

              <View
                style={
                  styles.statusBadge
                }
              >
                <View
                  style={
                    styles.statusDot
                  }
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

            {(booking.status ===
              "PANDIT_ASSIGNED" ||
              booking.status ===
                "AWAITING_PAYMENT") && (
              <View
                style={
                  styles.waitingCard
                }
              >
                <Ionicons
                  name="card-outline"
                  size={23}
                  color={Colors.primary}
                />

                <View
                  style={
                    styles.waitingContent
                  }
                >
                  <Text
                    style={
                      styles.waitingTitle
                    }
                  >
                    Waiting for customer
                    confirmation
                  </Text>

                  <Text
                    style={
                      styles.waitingText
                    }
                  >
                    You have accepted
                    this booking. Journey
                    actions will become
                    available only after
                    payment and booking
                    confirmation.
                  </Text>
                </View>
              </View>
            )}

            {currentProgressIndex >=
              0 && (
              <View
                style={styles.section}
              >
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Booking Progress
                </Text>

                <View
                  style={
                    styles.progressCard
                  }
                >
                  {progressStages.map(
                    (
                      stage,
                      index
                    ) => {
                      const done =
                        index <=
                        currentProgressIndex;

                      const active =
                        index ===
                        currentProgressIndex;

                      return (
                        <View
                          key={
                            stage.status
                          }
                          style={
                            styles.progressItem
                          }
                        >
                          <View
                            style={
                              styles.progressLeft
                            }
                          >
                            <View
                              style={[
                                styles.progressIcon,
                                done &&
                                  styles.progressIconCompleted,
                                active &&
                                  styles.progressIconActive,
                              ]}
                            >
                              <Ionicons
                                name={
                                  stage.icon
                                }
                                size={
                                  17
                                }
                                color={
                                  done
                                    ? Colors.white
                                    : Colors.textMuted
                                }
                              />
                            </View>

                            {index <
                              progressStages.length -
                                1 && (
                              <View
                                style={[
                                  styles.progressLine,
                                  index <
                                    currentProgressIndex &&
                                    styles.progressLineCompleted,
                                ]}
                              />
                            )}
                          </View>

                          <View
                            style={
                              styles.progressText
                            }
                          >
                            <Text
                              style={[
                                styles.progressLabel,
                                done &&
                                  styles.progressLabelCompleted,
                              ]}
                            >
                              {
                                stage.label
                              }
                            </Text>

                            <Text
                              style={
                                styles.progressDescription
                              }
                            >
                              {
                                stage.description
                              }
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  )}
                </View>
              </View>
            )}

            <Section
              title="Schedule"
            >
              <DetailRow
                icon="calendar-outline"
                label="Date"
                value={
                  booking.date
                }
              />

              <DetailRow
                icon="time-outline"
                label="Time"
                value={
                  booking.time
                }
              />

              <DetailRow
                icon="hourglass-outline"
                label="Booking Type"
                value={
                  booking.bookingType ===
                  "IMMEDIATE"
                    ? "Immediate"
                    : "Scheduled"
                }
              />
            </Section>

            <Section
              title="Devotee"
            >
              <View
                style={
                  styles.customerCard
                }
              >
                <View
                  style={
                    styles.avatar
                  }
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
                    {
                      booking.devoteeName
                    }
                  </Text>

                  <Text
                    style={
                      styles.customerLocation
                    }
                  >
                    {[
                      booking.city,
                      booking.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                </View>
              </View>

              <DetailRow
                icon="call-outline"
                label="Mobile"
                value={
                  booking.mobile
                }
              />

              {booking.email && (
                <DetailRow
                  icon="mail-outline"
                  label="Email"
                  value={
                    booking.email
                  }
                />
              )}
            </Section>

            <Section
              title="Pooja Details"
            >
              <DetailRow
                icon="sparkles-outline"
                label="Service"
                value={
                  booking.service
                }
              />

              <DetailRow
                icon="language-outline"
                label="Language"
                value={
                  booking.language
                }
              />

              <DetailRow
                icon="cube-outline"
                label="Samagri"
                value={
                  booking.samagriCharges !=
                    null &&
                  booking.samagriCharges >
                    0
                    ? "Included in booking"
                    : "As per booking"
                }
              />

              {booking.sankalp && (
                <DetailRow
                  icon="heart-outline"
                  label="Mannat / Sankalp"
                  value={
                    booking.sankalp
                  }
                />
              )}
            </Section>

            <Section
              title="Service Location"
            >
              <View
                style={
                  styles.locationCard
                }
              >
                <View
                  style={
                    styles.locationIcon
                  }
                >
                  <Ionicons
                    name="location-outline"
                    size={22}
                    color={Colors.primary}
                  />
                </View>

                <View
                  style={
                    styles.locationContent
                  }
                >
                  <Text
                    style={
                      styles.locationTitle
                    }
                  >
                    {booking.address}
                  </Text>

                  <Text
                    style={
                      styles.locationCity
                    }
                  >
                    {[
                      booking.city,
                      booking.state,
                      booking.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  void openNavigation()
                }
                style={
                  styles.mapButton
                }
              >
                <Ionicons
                  name="navigate-outline"
                  size={17}
                  color={Colors.primary}
                />

                <Text
                  style={
                    styles.mapButtonText
                  }
                >
                  Open Navigation
                </Text>
              </Pressable>
            </Section>

            <View
              style={
                styles.amountCard
              }
            >
              <View>
                <Text
                  style={
                    styles.amountLabel
                  }
                >
                  DivyaArpan Booking
                  Amount
                </Text>

                <Text
                  style={
                    styles.amount
                  }
                >
                  {money(
                    booking.amount
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.fixedBadge
                }
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={14}
                  color={
                    Colors.primaryDark
                  }
                />

                <Text
                  style={
                    styles.fixedText
                  }
                >
                  Fixed
                </Text>
              </View>
            </View>

            {action && (
              <Pressable
                disabled={
                  updating
                }
                onPress={
                  confirmStatusUpdate
                }
                style={[
                  styles.primaryAction,
                  updating &&
                    styles.disabledButton,
                ]}
              >
                {updating ? (
                  <ActivityIndicator
                    size="small"
                    color={
                      Colors.white
                    }
                  />
                ) : (
                  <>
                    <Ionicons
                      name={
                        action.icon
                      }
                      size={20}
                      color={
                        Colors.white
                      }
                    />

                    <Text
                      style={
                        styles.primaryActionText
                      }
                    >
                      {action.label}
                    </Text>
                  </>
                )}
              </Pressable>
            )}

            {booking.status ===
              "COMPLETED" && (
              <View
                style={
                  styles.completedCard
                }
              >
                <Ionicons
                  name="checkmark-circle"
                  size={25}
                  color={
                    Colors.success
                  }
                />

                <View
                  style={
                    styles.completedContent
                  }
                >
                  <Text
                    style={
                      styles.completedTitle
                    }
                  >
                    Booking Completed
                  </Text>

                  <Text
                    style={
                      styles.completedText
                    }
                  >
                    This pooja has been
                    completed and will be
                    included in your
                    completed bookings.
                  </Text>
                </View>
              </View>
            )}

            {booking.status ===
              "CANCELLED" && (
              <View
                style={
                  styles.cancelledCard
                }
              >
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={Colors.error}
                />

                <View
                  style={
                    styles.completedContent
                  }
                >
                  <Text
                    style={
                      styles.cancelledTitle
                    }
                  >
                    Booking Cancelled
                  </Text>

                  <Text
                    style={
                      styles.completedText
                    }
                  >
                    No further action is
                    required for this
                    booking.
                  </Text>
                </View>
              </View>
            )}

            <Text
              style={
                styles.footerNote
              }
            >
              Booking status changes are
              synchronized with
              DivyaArpan immediately.
            </Text>
          </>
        )}

        <View
          style={{
            height: Spacing.xxl,
          }}
        />
      </ScrollView>
    </PanditShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text
        style={styles.sectionTitle}
      >
        {title}
      </Text>

      <View
        style={styles.sectionCard}
      >
        {children}
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={Colors.primary}
        />
      </View>

      <View
        style={styles.detailContent}
      >
        <Text
          style={styles.detailLabel}
        >
          {label}
        </Text>

        <Text
          style={styles.detailValue}
        >
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

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  backText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },

  stateCard: {
    minHeight: 260,
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
  },

  stateText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textSecondary,
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

  hero: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primarySoft,
  },

  serviceName: {
    marginTop: Spacing.md,
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
  },

  bookingId: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textMuted,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.primarySoft,
  },

  statusDot: {
    width: 7,
    height: 7,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  waitingCard: {
    flexDirection: "row",
    gap: 11,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: "#FFF9ED",
  },

  waitingContent: {
    flex: 1,
  },

  waitingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.text,
  },

  waitingText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  section: {
    marginTop: Spacing.lg,
  },

  sectionTitle: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
  },

  sectionCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },

  progressCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    padding: Spacing.md,
  },

  progressItem: {
    flexDirection: "row",
    minHeight: 72,
  },

  progressLeft: {
    width: 38,
    alignItems: "center",
  },

  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  progressIconCompleted: {
    backgroundColor: Colors.primary,
  },

  progressIconActive: {
    borderWidth: 2,
    borderColor: Colors.primaryDark,
  },

  progressLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
  },

  progressLineCompleted: {
    backgroundColor: Colors.primary,
  },

  progressText: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 14,
  },

  progressLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
  },

  progressLabelCompleted: {
    color: Colors.text,
  },

  progressDescription: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textSecondary,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  detailIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primarySoft,
  },

  detailContent: {
    flex: 1,
    marginLeft: 11,
  },

  detailLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },

  detailValue: {
    marginTop: 3,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: Colors.text,
  },

  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF3D6",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  customerInfo: {
    flex: 1,
    marginLeft: 11,
  },

  customerName: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.text,
  },

  customerLocation: {
    marginTop: 3,
    fontSize: 12,
    color: Colors.textMuted,
  },

  locationCard: {
    flexDirection: "row",
    padding: Spacing.md,
  },

  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primarySoft,
  },

  locationContent: {
    flex: 1,
    marginLeft: 11,
  },

  locationTitle: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    color: Colors.text,
  },

  locationCity: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    margin: Spacing.md,
    marginTop: 0,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
  },

  mapButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.primary,
  },

  amountCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "#F0D99A",
    borderRadius: Radius.lg,
    backgroundColor: "#FFF9ED",
  },

  amountLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },

  amount: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  fixedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.white,
  },

  fixedText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  primaryAction: {
    minHeight: 52,
    marginTop: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },

  primaryActionText: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.white,
  },

  disabledButton: {
    opacity: 0.45,
  },

  completedCard: {
    flexDirection: "row",
    gap: 10,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: "#F3FBF5",
  },

  cancelledCard: {
    flexDirection: "row",
    gap: 10,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: "#FFF5F5",
  },

  completedContent: {
    flex: 1,
  },

  completedTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.text,
  },

  cancelledTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.error,
  },

  completedText: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  footerNote: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 11,
    color: Colors.textMuted,
  },
});
