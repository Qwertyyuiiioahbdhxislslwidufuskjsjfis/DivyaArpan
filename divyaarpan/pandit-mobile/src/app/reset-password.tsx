import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API =
  "https://probable-engine-56gj6xwj4w437pg9-3000.app.github.dev";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();

  const token =
    typeof params.token === "string"
      ? params.token
      : "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!token) {
      setError("Password reset token is missing or invalid.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to reset password."
        );
      }

      setSuccess(
        result.message ||
          "Your password has been reset successfully."
      );

      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.logoCircle}>
          <Text style={styles.om}>ॐ</Text>
        </View>

        <Text style={styles.brand}>DivyaArpan</Text>
        <Text style={styles.portal}>PANDIT PORTAL</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>

          <Text style={styles.subtitle}>
            Create a new password for your Pandit account.
          </Text>

          {!token ? (
            <View style={styles.messageBox}>
              <Text style={styles.errorText}>
                This password reset request is invalid or missing.
                Please start again from Forgot Password.
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>New Password</Text>

          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              placeholderTextColor="#9A8B76"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={styles.passwordInput}
              editable={!loading}
            />

            <Pressable
              onPress={() =>
                setShowPassword((current) => !current)
              }
              style={styles.eyeButton}
            >
              <Text style={styles.eyeText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.hint}>
            Minimum 8 characters
          </Text>

          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.passwordRow}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter new password"
              placeholderTextColor="#9A8B76"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              style={styles.passwordInput}
              editable={!loading}
            />

            <Pressable
              onPress={() =>
                setShowConfirmPassword((current) => !current)
              }
              style={styles.eyeButton}
            >
              <Text style={styles.eyeText}>
                {showConfirmPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                {success}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleReset}
            disabled={loading || !token}
            style={({ pressed }) => [
              styles.primaryButton,
              (pressed || loading || !token) &&
                styles.pressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.primaryButtonText}>
                Reset Password →
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.replace("/")}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Back to Login
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Authorized Pandit Partner Access
        </Text>
        <Text style={styles.footerSmall}>
          DivyaArpan Partner App
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: "#FFFDF8",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },

  container: {
    width: "100%",
    maxWidth: 700,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 12,
    marginBottom: 16,
  },

  backText: {
    color: "#9A6D13",
    fontSize: 15,
    fontWeight: "600",
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F7E8C3",
    borderWidth: 1,
    borderColor: "#D8B56A",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  om: {
    fontSize: 38,
    color: "#B67A0A",
    fontWeight: "700",
  },

  brand: {
    marginTop: 12,
    textAlign: "center",
    color: "#6E4910",
    fontSize: 27,
    fontWeight: "700",
  },

  portal: {
    textAlign: "center",
    color: "#A67C31",
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EADCBF",
    borderRadius: 22,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  title: {
    textAlign: "center",
    color: "#4F3817",
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    textAlign: "center",
    color: "#81715F",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },

  label: {
    color: "#55442F",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 14,
  },

  passwordRow: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#DCCFB8",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFDF9",
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#392C1F",
    fontSize: 15,
    outlineStyle: "none" as any,
  },

  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  eyeText: {
    color: "#A36F13",
    fontWeight: "600",
    fontSize: 13,
  },

  hint: {
    color: "#9A8B76",
    fontSize: 12,
    marginTop: 6,
  },

  primaryButton: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: "#C9952E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.65,
  },

  errorBox: {
    backgroundColor: "#FFF1F0",
    borderWidth: 1,
    borderColor: "#F1C7C3",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },

  errorText: {
    color: "#B13A32",
    fontSize: 13,
    lineHeight: 19,
  },

  messageBox: {
    backgroundColor: "#FFF8E7",
    borderWidth: 1,
    borderColor: "#E7D19C",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  successBox: {
    backgroundColor: "#EEF8EF",
    borderWidth: 1,
    borderColor: "#B7D8BA",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },

  successText: {
    color: "#356B3B",
    fontSize: 13,
    lineHeight: 19,
  },

  loginLink: {
    alignItems: "center",
    paddingVertical: 15,
  },

  loginText: {
    color: "#9A6D13",
    fontWeight: "600",
    fontSize: 14,
  },

  footer: {
    marginTop: 26,
    textAlign: "center",
    color: "#9A8B76",
    fontSize: 12,
  },

  footerSmall: {
    marginTop: 3,
    textAlign: "center",
    color: "#B0A28E",
    fontSize: 11,
  },
});
