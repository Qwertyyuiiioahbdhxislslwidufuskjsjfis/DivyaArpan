import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { DivyaTheme } from "@/constants/divya-theme";
import {
  createTemplePoojaBooking,
  type TemplePoojaBooking,
} from "@/lib/api";

export default function TemplePoojaReviewScreen() {
  const params = useLocalSearchParams<{
    templeId?: string;
    poojaId?: string;
    pooja?: string;
    mode?: string;
    sankalp?: string;
    date?: string;
    time?: string;
    bookingFor?: string;
    name?: string;
    mobile?: string;
    email?: string;
    gotra?: string;
    participantName?: string;
  }>();

  const templeId =
    typeof params.templeId === "string"
      ? Number(params.templeId)
      : 21;

  const poojaId =
    typeof params.poojaId === "string"
      ? Number(params.poojaId)
      : 26;

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

  const date =
    typeof params.date === "string"
      ? params.date
      : "";

  const time =
    typeof params.time === "string"
      ? params.time
      : "";

  const bookingFor =
    params.bookingFor === "family"
      ? "family"
      : "self";

  const name =
    typeof params.name === "string"
      ? params.name
      : "";

  const mobile =
    typeof params.mobile === "string"
      ? params.mobile
      : "";

  const email =
    typeof params.email === "string"
      ? params.email
      : "";

  const gotra =
    typeof params.gotra === "string"
      ? params.gotra
      : "";

  const participantName =
    typeof params.participantName === "string"
      ? params.participantName
      : name;

  const participationLabel =
    mode === "remote"
      ? "Pooja From Home"
      : "Pooja at Mandir";

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [createdBooking, setCreatedBooking] =
    useState<TemplePoojaBooking | null>(null);

  const createBooking = async () => {
    if (submitting || createdBooking) {
      return;
    }

    if (
      !Number.isInteger(templeId) ||
      templeId <= 0 ||
      !Number.isInteger(poojaId) ||
      poojaId <= 0
    ) {
      setSubmitError(
        "The selected Mandir or Pooja is invalid."
      );
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const booking =
        await createTemplePoojaBooking({
          templeId,
          poojaId,
          poojaMode:
            mode === "remote"
              ? "ON_BEHALF"
              : "DEVOTEE_PRESENT",
          name,
          mobile,
          email,
          date,
          time,
          devotees:
            bookingFor === "family"
              ? 2
              : 1,
          sankalp,
        });

      setCreatedBooking(booking);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to create your Pooja booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <LinearGradient
          colors={["#6B2027", "#491519"]}
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
                STEP 3 OF 3
              </Text>
            </View>
          </View>

          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>
              KASHI VISHWANATH
            </Text>

            <Text style={styles.headerTitle}>
              Review your Pooja
            </Text>

            <Text style={styles.headerBody}>
              Confirm the sacred details before
              proceeding to payment.
            </Text>
          </View>

          <View style={styles.poojaPill}>
            <Ionicons
              name="flame-outline"
              size={14}
              color="#E9CA86"
            />

            <Text style={styles.poojaPillText}>
              {pooja}
            </Text>
          </View>
        </LinearGradient>

        {/* SACRED SUMMARY */}

        <View style={styles.summaryHero}>
          <View style={styles.summaryOm}>
            <Text style={styles.omText}>ॐ</Text>
          </View>

          <View style={styles.summaryHeroCopy}>
            <Text style={styles.summaryEyebrow}>
              YOUR SACRED OFFERING
            </Text>

            <Text style={styles.summaryTitle}>
              {pooja}
            </Text>

            <Text style={styles.summarySub}>
              Kashi Vishwanath · Varanasi
            </Text>
          </View>
        </View>

        {/* PARTICIPATION */}

        <SectionLabel
          eyebrow="POOJA EXPERIENCE"
          title="How you will participate"
        />

        <InfoCard>
          <InfoRow
            icon={
              mode === "remote"
                ? "videocam-outline"
                : "business-outline"
            }
            label="Participation"
            value={participationLabel}
          />

          <Divider />

          <InfoRow
            icon="location-outline"
            label="Mandir"
            value="Kashi Vishwanath, Varanasi"
          />

          <Divider />

          <InfoRow
            icon="calendar-outline"
            label="Pooja date"
            value={date || "Not selected"}
          />

          <Divider />

          <InfoRow
            icon="time-outline"
            label="Preferred time"
            value={time || "Not selected"}
          />
        </InfoCard>

        {/* SANKALP */}

        <SectionLabel
          eyebrow="YOUR SANKALP"
          title="Prayer intention"
        />

        <View style={styles.sankalpCard}>
          <View style={styles.sankalpIcon}>
            <Ionicons
              name="flower-outline"
              size={20}
              color={DivyaTheme.colors.vermilionDeep}
            />
          </View>

          <Text style={styles.sankalpText}>
            {sankalp || "Sacred prayer intention"}
          </Text>
        </View>

        {/* DEVOTEE */}

        <SectionLabel
          eyebrow="DEVOTEE DETAILS"
          title="Who this Pooja is for"
        />

        <InfoCard>
          <InfoRow
            icon="person-outline"
            label="Primary devotee"
            value={name}
          />

          <Divider />

          <InfoRow
            icon="call-outline"
            label="Mobile"
            value={
              mobile
                ? `+91 ${mobile}`
                : "Not provided"
            }
          />

          <Divider />

          <InfoRow
            icon="mail-outline"
            label="Email"
            value={email || "Not provided"}
          />

          <Divider />

          <InfoRow
            icon="leaf-outline"
            label="Gotra"
            value={
              gotra || "Not specified"
            }
          />

          {bookingFor === "family" && (
            <>
              <Divider />

              <InfoRow
                icon="people-outline"
                label="Pooja offered for"
                value={participantName}
              />
            </>
          )}
        </InfoCard>

        {/* JOURNEY */}

        <View style={styles.journeyCard}>
          <Text style={styles.journeyEyebrow}>
            POOJA JOURNEY
          </Text>

          <JourneyRow
            title="Sankalp"
            subtitle="Prayer intention confirmed"
          />

          <View style={styles.journeyLine} />

          <JourneyRow
            title="Devotee details"
            subtitle="Devotee information confirmed"
          />

          <View style={styles.journeyLine} />

          <JourneyRow
            title="Review"
            subtitle="Ready for secure payment"
          />
        </View>

        {/* PAYMENT PLACEHOLDER */}

        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <View>
              <Text style={styles.paymentEyebrow}>
                POOJA CONTRIBUTION
              </Text>

              <Text style={styles.paymentTitle}>
                Price confirmed at checkout
              </Text>
            </View>

            <Ionicons
              name="shield-checkmark-outline"
              size={25}
              color="#B78C47"
            />
          </View>

          <Text style={styles.paymentText}>
            Final amount will be fetched securely from
            DivyaArpan before payment. No price is being
            accepted from the app screen itself.
          </Text>
        </View>

        {/* REAL BOOKING RESULT */}

        {createdBooking && (
          <View style={styles.bookingCreatedCard}>
            <View style={styles.bookingCreatedIcon}>
              <Ionicons
                name="checkmark"
                size={18}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.bookingCreatedCopy}>
              <Text style={styles.bookingCreatedEyebrow}>
                BOOKING CREATED
              </Text>

              <Text style={styles.bookingCreatedTitle}>
                Your Pooja request is ready
              </Text>

              <Text style={styles.bookingCreatedId}>
                {createdBooking.bookingId}
              </Text>

              <Text style={styles.bookingCreatedText}>
                {createdBooking.temple} ·{" "}
                {createdBooking.pooja} ·{" "}
                {createdBooking.price}
              </Text>

              <Text style={styles.bookingCreatedText}>
                {createdBooking.date} ·{" "}
                {createdBooking.time} ·{" "}
                {createdBooking.status}
              </Text>
            </View>
          </View>
        )}

        {!!submitError && (
          <View style={styles.errorCard}>
            <Ionicons
              name="alert-circle-outline"
              size={19}
              color="#9A332A"
            />

            <Text style={styles.errorText}>
              {submitError}
            </Text>
          </View>
        )}

        {/* CTA */}

        <Pressable
          disabled={submitting || !!createdBooking}
          style={[
            styles.payButton,
            (submitting || !!createdBooking) &&
              styles.payButtonDisabled,
          ]}
          onPress={createBooking}
        >
          <Text style={styles.payButtonText}>
            {createdBooking
              ? "Booking Created"
              : submitting
                ? "Creating Sacred Booking..."
                : "Continue to Secure Payment"}
          </Text>

          <Ionicons
            name={
              createdBooking
                ? "checkmark-circle-outline"
                : "lock-closed-outline"
            }
            size={16}
            color="#5F1B21"
          />
        </Pressable>

        <Text style={styles.assurance}>
          Booking amount will be verified by the
          DivyaArpan server before payment.
        </Text>
      </ScrollView>
    </View>
  );
}

function SectionLabel({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <View style={styles.sectionLabel}>
      <Text style={styles.sectionEyebrow}>
        {eyebrow}
      </Text>

      <Text style={styles.sectionTitle}>
        {title}
      </Text>
    </View>
  );
}

function InfoCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.infoCard}>
      {children}
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={DivyaTheme.colors.vermilionDeep}
        />
      </View>

      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function JourneyRow({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.journeyRow}>
      <View style={styles.journeyCheck}>
        <Ionicons
          name="checkmark"
          size={13}
          color="#FFFFFF"
        />
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
    paddingBottom: 40,
  },

  header: {
    minHeight: 250,
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
    marginTop: 24,
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

  poojaPill: {
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

  poojaPillText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 6.5,
    color: "#F0DBAE",
  },

  summaryHero: {
    marginHorizontal: 14,
    marginTop: 18,
    minHeight: 104,
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#F2E4D0",
    flexDirection: "row",
    alignItems: "center",
  },

  summaryOm: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#611E24",
    alignItems: "center",
    justifyContent: "center",
  },

  omText: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 27,
    color: "#EDCE8A",
  },

  summaryHeroCopy: {
    flex: 1,
    marginLeft: 13,
  },

  summaryEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.5,
    letterSpacing: 1.15,
    color: "#99652D",
  },

  summaryTitle: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 21,
    color: DivyaTheme.colors.ink,
  },

  summarySub: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 6.6,
    color: DivyaTheme.colors.muted,
  },

  sectionLabel: {
    paddingHorizontal: 14,
    paddingTop: 27,
  },

  sectionEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.8,
    letterSpacing: 1.4,
    color: "#A37235",
  },

  sectionTitle: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 23,
    color: DivyaTheme.colors.ink,
  },

  infoCard: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 19,
    paddingHorizontal: 13,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E8D6BD",
  },

  infoRow: {
    minHeight: 73,
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: "#F4E6D2",
    alignItems: "center",
    justifyContent: "center",
  },

  infoCopy: {
    flex: 1,
    marginLeft: 10,
  },

  infoLabel: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 6.2,
    color: "#886F57",
  },

  infoValue: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 8.5,
    color: DivyaTheme.colors.ink,
  },

  divider: {
    marginLeft: 47,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#EADBC7",
  },

  sankalpCard: {
    marginHorizontal: 14,
    marginTop: 12,
    minHeight: 108,
    padding: 14,
    borderRadius: 19,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E8D6BD",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  sankalpIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4E6D2",
    alignItems: "center",
    justifyContent: "center",
  },

  sankalpText: {
    flex: 1,
    marginLeft: 11,
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 8,
    lineHeight: 13,
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
    minHeight: 47,
    flexDirection: "row",
    alignItems: "center",
  },

  journeyCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#A98245",
    alignItems: "center",
    justifyContent: "center",
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

  paymentCard: {
    marginHorizontal: 14,
    marginTop: 27,
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E8D6BD",
  },

  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paymentEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.7,
    letterSpacing: 1.25,
    color: "#9E6B31",
  },

  paymentTitle: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 18,
    color: DivyaTheme.colors.ink,
  },

  paymentText: {
    marginTop: 8,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 6.5,
    lineHeight: 10,
    color: DivyaTheme.colors.muted,
  },

  payButton: {
    marginHorizontal: 14,
    marginTop: 22,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#E9C982",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  payButtonText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 8,
    color: "#5F1B21",
  },

  assurance: {
    marginTop: 11,
    paddingHorizontal: 24,
    textAlign: "center",
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 6.2,
    lineHeight: 9,
    color: DivyaTheme.colors.muted,
  },
  payButtonDisabled: {
    opacity: 0.68,
  },

  bookingCreatedCard: {
    marginHorizontal: 17,
    marginTop: 18,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D7BE84",
    backgroundColor: "#FFF9EA",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  bookingCreatedIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6E2430",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  bookingCreatedCopy: {
    flex: 1,
  },

  bookingCreatedEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.1,
    color: "#9A7138",
  },

  bookingCreatedTitle: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 20,
    color: DivyaTheme.colors.ink,
  },

  bookingCreatedId: {
    marginTop: 6,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 12,
    color: DivyaTheme.colors.vermilionDeep,
  },

  bookingCreatedText: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: "#776157",
  },

  errorCard: {
    marginHorizontal: 17,
    marginTop: 12,
    padding: 13,
    borderRadius: 16,
    backgroundColor: "#FFF0EC",
    borderWidth: 1,
    borderColor: "#EBC9C0",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  errorText: {
    flex: 1,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 18,
    color: "#873229",
  },

});
