import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import PanditShell from "@/components/pandit/PanditShell";
import { Colors, Radius, Spacing } from "@/constants/theme";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
};

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasMinimumLength = newPassword.length >= 8;

  const isDifferentPassword =
    newPassword.length > 0 &&
    currentPassword.length > 0 &&
    newPassword !== currentPassword;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const canSubmit =
    currentPassword.length > 0 &&
    hasMinimumLength &&
    isDifferentPassword &&
    passwordsMatch &&
    !loading;

  const handleChangePassword = async () => {
    setError("");
    setSaved(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please complete all password fields.");
      return;
    }

    if (!hasMinimumLength) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (!isDifferentPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    if (!passwordsMatch) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);

    // UI-only for now.
    // Real password update API will be connected later.
    await new Promise((resolve) => setTimeout(resolve, 900));

    setLoading(false);
setSaved(true);

setCurrentPassword("");
setNewPassword("");
setConfirmPassword("");

setShowCurrent(false);
setShowNew(false);
setShowConfirm(false);
  };

  return (
    <PanditShell
      activeTab="profile"
      notificationCount={2}
      onTabPress={(tab) => {
        if (tab === "home") router.replace("/dashboard");
        if (tab === "requests") router.replace("/requests");
        if (tab === "bookings") router.replace("/bookings");
        if (tab === "notifications") router.replace("/notifications");
        if (tab === "profile") router.replace("/profile");
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
                <Text style={styles.title}>Change Password</Text>
                <Text style={styles.subtitle}>
                  Update your DivyaArpan partner account password
                </Text>
              </View>
            </View>

            {/* Security Information */}
            <View style={styles.securityCard}>
              <View style={styles.securityIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={25}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.securityText}>
                <Text style={styles.securityTitle}>
                  Keep your account secure
                </Text>

                <Text style={styles.securityDescription}>
                  Use a strong password that you do not use on other accounts.
                </Text>
              </View>
            </View>

            {/* Password Form */}
            <View style={styles.card}>
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChangeText={(value) => {
                  setCurrentPassword(value);
                  setError("");
                  setSaved(false);
                }}
                visible={showCurrent}
                onToggle={() => setShowCurrent((value) => !value)}
                placeholder="Enter current password"
              />

              <PasswordField
                label="New Password"
                value={newPassword}
                onChangeText={(value) => {
                  setNewPassword(value);
                  setError("");
                  setSaved(false);
                }}
                visible={showNew}
                onToggle={() => setShowNew((value) => !value)}
                placeholder="Enter new password"
              />

              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  setError("");
                  setSaved(false);
                }}
                visible={showConfirm}
                onToggle={() => setShowConfirm((value) => !value)}
                placeholder="Re-enter new password"
              />

              {/* Requirements */}
              <View style={styles.requirements}>
                <Text style={styles.requirementsTitle}>
                  Password requirements
                </Text>

                <Requirement
                  valid={hasMinimumLength}
                  text="At least 8 characters"
                />

                <Requirement
                  valid={isDifferentPassword}
                  text="Different from your current password"
                />

                <Requirement
                  valid={passwordsMatch}
                  text="New password and confirmation match"
                />
              </View>

              {/* Error */}
              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={19}
                    color={Colors.error}
                  />

                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Success */}
              {saved ? (
                <View style={styles.successBox}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.success}
                  />

                  <View style={styles.successTextContainer}>
                    <Text style={styles.successTitle}>
  Password change request saved
</Text>

<Text style={styles.successText}>
  Your new password details are ready. The actual account update
  will be connected when we integrate the DivyaArpan API.
</Text>
                  </View>
                </View>
              ) : null}

              {/* Change Password Button */}
              <Pressable
                disabled={!canSubmit}
                onPress={handleChangePassword}
                style={({ pressed }) => [
                  styles.saveButton,
                  !canSubmit && styles.saveButtonDisabled,
                  pressed && canSubmit && styles.saveButtonPressed,
                ]}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.white}
                  />
                ) : (
                  <>
                    <Ionicons
                      name="lock-closed-outline"
                      size={19}
                      color={Colors.white}
                    />

                    <Text style={styles.saveButtonText}>
                      Change Password
                    </Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* Security Reminder */}
            <View style={styles.infoCard}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={Colors.primary}
              />

              <Text style={styles.infoText}>
                Never share your DivyaArpan login credentials with anyone.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PanditShell>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  onToggle,
  placeholder,
}: PasswordFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        <Pressable
          onPress={onToggle}
          style={styles.eyeButton}
          accessibilityRole="button"
          accessibilityLabel={visible ? `Hide ${label}` : `Show ${label}`}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={21}
            color={Colors.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

function Requirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <View style={styles.requirementRow}>
      <Ionicons
        name={valid ? "checkmark-circle" : "ellipse-outline"}
        size={17}
        color={valid ? Colors.success : Colors.textMuted}
      />

      <Text
        style={[
          styles.requirementText,
          valid && styles.requirementTextValid,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
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
    opacity: 0.75,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  securityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: "#f5d7a0",
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  securityText: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  securityDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },

  field: {
    marginBottom: Spacing.lg,
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 7,
  },

  inputWrapper: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.text,
  },

  eyeButton: {
    width: 46,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  requirements: {
    backgroundColor: Colors.surfaceSoft,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },

  requirementsTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  requirementText: {
    marginLeft: 7,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  requirementTextValid: {
    color: Colors.success,
    fontWeight: "600",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.errorSoft,
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },

  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.error,
    fontWeight: "600",
  },

  successBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.successSoft,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },

  successTextContainer: {
    flex: 1,
    marginLeft: 8,
  },

  successTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.success,
  },

  successText: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textSecondary,
  },

  saveButton: {
    minHeight: 50,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  saveButtonDisabled: {
    opacity: 0.45,
  },

  saveButtonPressed: {
    opacity: 0.85,
  },

  saveButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "800",
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },

  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
});