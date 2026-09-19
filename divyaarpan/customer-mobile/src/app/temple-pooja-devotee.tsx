import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { DivyaTheme } from "@/constants/divya-theme";

type BookingFor = "self" | "family";

export default function TemplePoojaDevoteeScreen() {
  const params = useLocalSearchParams<{
    templeId?: string;
    poojaId?: string;
    pooja?: string;
    mode?: string;
    sankalp?: string;
    date?: string;
    time?: string;
  }>();

  const pooja =
    typeof params.pooja === "string"
      ? params.pooja
      : "Rudrabhishek";

  const mode =
    params.mode === "remote"
      ? "remote"
      : "mandir";

  const sankalp =
    typeof params.sankalp === "string"
      ? params.sankalp
      : "";

  const templeId =
    typeof params.templeId === "string"
      ? params.templeId
      : "21";

  const poojaId =
    typeof params.poojaId === "string"
      ? params.poojaId
      : "26";

  const date =
    typeof params.date === "string"
      ? params.date
      : "";

  const time =
    typeof params.time === "string"
      ? params.time
      : "";

  const [bookingFor, setBookingFor] =
    useState<BookingFor>("self");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [gotra, setGotra] = useState("");
  const [participantName, setParticipantName] =
    useState("");

  const normalizedMobile = mobile.replace(/\D/g, "");

  const canContinue = useMemo(() => {
    const validName = name.trim().length >= 2;
    const validMobile =
      /^[6-9]\d{9}$/.test(normalizedMobile);

    const validEmail =
      !email.trim() ||
      /^\S+@\S+\.\S+$/.test(email.trim());

    if (!validEmail) {
      return false;
    }

    if (bookingFor === "family") {
      return (
        validName &&
        validMobile &&
        participantName.trim().length >= 2
      );
    }

    return validName && validMobile;
  }, [
    name,
    normalizedMobile,
    bookingFor,
    participantName,
    email,
  ]);

  const participationLabel =
    mode === "remote"
      ? "Pooja From Home"
      : "Pooja at Mandir";

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <LinearGradient
          colors={["#6F2228", "#4B161B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={19}
                color="#FFF7E8"
              />
            </Pressable>

            <View style={styles.stepPill}>
              <Text style={styles.stepText}>
                STEP 2 OF 3
              </Text>
            </View>
          </View>

          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>
              KASHI VISHWANATH
            </Text>

            <Text style={styles.headerTitle}>
              Devotee details
            </Text>

            <Text style={styles.headerBody}>
              Tell us who this sacred Pooja is
              being offered for.
            </Text>
          </View>

          <View style={styles.summaryPill}>
            <Ionicons
              name={
                mode === "remote"
                  ? "videocam-outline"
                  : "business-outline"
              }
              size={14}
              color="#E9CA86"
            />

            <Text style={styles.summaryPillText}>
              {pooja} · {participationLabel}
            </Text>
          </View>
        </LinearGradient>

        {/* SANKALP SUMMARY */}

        <View style={styles.sankalpSummary}>
          <View style={styles.sankalpSummaryIcon}>
            <Ionicons
              name="flower-outline"
              size={18}
              color={
                DivyaTheme.colors.vermilionDeep
              }
            />
          </View>

          <View style={styles.sankalpSummaryCopy}>
            <Text style={styles.sankalpSummaryLabel}>
              YOUR SANKALP
            </Text>

            <Text
              style={styles.sankalpSummaryText}
              numberOfLines={3}
            >
              {sankalp ||
                "Your prayer intention"}
            </Text>
          </View>

          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="pencil-outline"
              size={16}
              color={
                DivyaTheme.colors.vermilionDeep
              }
            />
          </Pressable>
        </View>

        {/* BOOKING FOR */}

        <View style={styles.section}>
          <Text style={styles.eyebrow}>
            WHO IS THIS POOJA FOR?
          </Text>

          <Text style={styles.sectionTitle}>
            Offer with your loved ones in mind
          </Text>

          <View style={styles.bookingForGrid}>
            <Pressable
              style={[
                styles.bookingForCard,
                bookingFor === "self" &&
                  styles.bookingForCardActive,
              ]}
              onPress={() =>
                setBookingFor("self")
              }
            >
              <View
                style={[
                  styles.bookingForIcon,
                  bookingFor === "self" &&
                    styles.bookingForIconActive,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={
                    bookingFor === "self"
                      ? "#E9CA86"
                      : DivyaTheme.colors
                          .vermilionDeep
                  }
                />
              </View>

              <Text
                style={[
                  styles.bookingForTitle,
                  bookingFor === "self" &&
                    styles.bookingForTitleActive,
                ]}
              >
                For Myself
              </Text>

              <Text
                style={[
                  styles.bookingForText,
                  bookingFor === "self" &&
                    styles.bookingForTextActive,
                ]}
              >
                The Sankalp will be offered
                in your name.
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.bookingForCard,
                bookingFor === "family" &&
                  styles.bookingForCardActive,
              ]}
              onPress={() =>
                setBookingFor("family")
              }
            >
              <View
                style={[
                  styles.bookingForIcon,
                  bookingFor === "family" &&
                    styles.bookingForIconActive,
                ]}
              >
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={
                    bookingFor === "family"
                      ? "#E9CA86"
                      : DivyaTheme.colors
                          .vermilionDeep
                  }
                />
              </View>

              <Text
                style={[
                  styles.bookingForTitle,
                  bookingFor === "family" &&
                    styles.bookingForTitleActive,
                ]}
              >
                For Family
              </Text>

              <Text
                style={[
                  styles.bookingForText,
                  bookingFor === "family" &&
                    styles.bookingForTextActive,
                ]}
              >
                Offer the Pooja for a family
                member or loved one.
              </Text>
            </Pressable>
          </View>
        </View>

        {/* PRIMARY DEVOTEE */}

        <View style={styles.section}>
          <Text style={styles.eyebrow}>
            DEVOTEE INFORMATION
          </Text>

          <Text style={styles.sectionTitle}>
            Your details
          </Text>

          <View style={styles.formCard}>
            <Field
              label="Full name"
              icon="person-outline"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              autoCapitalize="words"
            />

            <View style={styles.fieldDivider} />

            <Field
              label="Mobile number"
              icon="call-outline"
              value={mobile}
              onChangeText={(value) =>
                setMobile(
                  value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
            />

            <View style={styles.fieldDivider} />

            <Field
              label="Email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="Email address (optional)"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.fieldDivider} />

            <Field
              label="Gotra"
              icon="leaf-outline"
              value={gotra}
              onChangeText={setGotra}
              placeholder="Enter Gotra (optional)"
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.gotraNote}>
            If you do not know your Gotra,
            you may leave this blank.
          </Text>
        </View>

        {/* FAMILY MEMBER */}

        {bookingFor === "family" && (
          <View style={styles.section}>
            <Text style={styles.eyebrow}>
              POOJA PARTICIPANT
            </Text>

            <Text style={styles.sectionTitle}>
              Who should receive the Sankalp?
            </Text>

            <View style={styles.participantCard}>
              <View style={styles.participantIcon}>
                <Ionicons
                  name="heart-outline"
                  size={19}
                  color={
                    DivyaTheme.colors
                      .vermilionDeep
                  }
                />
              </View>

              <View style={styles.participantInputWrap}>
                <Text style={styles.fieldLabel}>
                  Devotee / family member name
                </Text>

                <TextInput
                  value={participantName}
                  onChangeText={setParticipantName}
                  placeholder="Enter person's full name"
                  placeholderTextColor="#AE9887"
                  style={styles.participantInput}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>
        )}

        {/* JOURNEY */}

        <View style={styles.journeyCard}>
          <Text style={styles.journeyEyebrow}>
            YOUR POOJA JOURNEY
          </Text>

          <JourneyRow
            number="1"
            title="Sankalp"
            subtitle="Prayer intention saved"
            complete
          />

          <View style={styles.journeyLine} />

          <JourneyRow
            number="2"
            title="Devotee details"
            subtitle="Who the Pooja is being offered for"
            current
          />

          <View style={styles.journeyLine} />

          <JourneyRow
            number="3"
            title="Review & payment"
            subtitle="Confirm before secure payment"
          />
        </View>

        {/* CONTINUE */}

        <Pressable
          disabled={!canContinue}
          style={[
            styles.continueButton,
            !canContinue &&
              styles.continueButtonDisabled,
          ]}
          onPress={() => {
            if (!canContinue) return;

            router.push({
              pathname:
                "/temple-pooja-review" as never,
              params: {
                templeId,
                poojaId,
                pooja,
                mode,
                sankalp,
                date,
                time,
                bookingFor,
                name: name.trim(),
                mobile: normalizedMobile,
                email: email.trim().toLowerCase(),
                gotra: gotra.trim(),
                participantName:
                  bookingFor === "family"
                    ? participantName.trim()
                    : name.trim(),
              },
            });
          }}
        >
          <Text
            style={[
              styles.continueText,
              !canContinue &&
                styles.continueTextDisabled,
            ]}
          >
            Review My Pooja
          </Text>

          <Ionicons
            name="arrow-forward"
            size={17}
            color={
              canContinue
                ? "#5F1B21"
                : "#AA9A8C"
            }
          />
        </Pressable>

        <Text style={styles.assurance}>
          Your personal information is used
          only to fulfil your Pooja journey.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?:
    | "default"
    | "phone-pad"
    | "email-address";
  autoCapitalize?:
    | "none"
    | "words";
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={DivyaTheme.colors.vermilionDeep}
        />
      </View>

      <View style={styles.fieldCopy}>
        <Text style={styles.fieldLabel}>
          {label}
        </Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#AE9887"
          style={styles.fieldInput}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
    </View>
  );
}

function JourneyRow({
  number,
  title,
  subtitle,
  complete = false,
  current = false,
}: {
  number: string;
  title: string;
  subtitle: string;
  complete?: boolean;
  current?: boolean;
}) {
  return (
    <View style={styles.journeyRow}>
      <View
        style={[
          styles.journeyNumber,
          current && styles.journeyNumberCurrent,
        ]}
      >
        {complete ? (
          <Ionicons
            name="checkmark"
            size={13}
            color="#FFFFFF"
          />
        ) : (
          <Text
            style={[
              styles.journeyNumberText,
              current &&
                styles.journeyNumberTextCurrent,
            ]}
          >
            {number}
          </Text>
        )}
      </View>

      <View style={styles.journeyCopy}>
        <Text style={styles.journeyTitle}>
          {title}
        </Text>

        <Text style={styles.journeyText}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF8EE",
  },

  content: {
    paddingBottom: 38,
  },

  header: {
    minHeight: 248,
    paddingHorizontal: 17,
    paddingTop: 19,
    paddingBottom: 20,
    justifyContent: "space-between",
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "rgba(255,245,225,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  stepPill: {
    height: 27,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,245,225,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,245,225,0.14)",
    justifyContent: "center",
  },

  stepText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.6,
    letterSpacing: 1.2,
    color: "#E8C982",
  },

  headerCopy: {
    marginTop: 26,
  },

  headerEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.8,
    letterSpacing: 1.45,
    color: "#E7C47E",
  },

  headerTitle: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 31,
    color: "#FFF7E8",
  },

  headerBody: {
    marginTop: 5,
    maxWidth: 300,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 7,
    lineHeight: 10,
    color: "rgba(255,247,232,0.63)",
  },

  summaryPill: {
    marginTop: 18,
    alignSelf: "flex-start",
    minHeight: 31,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,245,225,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  summaryPillText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 6.5,
    color: "#F0DBAE",
  },

  sankalpSummary: {
    marginHorizontal: 14,
    marginTop: 17,
    minHeight: 84,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#F4E7D4",
    flexDirection: "row",
    alignItems: "center",
  },

  sankalpSummaryIcon: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#FFF8EC",
    alignItems: "center",
    justifyContent: "center",
  },

  sankalpSummaryCopy: {
    flex: 1,
    marginHorizontal: 10,
  },

  sankalpSummaryLabel: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.5,
    letterSpacing: 1.2,
    color: "#9D6A31",
  },

  sankalpSummaryText: {
    marginTop: 3,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 7,
    lineHeight: 10,
    color: DivyaTheme.colors.ink,
  },

  section: {
    paddingHorizontal: 14,
    paddingTop: 27,
  },

  eyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.8,
    letterSpacing: 1.4,
    color: "#A37235",
  },

  sectionTitle: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 23,
    lineHeight: 25,
    color: DivyaTheme.colors.ink,
  },

  bookingForGrid: {
    marginTop: 12,
    flexDirection: "row",
    gap: 9,
  },

  bookingForCard: {
    flex: 1,
    minHeight: 147,
    padding: 13,
    borderRadius: 19,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E8D6BD",
  },

  bookingForCardActive: {
    backgroundColor: "#611E24",
    borderColor: "#611E24",
  },

  bookingForIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3E4CF",
    alignItems: "center",
    justifyContent: "center",
  },

  bookingForIconActive: {
    backgroundColor: "rgba(238,205,143,0.10)",
  },

  bookingForTitle: {
    marginTop: 12,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 17,
    color: DivyaTheme.colors.ink,
  },

  bookingForTitleActive: {
    color: "#FFF4E2",
  },

  bookingForText: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 6.2,
    lineHeight: 9,
    color: DivyaTheme.colors.muted,
  },

  bookingForTextActive: {
    color: "rgba(255,244,226,0.60)",
  },

  formCard: {
    marginTop: 12,
    borderRadius: 19,
    paddingHorizontal: 13,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E8D6BD",
  },

  field: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
  },

  fieldIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: "#F4E6D2",
    alignItems: "center",
    justifyContent: "center",
  },

  fieldCopy: {
    flex: 1,
    marginLeft: 10,
  },

  fieldLabel: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 6.4,
    color: "#7E654D",
  },

  fieldInput: {
    marginTop: 2,
    paddingVertical: 4,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    color: DivyaTheme.colors.ink,
  },

  fieldDivider: {
    marginLeft: 47,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#EADBC7",
  },

  gotraNote: {
    marginTop: 7,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 6.3,
    color: DivyaTheme.colors.muted,
  },

  participantCard: {
    marginTop: 12,
    minHeight: 82,
    paddingHorizontal: 13,
    borderRadius: 18,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E8D6BD",
    flexDirection: "row",
    alignItems: "center",
  },

  participantIcon: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#F4E6D2",
    alignItems: "center",
    justifyContent: "center",
  },

  participantInputWrap: {
    flex: 1,
    marginLeft: 10,
  },

  participantInput: {
    marginTop: 2,
    paddingVertical: 4,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    color: DivyaTheme.colors.ink,
  },

  journeyCard: {
    marginHorizontal: 14,
    marginTop: 27,
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#F3E7D5",
  },

  journeyEyebrow: {
    marginBottom: 12,
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.7,
    letterSpacing: 1.35,
    color: "#98652E",
  },

  journeyRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
  },

  journeyNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#B99252",
    alignItems: "center",
    justifyContent: "center",
  },

  journeyNumberCurrent: {
    backgroundColor: "#642027",
  },

  journeyNumberText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 7,
    color: "#FFFFFF",
  },

  journeyNumberTextCurrent: {
    color: "#F0D08E",
  },

  journeyCopy: {
    flex: 1,
    marginLeft: 10,
  },

  journeyTitle: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 15,
    color: DivyaTheme.colors.ink,
  },

  journeyText: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 6.2,
    color: DivyaTheme.colors.muted,
  },

  journeyLine: {
    width: 1,
    height: 13,
    marginLeft: 14,
    backgroundColor: "#D7C1A3",
  },

  continueButton: {
    marginHorizontal: 14,
    marginTop: 22,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#E9C982",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  continueButtonDisabled: {
    backgroundColor: "#E8DED0",
  },

  continueText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 8,
    color: "#5F1B21",
  },

  continueTextDisabled: {
    color: "#AA9A8C",
  },

  assurance: {
    marginTop: 11,
    paddingHorizontal: 20,
    textAlign: "center",
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 6.2,
    color: DivyaTheme.colors.muted,
  },
});
