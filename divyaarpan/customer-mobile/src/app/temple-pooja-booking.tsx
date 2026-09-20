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
import { Image } from "expo-image";

import { DivyaTheme } from "@/constants/divya-theme";

const kashi = require(
  "../../assets/signature/temples/kashi-vishwanath.jpg"
);

type PoojaMode = "mandir" | "remote";

const KASHI_TEMPLE_ID = 21;

const KASHI_POOJA_IDS: Record<string, number> = {
  Rudrabhishek: 26,
  "Mangala Aarti": 27,
  "Shiv Archana": 28,
};

const TIME_SLOTS = [
  {
    value: "06:00",
    label: "6:00 AM",
    period: "Brahma Muhurta",
  },
  {
    value: "07:30",
    label: "7:30 AM",
    period: "Morning",
  },
  {
    value: "09:00",
    label: "9:00 AM",
    period: "Morning",
  },
  {
    value: "11:00",
    label: "11:00 AM",
    period: "Before Noon",
  },
] as const;

function toLocalDateValue(date: Date) {
  const local = new Date(
    date.getTime() -
      date.getTimezoneOffset() * 60_000
  );

  return local.toISOString().slice(0, 10);
}

function getDateChoices() {
  const today = new Date();

  return Array.from({ length: 4 }, (_, index) => {
    const value = new Date(today);

    value.setDate(today.getDate() + index);

    return {
      value: toLocalDateValue(value),
      weekday: value.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      day: value.toLocaleDateString("en-IN", {
        day: "2-digit",
      }),
      month: value.toLocaleDateString("en-IN", {
        month: "short",
      }),
      relative:
        index === 0
          ? "Today"
          : index === 1
            ? "Tomorrow"
            : "",
    };
  });
}

export default function TemplePoojaBookingScreen() {
  const params = useLocalSearchParams<{
    pooja?: string;
  }>();

  const poojaName =
    typeof params.pooja === "string"
      ? params.pooja
      : "Rudrabhishek";

  const selectedPoojaId =
    KASHI_POOJA_IDS[poojaName] ??
    KASHI_POOJA_IDS.Rudrabhishek;

  const dateChoices = useMemo(
    () => getDateChoices(),
    []
  );

  const [mode, setMode] =
    useState<PoojaMode>("mandir");

  const [sankalp, setSankalp] = useState("");

  const [date, setDate] = useState(
    dateChoices[1]?.value ??
      dateChoices[0]?.value ??
      ""
  );

  const [time, setTime] = useState("07:30");

  const canContinue =
    sankalp.trim().length >= 3 &&
    Boolean(date) &&
    Boolean(time);

  const participationTitle =
    mode === "mandir"
      ? "You will be present at the Mandir"
      : "The Pooja will be offered on your behalf";

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
        {/* CINEMATIC HERO */}

        <View style={styles.hero}>
          <Image
            source={kashi}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />

          <LinearGradient
            colors={[
              "rgba(22,8,8,0.08)",
              "rgba(34,10,12,0.30)",
              "rgba(52,13,18,0.94)",
            ]}
            locations={[0, 0.42, 1]}
            style={styles.heroOverlay}
          >
            <View style={styles.heroTop}>
              <Pressable
                style={styles.glassButton}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color="#FFF8E8"
                />
              </Pressable>

              <View style={styles.stepPill}>
                <View style={styles.stepDot} />

                <Text style={styles.stepText}>
                  SANKALP · 1 OF 3
                </Text>
              </View>
            </View>

            <View style={styles.heroBottom}>
              <View style={styles.templeBadge}>
                <Text style={styles.templeBadgeOm}>
                  ॐ
                </Text>

                <Text style={styles.templeBadgeText}>
                  JYOTIRLINGA
                </Text>
              </View>

              <Text style={styles.heroEyebrow}>
                SHRI KASHI VISHWANATH
              </Text>

              <Text style={styles.heroTitle}>
                {poojaName}
              </Text>

              <View style={styles.heroMeta}>
                <View style={styles.heroMetaItem}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color="#E9CF9B"
                  />

                  <Text style={styles.heroMetaText}>
                    Varanasi
                  </Text>
                </View>

                <View style={styles.heroMetaDivider} />

                <View style={styles.heroMetaItem}>
                  <Ionicons
                    name="sparkles-outline"
                    size={14}
                    color="#E9CF9B"
                  />

                  <Text style={styles.heroMetaText}>
                    Sacred Temple Pooja
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* SACRED OPENING */}

        <View style={styles.opening}>
          <View style={styles.sacredLine}>
            <View style={styles.sacredRule} />

            <Text style={styles.sacredOm}>
              ॐ
            </Text>

            <View style={styles.sacredRule} />
          </View>

          <Text style={styles.openingTitle}>
            Begin your sacred Sankalp
          </Text>

          <Text style={styles.openingText}>
            Every Pooja begins with an intention.
            Choose how you wish to participate and
            offer your prayer with श्रद्धा.
          </Text>
        </View>

        {/* PARTICIPATION */}

        <View style={styles.section}>
          <Text style={styles.eyebrow}>
            YOUR POOJA EXPERIENCE
          </Text>

          <Text style={styles.sectionTitle}>
            How would you like to participate?
          </Text>

          <View style={styles.modeStack}>
            <Pressable
              onPress={() => setMode("mandir")}
              style={[
                styles.modeCard,
                mode === "mandir" &&
                  styles.modeCardActive,
              ]}
            >
              {mode === "mandir" && (
                <LinearGradient
                  colors={["#77242C", "#51171D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}

              <View
                style={[
                  styles.modeIcon,
                  mode === "mandir" &&
                    styles.modeIconActive,
                ]}
              >
                <Ionicons
                  name="business-outline"
                  size={23}
                  color={
                    mode === "mandir"
                      ? "#F1D18E"
                      : "#7A2824"
                  }
                />
              </View>

              <View style={styles.modeCopy}>
                <View style={styles.modeTitleRow}>
                  <Text
                    style={[
                      styles.modeTitle,
                      mode === "mandir" &&
                        styles.modeTitleActive,
                    ]}
                  >
                    At Mandir
                  </Text>

                  <View
                    style={[
                      styles.selectionCircle,
                      mode === "mandir" &&
                        styles.selectionCircleActive,
                    ]}
                  >
                    {mode === "mandir" && (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color="#5B1A20"
                      />
                    )}
                  </View>
                </View>

                <Text
                  style={[
                    styles.modeDescription,
                    mode === "mandir" &&
                      styles.modeDescriptionActive,
                  ]}
                >
                  Be present at Kashi Vishwanath
                  while your Sankalp is offered.
                </Text>

                <Text
                  style={[
                    styles.modeDetail,
                    mode === "mandir" &&
                      styles.modeDetailActive,
                  ]}
                >
                  Mandir darshan · Pooja · Sankalp
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setMode("remote")}
              style={[
                styles.modeCard,
                mode === "remote" &&
                  styles.modeCardActive,
              ]}
            >
              {mode === "remote" && (
                <LinearGradient
                  colors={["#77242C", "#51171D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}

              <View
                style={[
                  styles.modeIcon,
                  mode === "remote" &&
                    styles.modeIconActive,
                ]}
              >
                <Ionicons
                  name="home-outline"
                  size={23}
                  color={
                    mode === "remote"
                      ? "#F1D18E"
                      : "#7A2824"
                  }
                />
              </View>

              <View style={styles.modeCopy}>
                <View style={styles.modeTitleRow}>
                  <Text
                    style={[
                      styles.modeTitle,
                      mode === "remote" &&
                        styles.modeTitleActive,
                    ]}
                  >
                    From Home
                  </Text>

                  <View
                    style={[
                      styles.selectionCircle,
                      mode === "remote" &&
                        styles.selectionCircleActive,
                    ]}
                  >
                    {mode === "remote" && (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color="#5B1A20"
                      />
                    )}
                  </View>
                </View>

                <Text
                  style={[
                    styles.modeDescription,
                    mode === "remote" &&
                      styles.modeDescriptionActive,
                  ]}
                >
                  Your Pooja is performed at the
                  Mandir with your name and Sankalp.
                </Text>

                <Text
                  style={[
                    styles.modeDetail,
                    mode === "remote" &&
                      styles.modeDetailActive,
                  ]}
                >
                  Remote participation · Sacred seva
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.selectedExperience}>
            <Ionicons
              name="checkmark-circle"
              size={17}
              color="#8A5B2C"
            />

            <Text style={styles.selectedExperienceText}>
              {participationTitle}
            </Text>
          </View>
        </View>

        {/* SANKALP */}

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <View>
              <Text style={styles.eyebrow}>
                YOUR SANKALP
              </Text>

              <Text style={styles.sectionTitle}>
                What is your Sankalp?
              </Text>
            </View>

            <Text style={styles.devanagariAccent}>
              संकल्प
            </Text>
          </View>

          <Text style={styles.sectionDescription}>
            Your Sankalp will remain connected to
            this Pooja throughout the sacred journey.
          </Text>

          <View style={styles.sankalpCard}>
            <View style={styles.sankalpHeader}>
              <View style={styles.lotusIcon}>
                <Ionicons
                  name="flower-outline"
                  size={20}
                  color="#7B2826"
                />
              </View>

              <View style={styles.sankalpHeaderCopy}>
                <Text style={styles.sankalpLabel}>
                  Sankalp
                </Text>

                <Text style={styles.sankalpHint}>
                  Offered with your name during the Pooja
                </Text>
              </View>
            </View>

            <View style={styles.sankalpInputShell}>
              <TextInput
                value={sankalp}
                onChangeText={setSankalp}
                editable={true}
                multiline={true}
                maxLength={300}
                placeholder="Write your Sankalp here..."
                placeholderTextColor="#9A867B"
                selectionColor="#76252A"
                cursorColor="#76252A"
                style={styles.sankalpInput}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.sankalpFooter}>
              <View style={styles.privateRow}>
                <Ionicons
                  name="lock-closed-outline"
                  size={12}
                  color="#94713A"
                />

                <Text style={styles.privateText}>
                  Private & respectfully handled
                </Text>
              </View>

              <Text style={styles.characterCount}>
                {sankalp.length}/300
              </Text>
            </View>
          </View>
        </View>

        {/* DATE */}

        <View style={styles.section}>
          <Text style={styles.eyebrow}>
            SACRED DATE
          </Text>

          <Text style={styles.sectionTitle}>
            Choose your Pooja day
          </Text>

          <Text style={styles.sectionDescription}>
            Select a convenient day for your
            {mode === "mandir"
              ? " Mandir visit."
              : " Pooja offering."}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateRow}
          >
            {dateChoices.map((item) => {
              const selected =
                item.value === date;

              return (
                <Pressable
                  key={item.value}
                  onPress={() =>
                    setDate(item.value)
                  }
                  style={[
                    styles.dateCard,
                    selected &&
                      styles.dateCardActive,
                  ]}
                >
                  {!!item.relative && (
                    <Text
                      style={[
                        styles.dateRelative,
                        selected &&
                          styles.dateRelativeActive,
                      ]}
                    >
                      {item.relative}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.dateWeekday,
                      selected &&
                        styles.dateTextActive,
                    ]}
                  >
                    {item.weekday}
                  </Text>

                  <Text
                    style={[
                      styles.dateDay,
                      selected &&
                        styles.dateTextActive,
                    ]}
                  >
                    {item.day}
                  </Text>

                  <Text
                    style={[
                      styles.dateMonth,
                      selected &&
                        styles.dateTextActive,
                    ]}
                  >
                    {item.month}
                  </Text>

                  {selected && (
                    <View style={styles.dateSelectedDot} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* TIME */}

        <View style={styles.section}>
          <View style={styles.timeHeading}>
            <View>
              <Text style={styles.eyebrow}>
                PREFERRED TIME
              </Text>

              <Text style={styles.sectionTitle}>
                Select a sacred time
              </Text>
            </View>

            <View style={styles.sunBadge}>
              <Ionicons
                name="sunny-outline"
                size={19}
                color="#966B31"
              />
            </View>
          </View>

          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((slot) => {
              const selected =
                slot.value === time;

              return (
                <Pressable
                  key={slot.value}
                  onPress={() =>
                    setTime(slot.value)
                  }
                  style={[
                    styles.timeCard,
                    selected &&
                      styles.timeCardActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeValue,
                      selected &&
                        styles.timeValueActive,
                    ]}
                  >
                    {slot.label}
                  </Text>

                  <Text
                    style={[
                      styles.timePeriod,
                      selected &&
                        styles.timePeriodActive,
                    ]}
                  >
                    {slot.period}
                  </Text>

                  {selected && (
                    <View style={styles.timeCheck}>
                      <Ionicons
                        name="checkmark"
                        size={11}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.scheduleAssurance}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#8D6A42"
            />

            <Text style={styles.scheduleAssuranceText}>
              Final temple timing is confirmed before
              payment.
            </Text>
          </View>
        </View>

        {/* JOURNEY */}

        <View style={styles.journeySection}>
          <LinearGradient
            colors={["#F5E7D1", "#EFE0C9"]}
            style={styles.journeyCard}
          >
            <View style={styles.journeyTop}>
              <View>
                <Text style={styles.journeyEyebrow}>
                  YOUR SACRED JOURNEY
                </Text>

                <Text style={styles.journeyTitle}>
                  Three simple steps
                </Text>
              </View>

              <Text style={styles.journeyOm}>
                ॐ
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressActive} />
            </View>

            <View style={styles.journeySteps}>
              <JourneyStep
                number="1"
                title="Sankalp"
                detail="Prayer & participation"
                active
              />

              <JourneyStep
                number="2"
                title="Devotee"
                detail="Your sacred details"
              />

              <JourneyStep
                number="3"
                title="Review"
                detail="Confirm & payment"
              />
            </View>
          </LinearGradient>
        </View>

        {/* CTA */}

        <View style={styles.ctaArea}>
          <Pressable
            disabled={!canContinue}
            onPress={() => {
              if (!canContinue) return;

              router.push({
                pathname:
                  "/temple-pooja-devotee" as never,
                params: {
                  templeId: String(
                    KASHI_TEMPLE_ID
                  ),
                  poojaId: String(
                    selectedPoojaId
                  ),
                  pooja: poojaName,
                  mode,
                  sankalp: sankalp.trim(),
                  date,
                  time,
                },
              });
            }}
            style={({ pressed }) => [
              styles.ctaPressable,
              pressed &&
                canContinue &&
                styles.ctaPressed,
            ]}
          >
            <LinearGradient
              colors={
                canContinue
                  ? ["#D8B66D", "#B98D46"]
                  : ["#E6DED2", "#D8CFC3"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaButton}
            >
              <View style={styles.ctaTextWrap}>
                <Text
                  style={[
                    styles.ctaEyebrow,
                    !canContinue &&
                      styles.ctaDisabledText,
                  ]}
                >
                  CONTINUE YOUR POOJA
                </Text>

                <Text
                  style={[
                    styles.ctaText,
                    !canContinue &&
                      styles.ctaDisabledText,
                  ]}
                >
                  Add Devotee Details
                </Text>
              </View>

              <View
                style={[
                  styles.ctaArrow,
                  !canContinue &&
                    styles.ctaArrowDisabled,
                ]}
              >
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={
                    canContinue
                      ? "#FFF8E9"
                      : "#9E948A"
                  }
                />
              </View>
            </LinearGradient>
          </Pressable>

          {!canContinue && (
            <Text style={styles.ctaHelper}>
              Add your Sankalp to continue
            </Text>
          )}

          <View style={styles.trustRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color="#8B704D"
            />

            <Text style={styles.trustText}>
              Your Sankalp and personal details remain
              protected.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function JourneyStep({
  number,
  title,
  detail,
  active = false,
}: {
  number: string;
  title: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <View style={styles.journeyStep}>
      <View
        style={[
          styles.journeyNumber,
          active &&
            styles.journeyNumberActive,
        ]}
      >
        {active ? (
          <Ionicons
            name="checkmark"
            size={13}
            color="#FFF9EB"
          />
        ) : (
          <Text style={styles.journeyNumberText}>
            {number}
          </Text>
        )}
      </View>

      <Text style={styles.journeyStepTitle}>
        {title}
      </Text>

      <Text style={styles.journeyStepDetail}>
        {detail}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FBF5EC",
  },

  content: {
    paddingBottom: 44,
  },

  hero: {
    height: 340,
    overflow: "hidden",
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    backgroundColor: "#321114",
    ...DivyaTheme.shadow.card,
  },

  heroOverlay: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 26,
    justifyContent: "space-between",
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  glassButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(28,8,10,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,244,220,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },

  stepPill: {
    minHeight: 31,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "rgba(28,8,10,0.36)",
    borderWidth: 1,
    borderColor: "rgba(238,207,151,0.24)",
    flexDirection: "row",
    alignItems: "center",
  },

  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E6C67D",
    marginRight: 7,
  },

  stepText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: "#F0D69C",
  },

  heroBottom: {
    maxWidth: 390,
  },

  templeBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    height: 27,
    borderRadius: 14,
    backgroundColor: "rgba(92,28,32,0.72)",
    borderWidth: 1,
    borderColor: "rgba(239,208,148,0.24)",
    marginBottom: 10,
  },

  templeBadgeOm: {
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 15,
    color: "#EBCB88",
    marginRight: 6,
  },

  templeBadgeText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 8,
    letterSpacing: 1.3,
    color: "#F0D69C",
  },

  heroEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.8,
    color: "#E9C77E",
  },

  heroTitle: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -0.5,
    color: "#FFF8EA",
  },

  heroMeta: {
    marginTop: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  heroMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroMetaText: {
    marginLeft: 5,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 11,
    color: "#F4DFB6",
  },

  heroMetaDivider: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(244,223,182,0.35)",
    marginHorizontal: 11,
  },

  opening: {
    paddingTop: 30,
    paddingHorizontal: 26,
    alignItems: "center",
  },

  sacredLine: {
    flexDirection: "row",
    alignItems: "center",
  },

  sacredRule: {
    width: 42,
    height: 1,
    backgroundColor: "#D9BC82",
  },

  sacredOm: {
    marginHorizontal: 12,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 25,
    color: "#9C6C32",
  },

  openingTitle: {
    marginTop: 7,
    textAlign: "center",
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 31,
    lineHeight: 34,
    color: DivyaTheme.colors.ink,
  },

  openingText: {
    marginTop: 8,
    maxWidth: 365,
    textAlign: "center",
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 12,
    lineHeight: 19,
    color: "#776762",
  },

  section: {
    paddingHorizontal: 18,
    paddingTop: 34,
  },

  eyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.8,
    color: "#9A6D34",
  },

  sectionTitle: {
    marginTop: 6,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 27,
    lineHeight: 30,
    color: DivyaTheme.colors.ink,
  },

  sectionDescription: {
    marginTop: 7,
    maxWidth: 370,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 12,
    lineHeight: 19,
    color: "#786963",
  },

  modeStack: {
    marginTop: 16,
    gap: 11,
  },

  modeCard: {
    minHeight: 126,
    borderRadius: 22,
    overflow: "hidden",
    padding: 16,
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: "#E7D6BF",
    flexDirection: "row",
    ...DivyaTheme.shadow.whisper,
  },

  modeCardActive: {
    borderColor: "#682027",
  },

  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5E7D5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  modeIconActive: {
    backgroundColor: "rgba(241,209,142,0.12)",
    borderWidth: 1,
    borderColor: "rgba(241,209,142,0.18)",
  },

  modeCopy: {
    flex: 1,
  },

  modeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  modeTitle: {
    flex: 1,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 21,
    color: DivyaTheme.colors.ink,
  },

  modeTitleActive: {
    color: "#FFF7E7",
  },

  selectionCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CFB89B",
    alignItems: "center",
    justifyContent: "center",
  },

  selectionCircleActive: {
    backgroundColor: "#E9CA85",
    borderColor: "#E9CA85",
  },

  modeDescription: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 11,
    lineHeight: 17,
    color: "#75665F",
  },

  modeDescriptionActive: {
    color: "rgba(255,247,231,0.76)",
  },

  modeDetail: {
    marginTop: 8,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 9,
    color: "#966F46",
  },

  modeDetailActive: {
    color: "#E4C98F",
  },

  selectedExperience: {
    marginTop: 11,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F4E7D4",
    flexDirection: "row",
    alignItems: "center",
  },

  selectedExperienceText: {
    marginLeft: 8,
    flex: 1,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 15,
    color: "#765938",
  },

  sectionHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  devanagariAccent: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 19,
    color: "#B48A53",
    opacity: 0.72,
  },

  sankalpCard: {
    marginTop: 16,
    borderRadius: 24,
    padding: 16,
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: "#E4D1B7",
    ...DivyaTheme.shadow.soft,
  },

  sankalpHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  lotusIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#F2E0C9",
    alignItems: "center",
    justifyContent: "center",
  },

  sankalpHeaderCopy: {
    marginLeft: 11,
    flex: 1,
  },

  sankalpLabel: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 12,
    color: DivyaTheme.colors.ink,
  },

  sankalpHint: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 9,
    color: "#8B7770",
  },

  sankalpInputShell: {
    marginTop: 16,
    minHeight: 132,
    borderRadius: 17,
    backgroundColor: "#F8EEE0",
    borderWidth: 1,
    borderColor: "#EDDDC8",
    overflow: "visible",
  },

  sankalpInput: {
    width: "100%",
    minHeight: 130,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 0,
    backgroundColor: "transparent",
    fontSize: 14,
    lineHeight: 21,
    color: "#2F1B17",
  },

  sankalpFooter: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  privateRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  privateText: {
    marginLeft: 5,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    color: "#927552",
  },

  characterCount: {
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    color: "#9D8878",
  },

  dateRow: {
    paddingTop: 16,
    paddingRight: 18,
    gap: 9,
  },

  dateCard: {
    width: 88,
    minHeight: 116,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: "#E4D4BF",
    alignItems: "center",
    justifyContent: "center",
  },

  dateCardActive: {
    backgroundColor: "#6A2027",
    borderColor: "#6A2027",
    ...DivyaTheme.shadow.soft,
  },

  dateRelative: {
    minHeight: 14,
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 8,
    color: "#9B6D38",
  },

  dateRelativeActive: {
    color: "#EACD91",
  },

  dateWeekday: {
    marginTop: 3,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 10,
    color: "#826E65",
  },

  dateDay: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 30,
    lineHeight: 31,
    color: DivyaTheme.colors.ink,
  },

  dateMonth: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 9,
    textTransform: "uppercase",
    color: "#927E72",
  },

  dateTextActive: {
    color: "#FFF6E5",
  },

  dateSelectedDot: {
    marginTop: 7,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E9CA85",
  },

  timeHeading: {
    flexDirection: "row",
    alignItems: "center",
  },

  sunBadge: {
    marginLeft: "auto",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3E4CD",
    alignItems: "center",
    justifyContent: "center",
  },

  timeGrid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  timeCard: {
    width: "48.5%",
    minHeight: 76,
    padding: 13,
    borderRadius: 18,
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: "#E4D4BF",
    justifyContent: "center",
    position: "relative",
  },

  timeCardActive: {
    backgroundColor: "#F3E3C9",
    borderColor: "#C99E58",
  },

  timeValue: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 13,
    color: DivyaTheme.colors.ink,
  },

  timeValueActive: {
    color: "#6E2724",
  },

  timePeriod: {
    marginTop: 3,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 9,
    color: "#8A7770",
  },

  timePeriodActive: {
    color: "#8B673D",
  },

  timeCheck: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#76252A",
    alignItems: "center",
    justifyContent: "center",
  },

  scheduleAssurance: {
    marginTop: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  scheduleAssuranceText: {
    marginLeft: 7,
    flex: 1,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 14,
    color: "#806D62",
  },

  journeySection: {
    paddingHorizontal: 18,
    paddingTop: 36,
  },

  journeyCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E0C9A7",
  },

  journeyTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  journeyEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 8,
    letterSpacing: 1.6,
    color: "#93652F",
  },

  journeyTitle: {
    marginTop: 3,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 22,
    color: DivyaTheme.colors.ink,
  },

  journeyOm: {
    marginLeft: "auto",
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 30,
    color: "#A87B3F",
    opacity: 0.75,
  },

  progressTrack: {
    height: 3,
    marginTop: 15,
    borderRadius: 2,
    backgroundColor: "rgba(111,74,37,0.13)",
    overflow: "hidden",
  },

  progressActive: {
    width: "33.333%",
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#A16D35",
  },

  journeySteps: {
    marginTop: 17,
    flexDirection: "row",
  },

  journeyStep: {
    flex: 1,
    alignItems: "center",
  },

  journeyNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF9EF",
    borderWidth: 1,
    borderColor: "#DBC6A9",
    alignItems: "center",
    justifyContent: "center",
  },

  journeyNumberActive: {
    backgroundColor: "#76242A",
    borderColor: "#76242A",
  },

  journeyNumberText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 9,
    color: "#7E6041",
  },

  journeyStepTitle: {
    marginTop: 7,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 10,
    color: DivyaTheme.colors.ink,
  },

  journeyStepDetail: {
    marginTop: 2,
    paddingHorizontal: 3,
    textAlign: "center",
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 8,
    lineHeight: 12,
    color: "#84736A",
  },

  ctaArea: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },

  ctaPressable: {
    borderRadius: 21,
    overflow: "hidden",
    ...DivyaTheme.shadow.soft,
  },

  ctaPressed: {
    opacity: 0.92,
  },

  ctaButton: {
    minHeight: 70,
    borderRadius: 21,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  ctaTextWrap: {
    flex: 1,
  },

  ctaEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 8,
    letterSpacing: 1.4,
    color: "#6B421E",
  },

  ctaText: {
    marginTop: 3,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 21,
    color: "#4D2319",
  },

  ctaDisabledText: {
    color: "#91867C",
  },

  ctaArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6C2523",
    alignItems: "center",
    justifyContent: "center",
  },

  ctaArrowDisabled: {
    backgroundColor: "#CDC3B8",
  },

  ctaHelper: {
    marginTop: 8,
    textAlign: "center",
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    color: "#8D7D73",
  },

  trustRow: {
    marginTop: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  trustText: {
    marginLeft: 6,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    color: "#83736B",
  },
});
