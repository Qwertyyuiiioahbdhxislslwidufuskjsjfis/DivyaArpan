import {
  Ionicons,
} from "@expo/vector-icons";
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
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import PanditShell from "@/components/pandit/PanditShell";
import {
  Colors,
  Radius,
  Spacing,
} from "@/constants/theme";
import {
  logoutPandit,
  panditApiFetch,
} from "@/lib/api";

type Language = {
  language: string;
};

type Service = {
  serviceName: string;
};

type ServiceArea = {
  id: number;
  city: string;
  area: string;
  pincode: string | null;
  serviceRadiusKm:
    | number
    | null;
};

type PanditProfile = {
  id: number;
  panditCode: string;
  name: string;
  mobile: string;
  email: string | null;
  profileImage:
    | string
    | null;
  experienceYears: number;
  bio: string | null;
  address: string | null;
  city: string;
  state: string;
  pincode: string | null;
  verificationStatus: string;
  isActive: boolean;
  isOnline: boolean;
  acceptsImmediate: boolean;
  acceptsScheduled: boolean;
  rating: number;
  totalRatings: number;
  totalBookings: number;
  createdAt: string;
  languages: Language[];
  services: Service[];
  serviceAreas: ServiceArea[];
};

type ProfileResponse = {
  pandit?: PanditProfile;
  unreadNotifications?: number;
  message?: string;
};

type EditForm = {
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bio: string;
  experienceYears: string;
};

function InfoRow({
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
      style={styles.infoRow}
    >
      <View
        style={styles.infoIcon}
      >
        <Ionicons
          name={icon}
          size={19}
          color={
            Colors.primary
          }
        />
      </View>

      <View
        style={
          styles.infoContent
        }
      >
        <Text
          style={
            styles.infoLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.infoValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
}: {
  icon:
    keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        pressed &&
          styles.pressed,
      ]}
    >
      <View
        style={[
          styles.settingIcon,
          danger &&
            styles.settingIconDanger,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={
            danger
              ? Colors.error
              : Colors.primary
          }
        />
      </View>

      <View
        style={
          styles.settingContent
        }
      >
        <Text
          style={[
            styles.settingTitle,
            danger &&
              styles.settingTitleDanger,
          ]}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={
              styles.settingSubtitle
            }
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={
          Colors.textMuted
        }
      />
    </Pressable>
  );
}

function Divider() {
  return (
    <View
      style={styles.divider}
    />
  );
}

function initials(
  name: string
) {
  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length === 0
  ) {
    return "P";
  }

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 1)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();
}

function verificationLabel(
  status: string
) {
  if (
    status === "VERIFIED"
  ) {
    return "Verified";
  }

  if (
    status === "REJECTED"
  ) {
    return "Rejected";
  }

  return "Pending";
}

export default function ProfileScreen() {
  const [
    profile,
    setProfile,
  ] =
    useState<PanditProfile | null>(
      null
    );

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    editVisible,
    setEditVisible,
  ] = useState(false);

  const [
    form,
    setForm,
  ] =
    useState<EditForm>({
      name: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      bio: "",
      experienceYears:
        "0",
    });

  const loadProfile =
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
              "/api/pandit/profile"
            );

          const data =
            (await response.json()) as
              ProfileResponse;

          if (
            !response.ok ||
            !data.pandit
          ) {
            throw new Error(
              data.message ||
                "Unable to load profile."
            );
          }

          setProfile(
            data.pandit
          );

          setNotificationCount(
            Number(
              data.unreadNotifications ??
                0
            )
          );
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to load profile.";

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
          setRefreshing(false);
        }
      },
      []
    );

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile])
  );

  function openEdit() {
    if (!profile) return;

    setForm({
      name:
        profile.name,
      mobile:
        profile.mobile,
      address:
        profile.address ??
        "",
      city:
        profile.city,
      state:
        profile.state,
      pincode:
        profile.pincode ??
        "",
      bio:
        profile.bio ?? "",
      experienceYears:
        String(
          profile.experienceYears
        ),
    });

    setEditVisible(true);
  }

  function updateForm(
    key: keyof EditForm,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  }

  async function saveProfile() {
    if (saving) return;

    const experienceYears =
      Number(
        form.experienceYears
      );

    if (
      form.name.trim().length <
        2 ||
      !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(
        form.mobile.trim()
      ) ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !/^\d{6}$/.test(
        form.pincode.trim()
      ) ||
      !Number.isInteger(
        experienceYears
      ) ||
      experienceYears < 0 ||
      experienceYears > 80
    ) {
      Alert.alert(
        "Check Details",
        "Enter a valid name, Indian mobile number, address, city, state, 6-digit pincode and experience."
      );

      return;
    }

    setSaving(true);

    try {
      const response =
        await panditApiFetch(
          "/api/pandit/profile",
          {
            method: "PATCH",

            body:
              JSON.stringify({
                action:
                  "basic-profile",

                name:
                  form.name.trim(),

                mobile:
                  form.mobile.trim(),

                address:
                  form.address.trim(),

                city:
                  form.city.trim(),

                state:
                  form.state.trim(),

                pincode:
                  form.pincode.trim(),

                bio:
                  form.bio.trim(),

                experienceYears,
              }),
          }
        );

      const data =
        (await response.json()) as
          ProfileResponse;

      if (
        !response.ok ||
        !data.pandit
      ) {
        throw new Error(
          data.message ||
            "Unable to update profile."
        );
      }

      setProfile(
        data.pandit
      );

      setNotificationCount(
        Number(
          data.unreadNotifications ??
            notificationCount
        )
      );

      setEditVisible(false);

      Alert.alert(
        "Profile Updated",
        "Your profile details have been saved."
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update profile.";

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
        message
      );
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Logout",
          style:
            "destructive",

          onPress:
            async () => {
              await logoutPandit();
              router.replace("/");
            },
        },
      ]
    );
  }

  const partnerSince =
    profile?.createdAt
      ? new Date(
          profile.createdAt
        ).getFullYear()
      : null;

  const ratingText =
    profile
      ? profile.totalRatings >
        0
        ? `${profile.rating.toFixed(
            1
          )} · ${profile.totalRatings.toLocaleString(
            "en-IN"
          )} rating${
            profile.totalRatings ===
            1
              ? ""
              : "s"
          }`
        : "No ratings yet"
      : "";

  return (
    <PanditShell
      activeTab="profile"
      notificationCount={
        notificationCount
      }
      onTabPress={(tab) => {
        if (tab === "home") {
          router.replace(
            "/dashboard"
          );
        }

        if (
          tab === "requests"
        ) {
          router.replace(
            "/requests"
          );
        }

        if (
          tab === "bookings"
        ) {
          router.replace(
            "/bookings"
          );
        }

        if (
          tab ===
          "notifications"
        ) {
          router.replace(
            "/notifications"
          );
        }

        if (
          tab === "profile"
        ) {
          router.replace(
            "/profile"
          );
        }
      }}
    >
      <SafeAreaView
        style={
          styles.safeArea
        }
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
                void loadProfile(
                  true
                )
              }
            />
          }
        >
          {loading &&
          !profile ? (
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
                Loading profile...
              </Text>
            </View>
          ) : error &&
            !profile ? (
            <View
              style={
                styles.errorCard
              }
            >
              <Ionicons
                name="alert-circle-outline"
                size={26}
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
                  void loadProfile()
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
                  Retry
                </Text>
              </Pressable>
            </View>
          ) : profile ? (
            <>
              <View
                style={
                  styles.profileCard
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
                    {initials(
                      profile.name
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.profileIdentity
                  }
                >
                  <View
                    style={
                      styles.nameRow
                    }
                  >
                    <Text
                      style={
                        styles.name
                      }
                    >
                      {
                        profile.name
                      }
                    </Text>

                    <View
                      style={
                        styles.verifiedBadge
                      }
                    >
                      <Ionicons
                        name={
                          profile.verificationStatus ===
                          "VERIFIED"
                            ? "checkmark-circle"
                            : "time-outline"
                        }
                        size={15}
                        color={
                          profile.verificationStatus ===
                          "VERIFIED"
                            ? Colors.success
                            : Colors.primary
                        }
                      />

                      <Text
                        style={
                          styles.verifiedText
                        }
                      >
                        {verificationLabel(
                          profile.verificationStatus
                        )}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={
                      styles.partnerId
                    }
                  >
                    {
                      profile.panditCode
                    }
                  </Text>

                  <View
                    style={
                      styles.onlineRow
                    }
                  >
                    <View
                      style={[
                        styles.onlineDot,
                        !profile.isOnline &&
                          styles.offlineDot,
                      ]}
                    />

                    <Text
                      style={[
                        styles.onlineText,
                        !profile.isOnline &&
                          styles.offlineText,
                      ]}
                    >
                      {profile.isOnline
                        ? "Online & Available"
                        : "Currently Offline"}
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={
                    openEdit
                  }
                  style={
                    styles.editButton
                  }
                >
                  <Ionicons
                    name="create-outline"
                    size={19}
                    color={
                      Colors.primaryDark
                    }
                  />
                </Pressable>
              </View>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Professional
                Information
              </Text>

              <View
                style={
                  styles.card
                }
              >
                <InfoRow
                  icon="briefcase-outline"
                  label="Experience"
                  value={`${profile.experienceYears} Year${
                    profile.experienceYears ===
                    1
                      ? ""
                      : "s"
                  }`}
                />

                <Divider />

                <InfoRow
                  icon="star-outline"
                  label="Rating"
                  value={
                    ratingText
                  }
                />

                <Divider />

                <InfoRow
                  icon="location-outline"
                  label="Primary Location"
                  value={`${profile.city}, ${profile.state}`}
                />

                <Divider />

                <InfoRow
                  icon="calendar-outline"
                  label="Partner Since"
                  value={
                    partnerSince
                      ? String(
                          partnerSince
                        )
                      : "—"
                  }
                />

                <Divider />

                <InfoRow
                  icon="call-outline"
                  label="Mobile"
                  value={
                    profile.mobile
                  }
                />

                {profile.email ? (
                  <>
                    <Divider />

                    <InfoRow
                      icon="mail-outline"
                      label="Email"
                      value={
                        profile.email
                      }
                    />
                  </>
                ) : null}
              </View>

              {profile.bio ? (
                <>
                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    About
                  </Text>

                  <View
                    style={
                      styles.card
                    }
                  >
                    <Text
                      style={
                        styles.bioText
                      }
                    >
                      {
                        profile.bio
                      }
                    </Text>
                  </View>
                </>
              ) : null}

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Pooja Services
              </Text>

              <View
                style={
                  styles.card
                }
              >
                {profile.services
                  .length > 0 ? (
                  <View
                    style={
                      styles.chipContainer
                    }
                  >
                    {profile.services.map(
                      (
                        service
                      ) => (
                        <View
                          key={
                            service.serviceName
                          }
                          style={
                            styles.chip
                          }
                        >
                          <Text
                            style={
                              styles.chipText
                            }
                          >
                            {
                              service.serviceName
                            }
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                ) : (
                  <Text
                    style={
                      styles.emptyText
                    }
                  >
                    No services
                    configured.
                  </Text>
                )}
              </View>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Languages
              </Text>

              <View
                style={
                  styles.card
                }
              >
                {profile.languages
                  .length > 0 ? (
                  <View
                    style={
                      styles.chipContainer
                    }
                  >
                    {profile.languages.map(
                      (
                        language
                      ) => (
                        <View
                          key={
                            language.language
                          }
                          style={
                            styles.languageChip
                          }
                        >
                          <Ionicons
                            name="language-outline"
                            size={
                              15
                            }
                            color={
                              Colors.primaryDark
                            }
                          />

                          <Text
                            style={
                              styles.languageText
                            }
                          >
                            {
                              language.language
                            }
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                ) : (
                  <Text
                    style={
                      styles.emptyText
                    }
                  >
                    No languages
                    configured.
                  </Text>
                )}
              </View>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Service Areas
              </Text>

              <View
                style={
                  styles.card
                }
              >
                {profile.serviceAreas
                  .length > 0 ? (
                  <View
                    style={
                      styles.chipContainer
                    }
                  >
                    {profile.serviceAreas.map(
                      (area) => (
                        <View
                          key={
                            area.id
                          }
                          style={
                            styles.areaChip
                          }
                        >
                          <Ionicons
                            name="location-outline"
                            size={
                              14
                            }
                            color={
                              Colors.primary
                            }
                          />

                          <Text
                            style={
                              styles.areaText
                            }
                          >
                            {area.area},{" "}
                            {
                              area.city
                            }
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                ) : (
                  <Text
                    style={
                      styles.emptyText
                    }
                  >
                    No service areas
                    configured.
                  </Text>
                )}
              </View>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Verification
              </Text>

              <View
                style={
                  styles.verificationCard
                }
              >
                <View
                  style={
                    styles.verificationIcon
                  }
                >
                  <Ionicons
                    name={
                      profile.verificationStatus ===
                      "VERIFIED"
                        ? "shield-checkmark"
                        : "shield-outline"
                    }
                    size={24}
                    color={
                      profile.verificationStatus ===
                      "VERIFIED"
                        ? Colors.success
                        : Colors.primary
                    }
                  />
                </View>

                <View
                  style={
                    styles.verificationContent
                  }
                >
                  <Text
                    style={
                      styles.verificationTitle
                    }
                  >
                    {profile.verificationStatus ===
                    "VERIFIED"
                      ? "Verified Partner"
                      : profile.verificationStatus ===
                          "REJECTED"
                        ? "Verification Rejected"
                        : "Verification Pending"}
                  </Text>

                  <Text
                    style={
                      styles.verificationText
                    }
                  >
                    {profile.verificationStatus ===
                    "VERIFIED"
                      ? "Your profile and required documents have been verified by DivyaArpan."
                      : profile.verificationStatus ===
                          "REJECTED"
                        ? "Your verification requires attention. Please contact DivyaArpan support."
                        : "Your profile and documents are currently under verification."}
                  </Text>
                </View>
              </View>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Account & Settings
              </Text>

              <View
                style={
                  styles.card
                }
              >
                <SettingRow
                  icon="create-outline"
                  title="Edit Profile"
                  subtitle="Update your professional and contact details"
                  onPress={
                    openEdit
                  }
                />

                <Divider />

                <SettingRow
                  icon="radio-outline"
                  title="Availability"
                  subtitle="Manage your online availability"
                  onPress={() =>
                    router.push(
                      "/availability"
                    )
                  }
                />

                <Divider />

                <SettingRow
                  icon="notifications-outline"
                  title="Notifications"
                  subtitle="View booking and partner alerts"
                  onPress={() =>
                    router.push(
                      "/notifications"
                    )
                  }
                />

                <Divider />

                <SettingRow
                  icon="lock-closed-outline"
                  title="Change Password"
                  subtitle="Update your account password"
                  onPress={() =>
                    router.push(
                      "/change-password"
                    )
                  }
                />

                <Divider />

                <SettingRow
                  icon="help-circle-outline"
                  title="Help & Support"
                  subtitle="Get assistance from DivyaArpan"
                  onPress={() =>
                    router.push(
                      "/help-support"
                    )
                  }
                />

                <Divider />

                <SettingRow
                  icon="document-text-outline"
                  title="Terms & Policies"
                  subtitle="View partner terms and policies"
                  onPress={() =>
                    router.push(
                      "/terms-policies"
                    )
                  }
                />

                <Divider />

                <SettingRow
                  icon="log-out-outline"
                  title="Logout"
                  onPress={
                    handleLogout
                  }
                  danger
                />
              </View>

              <View
                style={
                  styles.footer
                }
              >
                <Text
                  style={
                    styles.footerText
                  }
                >
                  DivyaArpan Partner
                  App
                </Text>

                <Text
                  style={
                    styles.version
                  }
                >
                  Version 1.0.0
                </Text>
              </View>
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={editVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          !saving &&
          setEditVisible(false)
        }
      >
        <View
          style={
            styles.modalBackdrop
          }
        >
          <View
            style={
              styles.modalCard
            }
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <Text
                style={
                  styles.modalTitle
                }
              >
                Edit Profile
              </Text>

              <Pressable
                disabled={
                  saving
                }
                onPress={() =>
                  setEditVisible(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={25}
                  color={
                    Colors.text
                  }
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
              keyboardShouldPersistTaps="handled"
            >
              <Text
                style={
                  styles.fieldLabel
                }
              >
                Full Name
              </Text>

              <TextInput
                value={
                  form.name
                }
                onChangeText={(
                  value
                ) =>
                  updateForm(
                    "name",
                    value
                  )
                }
                style={
                  styles.input
                }
              />

              <Text
                style={
                  styles.fieldLabel
                }
              >
                Mobile Number
              </Text>

              <TextInput
                value={
                  form.mobile
                }
                onChangeText={(
                  value
                ) =>
                  updateForm(
                    "mobile",
                    value
                  )
                }
                keyboardType="phone-pad"
                style={
                  styles.input
                }
              />

              <Text
                style={
                  styles.fieldLabel
                }
              >
                Experience (Years)
              </Text>

              <TextInput
                value={
                  form.experienceYears
                }
                onChangeText={(
                  value
                ) =>
                  updateForm(
                    "experienceYears",
                    value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                keyboardType="number-pad"
                style={
                  styles.input
                }
              />

              <Text
                style={
                  styles.fieldLabel
                }
              >
                Address
              </Text>

              <TextInput
                value={
                  form.address
                }
                onChangeText={(
                  value
                ) =>
                  updateForm(
                    "address",
                    value
                  )
                }
                multiline
                style={[
                  styles.input,
                  styles.multilineInput,
                ]}
              />

              <Text
                style={
                  styles.fieldLabel
                }
              >
                City
              </Text>

              <TextInput
                value={
                  form.city
                }
                onChangeText={(
                  value
                ) =>
                  updateForm(
                    "city",
                    value
                  )
                }
                style={
                  styles.input
                }
              />

              <Text
                style={
                  styles.fieldLabel
                }
              >
                State
              </Text>

              <TextInput
                value={
                  form.state
                }
                onChangeText={(
                  value
                ) =>
                  updateForm(
                    "state",
                    value
                  )
                }
                style={
                  styles.input
                }
              />

              <Text
                style={
                  styles.fieldLabel
                }
              >
                Pincode
              </Text>

              <TextInput
                value={
                  form.pincode
                }
                onChangeText={(
                  value
                ) =>
                  updateForm(
                    "pincode",
                    value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        6
                      )
                  )
                }
                keyboardType="number-pad"
                maxLength={6}
                style={
                  styles.input
                }
              />

              <Text
                style={
                  styles.fieldLabel
                }
              >
                About / Bio
              </Text>

              <TextInput
                value={
                  form.bio
                }
                onChangeText={(
                  value
                ) =>
                  updateForm(
                    "bio",
                    value
                  )
                }
                multiline
                maxLength={
                  2000
                }
                style={[
                  styles.input,
                  styles.bioInput,
                ]}
                placeholder="Tell devotees about your experience and Vedic background"
                placeholderTextColor={
                  Colors.textMuted
                }
              />

              <Pressable
                disabled={
                  saving
                }
                onPress={() =>
                  void saveProfile()
                }
                style={[
                  styles.saveButton,
                  saving &&
                    styles.disabledButton,
                ]}
              >
                {saving ? (
                  <ActivityIndicator
                    color={
                      Colors.white
                    }
                  />
                ) : (
                  <Text
                    style={
                      styles.saveButtonText
                    }
                  >
                    Save Changes
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
      minHeight: 420,
      alignItems: "center",
      justifyContent:
        "center",
      gap: 12,
    },

    loadingText: {
      color:
        Colors.textSecondary,
    },

    errorCard: {
      alignItems: "center",
      padding: Spacing.xl,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    errorText: {
      marginTop: 10,
      textAlign: "center",
      color:
        Colors.textSecondary,
    },

    retryButton: {
      marginTop: 15,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius:
        Radius.pill,
      backgroundColor:
        Colors.primary,
    },

    retryText: {
      fontWeight: "800",
      color: Colors.white,
    },

    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: Spacing.lg,
      backgroundColor:
        Colors.surface,
      borderRadius:
        Radius.xl,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        Colors.primaryDark,
    },

    avatarText: {
      fontSize: 27,
      fontWeight: "800",
      color: Colors.white,
    },

    profileIdentity: {
      flex: 1,
      marginLeft:
        Spacing.lg,
    },

    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 7,
    },

    name: {
      fontSize: 20,
      fontWeight: "800",
      color: Colors.text,
    },

    verifiedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius:
        Radius.pill,
      backgroundColor:
        Colors.successSoft,
    },

    verifiedText: {
      fontSize: 10,
      fontWeight: "800",
      color:
        Colors.success,
    },

    partnerId: {
      marginTop: 5,
      fontSize: 12,
      fontWeight: "600",
      color:
        Colors.textSecondary,
    },

    onlineRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 7,
      gap: 5,
    },

    onlineDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor:
        Colors.success,
    },

    offlineDot: {
      backgroundColor:
        Colors.textMuted,
    },

    onlineText: {
      fontSize: 12,
      fontWeight: "700",
      color:
        Colors.success,
    },

    offlineText: {
      color:
        Colors.textMuted,
    },

    editButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        Colors.primarySoft,
    },

    sectionTitle: {
      marginTop:
        Spacing.xl,
      marginBottom:
        Spacing.md,
      fontSize: 18,
      fontWeight: "800",
      color: Colors.text,
    },

    card: {
      padding: Spacing.lg,
      backgroundColor:
        Colors.surface,
      borderRadius:
        Radius.lg,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 52,
    },

    infoIcon: {
      width: 40,
      height: 40,
      borderRadius:
        Radius.md,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        Colors.primarySoft,
    },

    infoContent: {
      flex: 1,
      marginLeft:
        Spacing.md,
    },

    infoLabel: {
      fontSize: 11,
      color:
        Colors.textMuted,
      fontWeight: "600",
    },

    infoValue: {
      marginTop: 3,
      fontSize: 14,
      color: Colors.text,
      fontWeight: "700",
    },

    divider: {
      height: 1,
      backgroundColor:
        Colors.border,
      marginVertical: 4,
    },

    bioText: {
      fontSize: 13,
      lineHeight: 20,
      color:
        Colors.textSecondary,
    },

    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius:
        Radius.pill,
      backgroundColor:
        Colors.primarySoft,
      borderWidth: 1,
      borderColor:
        "#f5d9a5",
    },

    chipText: {
      fontSize: 12,
      fontWeight: "700",
      color:
        Colors.primaryDark,
    },

    languageChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 11,
      paddingVertical: 8,
      borderRadius:
        Radius.pill,
      backgroundColor:
        Colors.surfaceSoft,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    languageText: {
      fontSize: 12,
      fontWeight: "700",
      color: Colors.text,
    },

    areaChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius:
        Radius.pill,
      backgroundColor:
        Colors.surfaceSoft,
    },

    areaText: {
      fontSize: 12,
      fontWeight: "600",
      color:
        Colors.textSecondary,
    },

    emptyText: {
      fontSize: 12,
      color:
        Colors.textMuted,
    },

    verificationCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: Spacing.lg,
      borderRadius:
        Radius.lg,
      backgroundColor:
        Colors.successSoft,
      borderWidth: 1,
      borderColor:
        "#bbf7d0",
    },

    verificationIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        Colors.white,
    },

    verificationContent: {
      flex: 1,
      marginHorizontal:
        Spacing.md,
    },

    verificationTitle: {
      fontSize: 15,
      fontWeight: "800",
      color:
        Colors.success,
    },

    verificationText: {
      marginTop: 4,
      fontSize: 12,
      lineHeight: 18,
      color:
        Colors.textSecondary,
    },

    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 62,
    },

    settingIcon: {
      width: 40,
      height: 40,
      borderRadius:
        Radius.md,
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        Colors.primarySoft,
    },

    settingIconDanger: {
      backgroundColor:
        Colors.errorSoft,
    },

    settingContent: {
      flex: 1,
      marginLeft:
        Spacing.md,
    },

    settingTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: Colors.text,
    },

    settingTitleDanger: {
      color: Colors.error,
    },

    settingSubtitle: {
      marginTop: 3,
      fontSize: 11,
      color:
        Colors.textMuted,
    },

    pressed: {
      opacity: 0.7,
    },

    footer: {
      alignItems: "center",
      marginTop:
        Spacing.xl,
      paddingVertical:
        Spacing.lg,
    },

    footerText: {
      fontSize: 12,
      fontWeight: "700",
      color:
        Colors.textSecondary,
    },

    version: {
      marginTop: 4,
      fontSize: 11,
      color:
        Colors.textMuted,
    },

    modalBackdrop: {
      flex: 1,
      justifyContent:
        "flex-end",
      backgroundColor:
        "rgba(0,0,0,0.35)",
    },

    modalCard: {
      maxHeight: "92%",
      padding: Spacing.lg,
      paddingBottom: 30,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor:
        Colors.background,
    },

    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom:
        Spacing.lg,
    },

    modalTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: Colors.text,
    },

    fieldLabel: {
      marginTop: 12,
      marginBottom: 6,
      fontSize: 12,
      fontWeight: "700",
      color:
        Colors.textSecondary,
    },

    input: {
      minHeight: 48,
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius:
        Radius.md,
      backgroundColor:
        Colors.surface,
      fontSize: 14,
      color: Colors.text,
    },

    multilineInput: {
      minHeight: 82,
      textAlignVertical:
        "top",
    },

    bioInput: {
      minHeight: 110,
      textAlignVertical:
        "top",
    },

    saveButton: {
      minHeight: 50,
      marginTop: 24,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius:
        Radius.md,
      backgroundColor:
        Colors.primary,
    },

    disabledButton: {
      opacity: 0.6,
    },

    saveButtonText: {
      fontSize: 14,
      fontWeight: "800",
      color: Colors.white,
    },
  });
