import { router } from "expo-router";
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

const API =
  "https://probable-engine-56gj6xwj4w437pg9-3000.app.github.dev";

export default function ForgotLoginIdScreen() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!identifier.trim()) {
      setError("Please enter your registered email ID or mobile number.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API}/api/auth/forgot-login-id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: identifier.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to recover your Login ID."
        );
      }

      setMessage(
        result.message ||
          "If an account matches the provided information, recovery instructions will be sent."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to recover your Login ID."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.page}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.back}>‹</Text>
            </Pressable>

            <View style={styles.logoCircle}>
              <Text style={styles.logo}>ॐ</Text>
            </View>

            <Text style={styles.brand}>DivyaArpan</Text>
            <Text style={styles.portal}>PANDIT PORTAL</Text>

            <View style={styles.content}>
              <Text style={styles.title}>Forgot Login ID?</Text>

              <Text style={styles.subtitle}>
                Enter your registered email ID or mobile number.
                We’ll help you recover your Pandit account details.
              </Text>

              <Text style={styles.label}>
                Registered Email ID or Mobile Number
              </Text>

              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Enter email ID or mobile number"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {message ? (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>{message}</Text>
                </View>
              ) : null}

              <Pressable
                disabled={loading}
                onPress={handleSubmit}
                style={[
                  styles.button,
                  loading && styles.buttonDisabled,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    Recover Login ID →
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => router.replace("/")}
                style={styles.loginLink}
              >
                <Text style={styles.loginLinkText}>
                  ← Back to Login
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFDF8",
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  page: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  back: {
    fontSize: 38,
    color: "#B56A00",
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF1D6",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  logo: {
    fontSize: 38,
    color: "#B56A00",
  },
  brand: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    color: "#963509",
  },
  portal: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "center",
    color: "#B56A00",
  },
  content: {
    marginTop: 48,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#132238",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
    color: "#64748B",
  },
  label: {
    marginBottom: 9,
    fontSize: 15,
    fontWeight: "700",
    color: "#17233B",
  },
  input: {
    height: 64,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#17233B",
  },
  errorBox: {
    marginTop: 16,
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#FFF4F2",
  },
  errorText: {
    color: "#C81E1E",
    lineHeight: 20,
  },
  successBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
  },
  successText: {
    color: "#166534",
    lineHeight: 20,
  },
  button: {
    height: 62,
    marginTop: 24,
    borderRadius: 13,
    backgroundColor: "#B86B00",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  loginLink: {
    marginTop: 25,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#B56A00",
    fontSize: 15,
    fontWeight: "700",
  },
});
