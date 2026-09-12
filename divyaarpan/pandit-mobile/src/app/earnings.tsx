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
  Pressable,
  RefreshControl,
  SafeAreaView,
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

type EarningBooking = {
  id: number;
  bookingId: string;
  service: string;
  city: string | null;
  state: string | null;
  address: string | null;
  date: string;
  time: string;
  amount: number | null;
  paymentStatus: string;
  completedAt: string | null;
  createdAt: string;
};

type EarningsResponse = {
  success: boolean;

  summary: {
    todayEarnings: number;
    weekEarnings: number;
    monthEarnings: number;
    totalEarnings: number;
    completedBookings: number;
    customerPaidBookingAmount: number;
    customerUnpaidBookingAmount: number;
  };

  earnings:
    EarningBooking[];

  unreadNotifications: number;

  settlement: {
    available: boolean;
    message: string;
  };
};

function money(
  value:
    | number
    | null
    | undefined
) {
  return `₹${Math.round(
    Number(value ?? 0) / 100
  ).toLocaleString("en-IN")}`;
}

function formatCompletedDate(
  value: string | null
) {
  if (!value) {
    return "Completed";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Completed";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function locationText(
  booking:
    EarningBooking
) {
  return [
    booking.city,
    booking.state,
  ]
    .filter(Boolean)
    .join(", ") ||
    booking.address ||
    "Location unavailable";
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon:
    keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View
      style={styles.statCard}
    >
      <View
        style={styles.statIcon}
      >
        <Ionicons
          name={icon}
          size={19}
          color={Colors.primary}
        />
      </View>

      <Text
        style={styles.statValue}
      >
        {value}
      </Text>

      <Text
        style={styles.statLabel}
      >
        {label}
      </Text>
    </View>
  );
}

export default function EarningsScreen() {
  const [data, setData] =
    useState<EarningsResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const loadEarnings =
    useCallback(
      async (
        refresh = false
      ) => {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        try {
          const response =
            await panditApiFetch(
              "/api/pandit/earnings"
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Unable to load earnings."
            );
          }

          setData(
            result as
              EarningsResponse
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "";

          if (
            message ===
              "AUTH_REQUIRED" ||
            message ===
              "SESSION_EXPIRED"
          ) {
            router.replace("/");
            return;
          }

          setError(
            message ||
              "Unable to load earnings."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  useFocusEffect(
    useCallback(() => {
      void loadEarnings();
    }, [loadEarnings])
  );

  const notificationCount =
    data?.unreadNotifications ??
    0;

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
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={
              Colors.primary
            }
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading earnings...
          </Text>
        </View>
      </PanditShell>
    );
  }

  return (
    <PanditShell
      activeTab="home"
      notificationCount={
        notificationCount
      }
      onTabPress={(tab) => {
        if (tab === "home")
          router.replace(
            "/dashboard"
          );

        if (
          tab === "requests"
        )
          router.replace(
            "/requests"
          );

        if (
          tab === "bookings"
        )
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
      <SafeAreaView
        style={styles.safeArea}
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={() =>
                void loadEarnings(
                  true
                )
              }
            />
          }
        >
          <View
            style={styles.header}
          >
            <Pressable
              onPress={() =>
                router.back()
              }
              style={
                styles.backButton
              }
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color={Colors.text}
              />
            </Pressable>

            <View
              style={
                styles.headerText
              }
            >
              <Text
                style={styles.title}
              >
                Earnings
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                Earnings from your
                completed DivyaArpan
                bookings
              </Text>
            </View>
          </View>

          {error ? (
            <View
              style={
                styles.errorCard
              }
            >
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color={
                  Colors.error
                }
              />

              <Text
                style={
                  styles.errorText
                }
              >
                {error}
              </Text>

              <Pressable
                onPress={() =>
                  void loadEarnings()
                }
              >
                <Text
                  style={
                    styles.retryText
                  }
                >
                  Retry
                </Text>
              </Pressable>
            </View>
          ) : null}

          {data ? (
            <>
              <View
                style={
                  styles.earningsCard
                }
              >
                <Text
                  style={
                    styles.earningsLabel
                  }
                >
                  This Month
                </Text>

                <Text
                  style={
                    styles.earningsAmount
                  }
                >
                  {money(
                    data.summary
                      .monthEarnings
                  )}
                </Text>

                <Text
                  style={
                    styles.earningsPeriod
                  }
                >
                  {
                    new Date().toLocaleDateString(
                      "en-IN",
                      {
                        month:
                          "long",
                        year:
                          "numeric",
                      }
                    )
                  }
                </Text>
              </View>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Earnings Overview
              </Text>

              <View
                style={
                  styles.statsGrid
                }
              >
                <StatCard
                  icon="today-outline"
                  label="Today"
                  value={money(
                    data.summary
                      .todayEarnings
                  )}
                />

                <StatCard
                  icon="trending-up-outline"
                  label="This Week"
                  value={money(
                    data.summary
                      .weekEarnings
                  )}
                />

                <StatCard
                  icon="calendar-outline"
                  label="This Month"
                  value={money(
                    data.summary
                      .monthEarnings
                  )}
                />

                <StatCard
                  icon="wallet-outline"
                  label="Lifetime"
                  value={money(
                    data.summary
                      .totalEarnings
                  )}
                />
              </View>

              <View
                style={
                  styles.completedCard
                }
              >
                <View
                  style={
                    styles.completedIcon
                  }
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color={
                      Colors.success
                    }
                  />
                </View>

                <View
                  style={{ flex: 1 }}
                >
                  <Text
                    style={
                      styles.completedTitle
                    }
                  >
                    Completed Bookings
                  </Text>

                  <Text
                    style={
                      styles.completedValue
                    }
                  >
                    {
                      data.summary
                        .completedBookings
                    }
                  </Text>
                </View>
              </View>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Settlement
              </Text>

              <View
                style={
                  styles.settlementCard
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={
                    Colors.primary
                  }
                />

                <View
                  style={{ flex: 1 }}
                >
                  <Text
                    style={
                      styles.settlementTitle
                    }
                  >
                    Settlement Tracking
                  </Text>

                  <Text
                    style={
                      styles.settlementText
                    }
                  >
                    {
                      data.settlement
                        .message
                    }
                  </Text>
                </View>
              </View>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Earnings History
              </Text>

              {data.earnings
                .length === 0 ? (
                <View
                  style={
                    styles.emptyCard
                  }
                >
                  <Ionicons
                    name="wallet-outline"
                    size={30}
                    color={
                      Colors.textMuted
                    }
                  />

                  <Text
                    style={
                      styles.emptyTitle
                    }
                  >
                    No earnings yet
                  </Text>

                  <Text
                    style={
                      styles.emptyText
                    }
                  >
                    Completed bookings
                    will appear here.
                  </Text>
                </View>
              ) : (
                <View
                  style={
                    styles.historyCard
                  }
                >
                  {data.earnings.map(
                    (
                      earning,
                      index
                    ) => (
                      <View
                        key={
                          earning.id
                        }
                      >
                        <Pressable
                          onPress={() =>
                            router.push(
                              {
                                pathname:
                                  "/bookings/[id]",
                                params:
                                  {
                                    id: earning.bookingId,
                                  },
                              }
                            )
                          }
                          style={
                            styles.earningRow
                          }
                        >
                          <View
                            style={
                              styles.historyIcon
                            }
                          >
                            <Ionicons
                              name="sparkles-outline"
                              size={
                                19
                              }
                              color={
                                Colors.primary
                              }
                            />
                          </View>

                          <View
                            style={
                              styles.historyContent
                            }
                          >
                            <Text
                              style={
                                styles.historyPooja
                              }
                            >
                              {
                                earning.service
                              }
                            </Text>

                            <Text
                              style={
                                styles.historyId
                              }
                            >
                              {
                                earning.bookingId
                              }
                            </Text>

                            <Text
                              style={
                                styles.historyDetails
                              }
                            >
                              {formatCompletedDate(
                                earning.completedAt
                              )}
                              {" · "}
                              {locationText(
                                earning
                              )}
                            </Text>

                            <Text
                              style={
                                styles.customerPayment
                              }
                            >
                              Customer payment:{" "}
                              {
                                earning.paymentStatus
                              }
                            </Text>
                          </View>

                          <View
                            style={
                              styles.historyRight
                            }
                          >
                            <Text
                              style={
                                styles.historyAmount
                              }
                            >
                              {money(
                                earning.amount
                              )}
                            </Text>

                            <View
                              style={
                                styles.completedBadge
                              }
                            >
                              <Text
                                style={
                                  styles.completedBadgeText
                                }
                              >
                                Completed
                              </Text>
                            </View>
                          </View>
                        </Pressable>

                        {index <
                          data.earnings
                            .length -
                            1 && (
                          <View
                            style={
                              styles.divider
                            }
                          />
                        )}
                      </View>
                    )
                  )}
                </View>
              )}

              <View
                style={
                  styles.policyCard
                }
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color={
                    Colors.primary
                  }
                />

                <View
                  style={{ flex: 1 }}
                >
                  <Text
                    style={
                      styles.policyTitle
                    }
                  >
                    Earnings Policy
                  </Text>

                  <Text
                    style={
                      styles.policyText
                    }
                  >
                    These figures are
                    based on the final
                    booking amount for
                    completed bookings.
                    Customer payment
                    status is shown
                    separately from
                    Pandit settlement.
                  </Text>
                </View>
              </View>
            </>
          ) : null}

          <View
            style={{
              height:
                Spacing.xxl,
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </PanditShell>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        Colors.background,
    },

    content: {
      padding: Spacing.lg,
      paddingBottom: 120,
    },

    loadingContainer: {
      minHeight: 500,
      alignItems: "center",
      justifyContent:
        "center",
      gap: 12,
    },

    loadingText: {
      color:
        Colors.textSecondary,
      fontSize: 13,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom:
        Spacing.lg,
    },

    backButton: {
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius:
        Radius.md,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    headerText: {
      flex: 1,
      marginLeft:
        Spacing.md,
    },

    title: {
      fontSize: 24,
      fontWeight: "800",
      color: Colors.text,
    },

    subtitle: {
      marginTop: 3,
      fontSize: 12,
      lineHeight: 17,
      color:
        Colors.textSecondary,
    },

    earningsCard: {
      padding:
        Spacing.xl,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.primarySoft,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    earningsLabel: {
      fontSize: 12,
      color:
        Colors.textSecondary,
    },

    earningsAmount: {
      marginTop: 5,
      fontSize: 31,
      fontWeight: "900",
      color:
        Colors.primaryDark,
    },

    earningsPeriod: {
      marginTop: 5,
      fontSize: 12,
      color:
        Colors.textSecondary,
    },

    sectionTitle: {
      marginTop:
        Spacing.xl,
      marginBottom:
        Spacing.md,
      fontSize: 16,
      fontWeight: "800",
      color: Colors.text,
    },

    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },

    statCard: {
      width: "48%",
      padding:
        Spacing.md,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        Colors.background,
    },

    statValue: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: "900",
      color: Colors.text,
    },

    statLabel: {
      marginTop: 3,
      fontSize: 11,
      color:
        Colors.textSecondary,
    },

    completedCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop:
        Spacing.lg,
      padding:
        Spacing.md,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    completedIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#ECFDF5",
    },

    completedTitle: {
      fontSize: 12,
      color:
        Colors.textSecondary,
    },

    completedValue: {
      marginTop: 2,
      fontSize: 21,
      fontWeight: "900",
      color: Colors.text,
    },

    settlementCard: {
      flexDirection: "row",
      alignItems:
        "flex-start",
      gap: 11,
      padding:
        Spacing.md,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    settlementTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: Colors.text,
    },

    settlementText: {
      marginTop: 4,
      fontSize: 11,
      lineHeight: 17,
      color:
        Colors.textSecondary,
    },

    historyCard: {
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.surface,
      overflow: "hidden",
    },

    earningRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding:
        Spacing.md,
    },

    historyIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        Colors.background,
    },

    historyContent: {
      flex: 1,
    },

    historyPooja: {
      fontSize: 13,
      fontWeight: "800",
      color: Colors.text,
    },

    historyId: {
      marginTop: 2,
      fontSize: 10,
      color:
        Colors.textMuted,
    },

    historyDetails: {
      marginTop: 4,
      fontSize: 10,
      lineHeight: 15,
      color:
        Colors.textSecondary,
    },

    customerPayment: {
      marginTop: 3,
      fontSize: 9,
      color:
        Colors.textMuted,
    },

    historyRight: {
      alignItems:
        "flex-end",
      gap: 6,
    },

    historyAmount: {
      fontSize: 14,
      fontWeight: "900",
      color:
        Colors.primary,
    },

    completedBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor:
        "#ECFDF5",
    },

    completedBadgeText: {
      fontSize: 9,
      fontWeight: "800",
      color:
        Colors.success,
    },

    divider: {
      height: 1,
      backgroundColor:
        Colors.border,
    },

    emptyCard: {
      alignItems: "center",
      padding:
        Spacing.xl,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    emptyTitle: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: "800",
      color: Colors.text,
    },

    emptyText: {
      marginTop: 4,
      fontSize: 11,
      color:
        Colors.textSecondary,
    },

    errorCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      marginBottom:
        Spacing.md,
      padding:
        Spacing.md,
      borderRadius:
        Radius.md,
      backgroundColor:
        "#FFF5F5",
    },

    errorText: {
      flex: 1,
      fontSize: 11,
      color:
        Colors.textSecondary,
    },

    retryText: {
      fontSize: 11,
      fontWeight: "800",
      color:
        Colors.primary,
    },

    policyCard: {
      flexDirection: "row",
      alignItems:
        "flex-start",
      gap: 10,
      marginTop:
        Spacing.xl,
      padding:
        Spacing.md,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.primarySoft,
    },

    policyTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: Colors.text,
    },

    policyText: {
      marginTop: 4,
      fontSize: 11,
      lineHeight: 17,
      color:
        Colors.textSecondary,
    },
  });
