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
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
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

type DayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

type DayAvailability = {
  key: DayKey;
  dayOfWeek: number;
  label: string;
  shortLabel: string;
  enabled: boolean;
  start: string;
  end: string;
};

type ApiAvailability = {
  panditId: number;
  isOnline: boolean;
  acceptsImmediate: boolean;
  acceptsScheduled: boolean;
  radiusKm: number;
  weekly: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
};

const DAY_META: {
  key: DayKey;
  dayOfWeek: number;
  label: string;
  shortLabel: string;
}[] = [
  {
    key: "monday",
    dayOfWeek: 1,
    label: "Monday",
    shortLabel: "Mon",
  },
  {
    key: "tuesday",
    dayOfWeek: 2,
    label: "Tuesday",
    shortLabel: "Tue",
  },
  {
    key: "wednesday",
    dayOfWeek: 3,
    label: "Wednesday",
    shortLabel: "Wed",
  },
  {
    key: "thursday",
    dayOfWeek: 4,
    label: "Thursday",
    shortLabel: "Thu",
  },
  {
    key: "friday",
    dayOfWeek: 5,
    label: "Friday",
    shortLabel: "Fri",
  },
  {
    key: "saturday",
    dayOfWeek: 6,
    label: "Saturday",
    shortLabel: "Sat",
  },
  {
    key: "sunday",
    dayOfWeek: 0,
    label: "Sunday",
    shortLabel: "Sun",
  },
];

const TIME_OPTIONS = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
];

const RADIUS_OPTIONS =
  [5, 10, 15, 25, 50];

function to24Hour(
  value: string
) {
  const match =
    value.match(
      /^(\d{2}):(\d{2}) (AM|PM)$/
    );

  if (!match) return value;

  let hour =
    Number(match[1]);

  const minute =
    match[2];

  const period =
    match[3];

  if (
    period === "AM" &&
    hour === 12
  ) {
    hour = 0;
  }

  if (
    period === "PM" &&
    hour !== 12
  ) {
    hour += 12;
  }

  return `${String(hour).padStart(
    2,
    "0"
  )}:${minute}`;
}

function to12Hour(
  value: string
) {
  const match =
    value.match(
      /^(\d{2}):(\d{2})$/
    );

  if (!match) {
    return "09:00 AM";
  }

  const rawHour =
    Number(match[1]);

  const minute =
    match[2];

  const period =
    rawHour >= 12
      ? "PM"
      : "AM";

  const hour =
    rawHour % 12 || 12;

  return `${String(hour).padStart(
    2,
    "0"
  )}:${minute} ${period}`;
}

function createDefaultDays():
  DayAvailability[] {
  return DAY_META.map(
    (day) => ({
      ...day,
      enabled:
        day.key !== "sunday",
      start: "09:00 AM",
      end: "08:00 PM",
    })
  );
}

function fromApiWeekly(
  weekly:
    ApiAvailability["weekly"]
) {
  return DAY_META.map(
    (meta) => {
      const existing =
        weekly.find(
          (item) =>
            item.dayOfWeek ===
            meta.dayOfWeek
        );

      return {
        ...meta,

        enabled:
          existing?.isAvailable ??
          false,

        start:
          existing
            ? to12Hour(
                existing.startTime
              )
            : "09:00 AM",

        end:
          existing
            ? to12Hour(
                existing.endTime
              )
            : "08:00 PM",
      };
    }
  );
}

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange:
    (value: boolean) => void;
}) {
  return (
    <View
      style={styles.preferenceRow}
    >
      <View
        style={
          styles.preferenceIcon
        }
      >
        <Ionicons
          name={icon}
          size={20}
          color={Colors.primary}
        />
      </View>

      <View
        style={
          styles.preferenceContent
        }
      >
        <Text
          style={
            styles.preferenceTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.preferenceSubtitle
          }
        >
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={
          onValueChange
        }
        trackColor={{
          false:
            Colors.borderStrong,
          true: "#86efac",
        }}
        thumbColor={
          value
            ? Colors.success
            : "#f4f4f5"
        }
      />
    </View>
  );
}

export default function AvailabilityScreen() {
  const [panditId, setPanditId] =
    useState<number | null>(null);

  const [isOnline, setIsOnline] =
    useState(false);

  const [
    acceptImmediate,
    setAcceptImmediate,
  ] = useState(true);

  const [
    acceptScheduled,
    setAcceptScheduled,
  ] = useState(true);

  const [days, setDays] =
    useState<DayAvailability[]>(
      createDefaultDays()
    );

  const [radius, setRadius] =
    useState(10);

  const [
    selectedDay,
    setSelectedDay,
  ] =
    useState<DayKey>(
      "monday"
    );

  const [
    timeMode,
    setTimeMode,
  ] =
    useState<
      "start" | "end"
    >("start");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  const selectedDayData =
    useMemo(
      () =>
        days.find(
          (day) =>
            day.key ===
            selectedDay
        ) ?? days[0],
      [
        days,
        selectedDay,
      ]
    );

  const selectedTime =
    timeMode === "start"
      ? selectedDayData.start
      : selectedDayData.end;

  const loadAvailability =
    useCallback(
      async (
        refresh = false
      ) => {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        try {
          const response =
            await panditApiFetch(
              "/api/pandit/availability"
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Unable to load availability."
            );
          }

          const availability =
            result.availability as
              ApiAvailability;

          setPanditId(
            availability.panditId
          );

          setIsOnline(
            availability.isOnline
          );

          setAcceptImmediate(
            availability.acceptsImmediate
          );

          setAcceptScheduled(
            availability.acceptsScheduled
          );

          setRadius(
            Number(
              availability.radiusKm ??
                10
            )
          );

          setDays(
            fromApiWeekly(
              availability.weekly ??
                []
            )
          );

          setNotificationCount(
            Number(
              result.unreadNotifications ??
                0
            )
          );

          setSaved(true);
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

          Alert.alert(
            "Availability",
            message ||
              "Unable to load availability."
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
      void loadAvailability();
    }, [loadAvailability])
  );

  function updateDay(
    dayKey: DayKey,
    updates:
      Partial<DayAvailability>
  ) {
    setSaved(false);

    setDays(
      (current) =>
        current.map(
          (day) =>
            day.key === dayKey
              ? {
                  ...day,
                  ...updates,
                }
              : day
        )
    );
  }

  function handleTimeChange(
    time: string
  ) {
    if (
      timeMode === "start"
    ) {
      updateDay(
        selectedDay,
        {
          start: time,
        }
      );
    } else {
      updateDay(
        selectedDay,
        {
          end: time,
        }
      );
    }
  }

  async function handleSave() {
    if (saving) return;

    const invalidDay =
      days.find(
        (day) => {
          if (!day.enabled) {
            return false;
          }

          const startIndex =
            TIME_OPTIONS.indexOf(
              day.start
            );

          const endIndex =
            TIME_OPTIONS.indexOf(
              day.end
            );

          return (
            startIndex < 0 ||
            endIndex < 0 ||
            startIndex >= endIndex
          );
        }
      );

    if (invalidDay) {
      Alert.alert(
        "Check Availability",
        `${invalidDay.label}'s end time must be later than its start time.`
      );

      return;
    }

    if (
      !acceptImmediate &&
      !acceptScheduled
    ) {
      Alert.alert(
        "Booking Preferences",
        "Enable at least Immediate Bookings or Scheduled Bookings."
      );

      return;
    }

    setSaving(true);

    try {
      const response =
        await panditApiFetch(
          "/api/pandit/availability",
          {
            method: "PATCH",

            body:
              JSON.stringify({
                isOnline,
                acceptsImmediate:
                  acceptImmediate,
                acceptsScheduled:
                  acceptScheduled,
                radiusKm:
                  radius,

                weekly:
                  days.map(
                    (day) => ({
                      dayOfWeek:
                        day.dayOfWeek,

                      startTime:
                        to24Hour(
                          day.start
                        ),

                      endTime:
                        to24Hour(
                          day.end
                        ),

                      isAvailable:
                        day.enabled,
                    })
                  ),
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to save availability."
        );
      }

      setSaved(true);

      Alert.alert(
        "Availability Saved",
        "Your availability settings have been updated."
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

      Alert.alert(
        "Unable to Save",
        message ||
          "Unable to save availability."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PanditShell
        activeTab="profile"
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
            Loading availability...
          </Text>
        </View>
      </PanditShell>
    );
  }

  return (
    <PanditShell
      activeTab="profile"
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
                void loadAvailability(
                  true
                )
              }
            />
          }
        >
          <View
            style={styles.pageHeader}
          >
            <Pressable
              onPress={() =>
                router.back()
              }
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color={Colors.text}
              />
            </Pressable>

            <View
              style={
                styles.pageHeaderText
              }
            >
              <Text
                style={
                  styles.pageTitle
                }
              >
                Availability
              </Text>

              <Text
                style={
                  styles.pageSubtitle
                }
              >
                Manage when you can
                receive bookings
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.onlineCard,
              !isOnline &&
                styles.offlineCard,
            ]}
          >
            <View
              style={
                styles.onlineContent
              }
            >
              <Text
                style={
                  styles.onlineTitle
                }
              >
                {isOnline
                  ? "You are Online"
                  : "You are Offline"}
              </Text>

              <Text
                style={
                  styles.onlineSubtitle
                }
              >
                {isOnline
                  ? "You can receive eligible new booking requests."
                  : "You will not receive immediate online booking requests."}
              </Text>
            </View>

            <Switch
              value={isOnline}
              onValueChange={(
                value
              ) => {
                setIsOnline(
                  value
                );
                setSaved(false);
              }}
              trackColor={{
                false: "#fecaca",
                true: "#86efac",
              }}
              thumbColor={
                isOnline
                  ? Colors.success
                  : Colors.error
              }
            />
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Booking Preferences
          </Text>

          <View style={styles.card}>
            <ToggleRow
              icon="flash-outline"
              title="Immediate Bookings"
              subtitle="Receive requests for urgent poojas when you are online."
              value={
                acceptImmediate
              }
              onValueChange={(
                value
              ) => {
                setAcceptImmediate(
                  value
                );
                setSaved(false);
              }}
            />

            <View
              style={styles.divider}
            />

            <ToggleRow
              icon="calendar-outline"
              title="Scheduled Bookings"
              subtitle="Receive advance booking requests for future dates."
              value={
                acceptScheduled
              }
              onValueChange={(
                value
              ) => {
                setAcceptScheduled(
                  value
                );
                setSaved(false);
              }}
            />
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Weekly Availability
          </Text>

          <Text
            style={
              styles.sectionDescription
            }
          >
            Select the days you can
            accept DivyaArpan bookings.
          </Text>

          <View style={styles.card}>
            {days.map(
              (
                day,
                index
              ) => (
                <View key={day.key}>
                  <View
                    style={
                      styles.dayRow
                    }
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        day.enabled &&
                          styles.dayCircleActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayCircleText,
                          day.enabled &&
                            styles.dayCircleTextActive,
                        ]}
                      >
                        {
                          day.shortLabel
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        styles.dayContent
                      }
                    >
                      <Text
                        style={
                          styles.dayName
                        }
                      >
                        {day.label}
                      </Text>

                      <Text
                        style={
                          styles.dayStatus
                        }
                      >
                        {day.enabled
                          ? `${day.start} – ${day.end}`
                          : "Not available"}
                      </Text>
                    </View>

                    <Switch
                      value={
                        day.enabled
                      }
                      onValueChange={(
                        value
                      ) => {
                        updateDay(
                          day.key,
                          {
                            enabled:
                              value,
                          }
                        );

                        setSelectedDay(
                          day.key
                        );
                      }}
                      trackColor={{
                        false:
                          Colors.borderStrong,
                        true:
                          "#86efac",
                      }}
                      thumbColor={
                        day.enabled
                          ? Colors.success
                          : "#f4f4f5"
                      }
                    />
                  </View>

                  {index <
                    days.length -
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

          <Text
            style={
              styles.sectionTitle
            }
          >
            Daily Timing
          </Text>

          <Text
            style={
              styles.sectionDescription
            }
          >
            Set booking hours for each
            available day.
          </Text>

          <View style={styles.card}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.daySelector
              }
            >
              {days.map(
                (day) => (
                  <Pressable
                    key={
                      day.key
                    }
                    onPress={() =>
                      setSelectedDay(
                        day.key
                      )
                    }
                    style={[
                      styles.daySelectorItem,
                      selectedDay ===
                        day.key &&
                        styles.daySelectorItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.daySelectorText,
                        selectedDay ===
                          day.key &&
                          styles.daySelectorTextActive,
                      ]}
                    >
                      {
                        day.shortLabel
                      }
                    </Text>
                  </Pressable>
                )
              )}
            </ScrollView>

            {!selectedDayData.enabled ? (
              <View
                style={
                  styles.unavailableBox
                }
              >
                <Text
                  style={
                    styles.unavailableText
                  }
                >
                  {
                    selectedDayData.label
                  }{" "}
                  is disabled.
                </Text>
              </View>
            ) : (
              <>
                <View
                  style={
                    styles.timeModeRow
                  }
                >
                  <Pressable
                    onPress={() =>
                      setTimeMode(
                        "start"
                      )
                    }
                    style={[
                      styles.timeModeButton,
                      timeMode ===
                        "start" &&
                        styles.timeModeButtonActive,
                    ]}
                  >
                    <Text
                      style={
                        styles.timeModeLabel
                      }
                    >
                      Start Time
                    </Text>

                    <Text
                      style={
                        styles.timeModeValue
                      }
                    >
                      {
                        selectedDayData.start
                      }
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      setTimeMode(
                        "end"
                      )
                    }
                    style={[
                      styles.timeModeButton,
                      timeMode ===
                        "end" &&
                        styles.timeModeButtonActive,
                    ]}
                  >
                    <Text
                      style={
                        styles.timeModeLabel
                      }
                    >
                      End Time
                    </Text>

                    <Text
                      style={
                        styles.timeModeValue
                      }
                    >
                      {
                        selectedDayData.end
                      }
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={styles.timeGrid}
                >
                  {TIME_OPTIONS.map(
                    (time) => (
                      <Pressable
                        key={time}
                        onPress={() =>
                          handleTimeChange(
                            time
                          )
                        }
                        style={[
                          styles.timeChip,
                          selectedTime ===
                            time &&
                            styles.timeChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timeChipText,
                            selectedTime ===
                              time &&
                              styles.timeChipTextActive,
                          ]}
                        >
                          {time}
                        </Text>
                      </Pressable>
                    )
                  )}
                </View>
              </>
            )}
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Service Radius
          </Text>

          <Text
            style={
              styles.sectionDescription
            }
          >
            Choose how far you are
            willing to travel.
          </Text>

          <View style={styles.card}>
            <Text
              style={
                styles.radiusTitle
              }
            >
              Current radius: {radius} km
            </Text>

            <View
              style={
                styles.radiusOptions
              }
            >
              {RADIUS_OPTIONS.map(
                (option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setRadius(
                        option
                      );
                      setSaved(false);
                    }}
                    style={[
                      styles.radiusChip,
                      radius ===
                        option &&
                        styles.radiusChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.radiusText,
                        radius ===
                          option &&
                          styles.radiusTextActive,
                      ]}
                    >
                      {option} km
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>

          {saved && (
            <View
              style={
                styles.savedCard
              }
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={
                  Colors.success
                }
              />

              <Text
                style={
                  styles.savedText
                }
              >
                Current settings are
                saved.
              </Text>
            </View>
          )}

          <Pressable
            disabled={saving}
            onPress={() =>
              void handleSave()
            }
            style={[
              styles.saveButton,
              saving &&
                styles.disabledButton,
            ]}
          >
            {saving ? (
              <ActivityIndicator
                size="small"
                color="#fff"
              />
            ) : (
              <>
                <Ionicons
                  name="save-outline"
                  size={19}
                  color="#fff"
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  Save Availability
                </Text>
              </>
            )}
          </Pressable>

          {panditId && (
            <Text
              style={styles.footerText}
            >
              Settings linked to your
              verified Pandit profile.
            </Text>
          )}

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    padding: Spacing.lg,
  },

  loadingContainer: {
    minHeight: 520,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 13,
    color:
      Colors.textSecondary,
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:
      Spacing.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  pageHeaderText: {
    flex: 1,
    marginLeft: 8,
  },

  pageTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: Colors.text,
  },

  pageSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color:
      Colors.textSecondary,
  },

  onlineCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius:
      Radius.lg,
    backgroundColor:
      "#F3FBF5",
    marginBottom:
      Spacing.xl,
  },

  offlineCard: {
    backgroundColor:
      "#FFF5F5",
  },

  onlineContent: {
    flex: 1,
    paddingRight: 12,
  },

  onlineTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
  },

  onlineSubtitle: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color:
      Colors.textSecondary,
  },

  sectionTitle: {
    marginTop:
      Spacing.lg,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },

  sectionDescription: {
    marginBottom:
      Spacing.md,
    fontSize: 12,
    lineHeight: 17,
    color:
      Colors.textSecondary,
  },

  card: {
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius:
      Radius.lg,
    backgroundColor:
      Colors.surface,
    overflow: "hidden",
  },

  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },

  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      Colors.background,
  },

  preferenceContent: {
    flex: 1,
    marginHorizontal: 11,
  },

  preferenceTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
  },

  preferenceSubtitle: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color:
      Colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor:
      Colors.border,
  },

  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },

  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      Colors.background,
  },

  dayCircleActive: {
    backgroundColor:
      Colors.primarySoft,
  },

  dayCircleText: {
    fontSize: 11,
    fontWeight: "800",
    color:
      Colors.textMuted,
  },

  dayCircleTextActive: {
    color:
      Colors.primaryDark,
  },

  dayContent: {
    flex: 1,
    marginLeft: 11,
  },

  dayName: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
  },

  dayStatus: {
    marginTop: 3,
    fontSize: 11,
    color:
      Colors.textSecondary,
  },

  daySelector: {
    gap: 7,
    padding: Spacing.md,
  },

  daySelectorItem: {
    minWidth: 48,
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 999,
    backgroundColor:
      Colors.background,
  },

  daySelectorItemActive: {
    backgroundColor:
      Colors.primary,
  },

  daySelectorText: {
    fontSize: 11,
    fontWeight: "800",
    color:
      Colors.textSecondary,
  },

  daySelectorTextActive: {
    color: "#fff",
  },

  unavailableBox: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius:
      Radius.md,
    backgroundColor:
      "#FFF9ED",
  },

  unavailableText: {
    fontSize: 12,
    color:
      Colors.textSecondary,
  },

  timeModeRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal:
      Spacing.md,
    paddingBottom:
      Spacing.md,
  },

  timeModeButton: {
    flex: 1,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius:
      Radius.md,
  },

  timeModeButtonActive: {
    borderColor:
      Colors.primary,
    backgroundColor:
      Colors.primarySoft,
  },

  timeModeLabel: {
    fontSize: 10,
    color:
      Colors.textSecondary,
  },

  timeModeValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    color: Colors.text,
  },

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    padding:
      Spacing.md,
    paddingTop: 0,
  },

  timeChip: {
    minWidth: "30%",
    paddingVertical: 9,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius:
      Radius.md,
  },

  timeChipActive: {
    borderColor:
      Colors.primary,
    backgroundColor:
      Colors.primary,
  },

  timeChipText: {
    fontSize: 10,
    fontWeight: "700",
    color:
      Colors.textSecondary,
  },

  timeChipTextActive: {
    color: "#fff",
  },

  radiusTitle: {
    padding:
      Spacing.md,
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
  },

  radiusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding:
      Spacing.md,
    paddingTop: 0,
  },

  radiusChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius: 999,
  },

  radiusChipActive: {
    borderColor:
      Colors.primary,
    backgroundColor:
      Colors.primary,
  },

  radiusText: {
    fontSize: 11,
    fontWeight: "800",
    color:
      Colors.textSecondary,
  },

  radiusTextActive: {
    color: "#fff",
  },

  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop:
      Spacing.lg,
    padding: 11,
    borderRadius:
      Radius.md,
    backgroundColor:
      "#F3FBF5",
  },

  savedText: {
    fontSize: 12,
    fontWeight: "700",
    color:
      Colors.success,
  },

  saveButton: {
    minHeight: 52,
    marginTop:
      Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius:
      Radius.md,
    backgroundColor:
      Colors.primary,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },

  disabledButton: {
    opacity: 0.5,
  },

  footerText: {
    marginTop: 11,
    textAlign: "center",
    fontSize: 10,
    color:
      Colors.textMuted,
  },
});
