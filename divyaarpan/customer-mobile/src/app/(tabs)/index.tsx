import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { DivyaTheme } from "@/constants/divya-theme";

const hero = require("../../../assets/signature/atmosphere/home-hero.jpg");
const pandit = require("../../../assets/signature/atmosphere/pandit-service.jpg");
const kashi = require("../../../assets/signature/temples/kashi-vishwanath.jpg");
const siddhivinayak = require("../../../assets/signature/temples/siddhivinayak.jpg");
const tirupati = require("../../../assets/signature/temples/tirupati-balaji.jpg");

function navigate(path: string) {
  Haptics.selectionAsync().catch(() => undefined);
  router.push(path as never);
}

const journeys = [
  {
    number: "01",
    title: "Find a Pandit",
    body: "Connect with verified Pandits for rituals at home or your chosen venue.",
    path: "/bookings",
  },
  {
    number: "02",
    title: "Temple Pooja",
    body: "Participate in sacred poojas performed at revered temples.",
    path: "/temples",
  },
  {
    number: "03",
    title: "Offer Arpan",
    body: "Send your Sankalp, prayer and offerings from wherever you are.",
    path: "/poojas",
  },
  {
    number: "04",
    title: "Explore Sacred India",
    body: "Discover temples through their stories, traditions and living rituals.",
    path: "/temples",
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─────────────────────────────
            SIGNATURE V3 — CUSTOMER FACE
        ───────────────────────────── */}

        <View style={styles.signatureCover}>
          {/* Brand header */}
          <View style={styles.signatureHeader}>
            <View style={styles.brandBlock}>
              <View style={styles.brandSymbol}>
                <Text style={styles.brandOm}>ॐ</Text>
              </View>

              <View>
                <Text style={styles.signatureWordmark}>DIVYAARPAN</Text>
                <Text style={styles.signatureTagline}>
                  DEVOTION · CLOSER
                </Text>
              </View>
            </View>

            <View style={styles.signatureHeaderRight}>
              <Pressable style={styles.locationBlock}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={DivyaTheme.colors.vermilionDeep}
                />

                <View>
                  <Text style={styles.locationLabel}>YOUR LOCATION</Text>
                  <Text style={styles.locationValue}>Mumbai</Text>
                </View>
              </Pressable>

              <Pressable style={styles.notificationButton}>
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={DivyaTheme.colors.ink}
                />
                <View style={styles.notificationDot} />
              </Pressable>
            </View>
          </View>

          {/* Primary message */}
          <View style={styles.signatureIntro}>
            <Text style={styles.signatureEyebrow}>
              A SACRED BEGINNING
            </Text>

            <Text style={styles.signatureTitle}>
              Your devotion.{"\n"}Closer.
            </Text>

            <Text style={styles.signatureBody}>
              Trusted Pandits, revered temples and meaningful rituals —
              brought together with care.
            </Text>
          </View>

          {/* Signature temple doorway */}
          <Pressable
            style={styles.archFrame}
            onPress={() => navigate("/temples")}
          >
            <ImageBackground
              source={hero}
              resizeMode="cover"
              style={styles.archImage}
              imageStyle={styles.archImageShape}
            >
              <LinearGradient
                colors={[
                  "rgba(25,12,8,0.02)",
                  "rgba(25,12,8,0.12)",
                  "rgba(25,12,8,0.78)",
                ]}
                locations={[0, 0.48, 1]}
                style={styles.archGradient}
              >
                <View style={styles.archTopRow}>
                  <View style={styles.liveTemple}>
                    <View style={styles.liveTempleDot} />
                    <Text style={styles.liveTempleText}>
                      SACRED INDIA
                    </Text>
                  </View>

                  <Pressable style={styles.dhwaniButton}>
                    <Ionicons
                      name="musical-notes-outline"
                      size={15}
                      color="#FFF7E9"
                    />
                  </Pressable>
                </View>

                <View style={styles.archBottom}>
                  <Text style={styles.archTempleMeta}>
                    VARANASI · UTTAR PRADESH
                  </Text>

                  <Text style={styles.archTempleTitle}>
                    Experience{"\n"}the sacred.
                  </Text>

                  <View style={styles.archExplore}>
                    <Text style={styles.archExploreText}>
                      Explore temples
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={15}
                      color="#F7E2B5"
                    />
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </Pressable>

          {/* Primary customer actions */}
          <View style={styles.primaryActions}>
            <Pressable
              style={styles.primaryActionDark}
              onPress={() => navigate("/bookings")}
            >
              <View>
                <Text style={styles.primaryActionOverline}>
                  AT HOME · VENUE
                </Text>
                <Text style={styles.primaryActionTitleLight}>
                  Book a Pandit
                </Text>
              </View>

              <View style={styles.primaryActionArrowLight}>
                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color="#FFF8EF"
                />
              </View>
            </Pressable>

            <Pressable
              style={styles.primaryActionLight}
              onPress={() => navigate("/temples")}
            >
              <View>
                <Text style={styles.primaryActionOverlineGold}>
                  AT A TEMPLE
                </Text>
                <Text style={styles.primaryActionTitleDark}>
                  Temple Pooja
                </Text>
              </View>

              <View style={styles.primaryActionArrowDark}>
                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color={DivyaTheme.colors.vermilionDeep}
                />
              </View>
            </Pressable>
          </View>

          {/* Secondary destinations */}
          <View style={styles.serviceStrip}>
            <Pressable
              style={styles.serviceDestination}
              onPress={() => navigate("/temples")}
            >
              <Text style={styles.serviceIndex}>01</Text>
              <Text style={styles.serviceName}>Temples</Text>
            </Pressable>

            <View style={styles.serviceDivider} />

            <Pressable
              style={styles.serviceDestination}
              onPress={() => navigate("/poojas")}
            >
              <Text style={styles.serviceIndex}>02</Text>
              <Text style={styles.serviceName}>Poojas</Text>
            </Pressable>

            <View style={styles.serviceDivider} />

            <Pressable
              style={styles.serviceDestination}
              onPress={() => navigate("/poojas")}
            >
              <Text style={styles.serviceIndex}>03</Text>
              <Text style={styles.serviceName}>Arpan</Text>
            </Pressable>

            <View style={styles.serviceDivider} />

            <Pressable style={styles.serviceDestination}>
              <Text style={styles.serviceIndex}>04</Text>
              <Text style={styles.serviceName}>Ask Pandit</Text>
            </Pressable>
          </View>
        </View>

        {/* ─────────────────────────────
            CHAPTER 02 — JOURNEY
        ───────────────────────────── */}

        <View style={styles.journey}>
          <Text style={styles.chapterNumber}>01</Text>

          <Text style={styles.eyebrowDark}>
            YOUR SPIRITUAL JOURNEY
          </Text>

          <Text style={styles.editorialTitle}>
            Begin with what{"\n"}matters to you.
          </Text>

          <Text style={styles.editorialBody}>
            DivyaArpan brings different expressions of devotion into one
            thoughtful experience.
          </Text>

          <View style={styles.journeyList}>
            {journeys.map((item) => (
              <Pressable
                key={item.number}
                style={styles.journeyRow}
                onPress={() => navigate(item.path)}
              >
                <Text style={styles.journeyNumber}>
                  {item.number}
                </Text>

                <View style={styles.journeyCopy}>
                  <Text style={styles.journeyTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.journeyBody}>
                    {item.body}
                  </Text>
                </View>

                <Ionicons
                  name="arrow-up-outline"
                  size={18}
                  color={DivyaTheme.colors.champagneDeep}
                  style={styles.diagonalArrow}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* ─────────────────────────────
            CHAPTER 03 — SACRED INDIA
        ───────────────────────────── */}

        <View style={styles.sacred}>
          <View style={styles.chapterHeader}>
            <Text style={styles.chapterNumber}>02</Text>

            <Text style={styles.chapterSmall}>
              SACRED INDIA
            </Text>
          </View>

          <Text style={styles.sacredHeading}>
            Places where faith{"\n"}has lived for centuries.
          </Text>

          <Pressable
            style={styles.kashiStory}
            onPress={() => navigate("/temple/kashi-vishwanath")}
          >
            <Image
              source={kashi}
              style={styles.kashiImage}
              contentFit="cover"
              transition={350}
            />

            <LinearGradient
              colors={[
                "transparent",
                "rgba(20,10,7,0.12)",
                "rgba(20,10,7,0.90)",
              ]}
              style={styles.kashiShade}
            >
              <View style={styles.templeCounter}>
                <Text style={styles.templeCounterText}>
                  01 / 03
                </Text>
              </View>

              <View>
                <Text style={styles.templeMeta}>
                  JYOTIRLINGA · VARANASI
                </Text>

                <Text style={styles.kashiTitle}>
                  Kashi{"\n"}Vishwanath
                </Text>

                <View style={styles.templeExplore}>
                  <Text style={styles.templeExploreText}>
                    Enter the story
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={15}
                    color="#F5DFAF"
                  />
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          <View style={styles.sacredPair}>
            <Pressable style={styles.sacredSmall}>
              <Image
                source={siddhivinayak}
                style={styles.sacredSmallImage}
                contentFit="cover"
                transition={350}
              />

              <Text style={styles.smallTempleMeta}>
                MUMBAI · MAHARASHTRA
              </Text>

              <Text style={styles.smallTempleName}>
                Siddhivinayak
              </Text>
            </Pressable>

            <Pressable
              style={styles.sacredSmallOffset}
              onPress={() => navigate("/temples")}
            >
              <Image
                source={tirupati}
                style={styles.sacredSmallImageTall}
                contentFit="cover"
                transition={350}
              />

              <Text style={styles.smallTempleMeta}>
                TIRUPATI · ANDHRA PRADESH
              </Text>

              <Text style={styles.smallTempleName}>
                Sri Venkateswara
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.textLink}
            onPress={() => navigate("/temples")}
          >
            <Text style={styles.textLinkText}>
              Discover Sacred India
            </Text>

            <View style={styles.textLinkLine} />

            <Ionicons
              name="arrow-forward"
              size={16}
              color={DivyaTheme.colors.vermilionDeep}
            />
          </Pressable>
        </View>

        {/* ─────────────────────────────
            CHAPTER 04 — PANDIT
        ───────────────────────────── */}

        <View style={styles.panditSection}>
          <View style={styles.panditCopy}>
            <Text style={styles.chapterNumberLight}>
              03
            </Text>

            <Text style={styles.panditEyebrow}>
              BOOK A PANDIT
            </Text>

            <Text style={styles.panditTitle}>
              Tradition,{"\n"}guided personally.
            </Text>

            <Text style={styles.panditBody}>
              Tell us the pooja, location and language you prefer. We help
              connect you with a verified Pandit for the ceremony.
            </Text>

            <Pressable
              style={styles.panditAction}
              onPress={() => navigate("/bookings")}
            >
              <Text style={styles.panditActionText}>
                Find a Pandit
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color="#F6E5C1"
              />
            </Pressable>
          </View>

          <Image
            source={pandit}
            style={styles.panditImage}
            contentFit="cover"
            transition={350}
          />
        </View>

        {/* ─────────────────────────────
            CHAPTER 05 — ARPAN
        ───────────────────────────── */}

        <View style={styles.arpan}>
          <View style={styles.arpanOrbOne} />
          <View style={styles.arpanOrbTwo} />

          <Text style={styles.arpanNumber}>04</Text>

          <Text style={styles.arpanSymbol}>ॐ</Text>

          <Text style={styles.arpanEyebrow}>
            ARPAN · SANKALP · PRAYER
          </Text>

          <Text style={styles.arpanTitle}>
            Some prayers{"\n"}travel farther{"\n"}than we can.
          </Text>

          <Text style={styles.arpanBody}>
            Offer your Sankalp through participating temples and trusted
            ritual partners, even when you cannot be there in person.
          </Text>

          <Pressable
            style={styles.arpanAction}
            onPress={() => navigate("/poojas")}
          >
            <Text style={styles.arpanActionText}>
              Make an Arpan
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color={DivyaTheme.colors.night}
            />
          </Pressable>
        </View>

        {/* ─────────────────────────────
            CHAPTER 06 — POOJAS
        ───────────────────────────── */}

        <View style={styles.rituals}>
          <Text style={styles.chapterNumber}>05</Text>

          <Text style={styles.eyebrowDark}>
            SACRED RITUALS
          </Text>

          <Text style={styles.editorialTitle}>
            Rituals are stories{"\n"}we continue.
          </Text>

          <Text style={styles.editorialBody}>
            Understand why a pooja is traditionally performed before choosing
            the experience that feels right for your family.
          </Text>

          <View style={styles.ritualRows}>
            <Ritual
              number="01"
              title="Rudrabhishek"
              subtitle="Lord Shiva · Abhishek"
            />

            <Ritual
              number="02"
              title="Satyanarayan"
              subtitle="Lord Vishnu · Pooja"
            />

            <Ritual
              number="03"
              title="Griha Pravesh"
              subtitle="New Home · Ceremony"
            />
          </View>

          <Pressable
            style={styles.ritualCTA}
            onPress={() => navigate("/poojas")}
          >
            <Text style={styles.ritualCTAText}>
              Explore all rituals
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color={DivyaTheme.colors.vermilionDeep}
            />
          </Pressable>
        </View>

        {/* ─────────────────────────────
            CLOSING
        ───────────────────────────── */}

        <View style={styles.closing}>
          <Text style={styles.closingSymbol}>ॐ</Text>

          <Text style={styles.closingTitle}>
            Sacred journeys,{"\n"}made closer.
          </Text>

          <Text style={styles.closingWordmark}>
            DIVYAARPAN
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Ritual({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable style={styles.ritualRow}>
      <Text style={styles.ritualNumber}>{number}</Text>

      <View style={styles.ritualCopy}>
        <Text style={styles.ritualTitle}>{title}</Text>
        <Text style={styles.ritualSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.ritualArrow}>
        <Ionicons
          name="arrow-forward"
          size={15}
          color={DivyaTheme.colors.vermilionDeep}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DivyaTheme.colors.background,
  },

  scrollContent: {
    paddingBottom: 42,
  },

  // SIGNATURE V3 — CUSTOMER FACE

  signatureCover: {
    backgroundColor: "#FBF8F2",
    paddingBottom: 28,
  },

  signatureHeader: {
    height: 78,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brandSymbol: {
    width: 31,
    height: 31,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148,113,58,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },

  brandOm: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.vermilionDeep,
    fontSize: 16,
    lineHeight: 19,
  },

  signatureWordmark: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    color: DivyaTheme.colors.ink,
    fontSize: 11,
    letterSpacing: 2.7,
  },

  signatureTagline: {
    marginTop: 3,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 5.8,
    letterSpacing: 1.7,
  },

  signatureHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  locationBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  locationLabel: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.subtle,
    fontSize: 5.5,
    letterSpacing: 0.9,
  },

  locationValue: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    color: DivyaTheme.colors.ink,
    fontSize: 9,
  },

  notificationButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(69,45,37,0.10)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDF9",
  },

  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: DivyaTheme.colors.vermilion,
    borderWidth: 1,
    borderColor: "#FFFDF9",
  },

  signatureIntro: {
    paddingHorizontal: 22,
    paddingTop: 15,
    paddingBottom: 23,
  },

  signatureEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 7,
    letterSpacing: 2.1,
  },

  signatureTitle: {
    marginTop: 8,
    fontFamily: DivyaTheme.fonts.display,
    color: DivyaTheme.colors.ink,
    fontSize: 43,
    lineHeight: 39,
    letterSpacing: -0.7,
  },

  signatureBody: {
    marginTop: 12,
    maxWidth: 355,
    fontFamily: DivyaTheme.fonts.body,
    color: DivyaTheme.colors.muted,
    fontSize: 10.5,
    lineHeight: 17,
  },

  archFrame: {
    height: 305,
    marginHorizontal: 18,
    overflow: "hidden",
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: DivyaTheme.colors.night,
    borderWidth: 1,
    borderColor: "rgba(148,113,58,0.16)",
  },

  archImage: {
    flex: 1,
  },

  archImageShape: {
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  archGradient: {
    flex: 1,
    paddingHorizontal: 19,
    paddingTop: 24,
    paddingBottom: 20,
    justifyContent: "space-between",
  },

  archTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  liveTemple: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: "rgba(31,18,13,0.32)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  liveTempleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E9C779",
  },

  liveTempleText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: "#FFF6E7",
    fontSize: 6.5,
    letterSpacing: 1.4,
  },

  dhwaniButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(31,18,13,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },

  archBottom: {
    paddingHorizontal: 3,
  },

  archTempleMeta: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: "#EBD19A",
    fontSize: 7,
    letterSpacing: 1.7,
  },

  archTempleTitle: {
    marginTop: 7,
    fontFamily: DivyaTheme.fonts.display,
    color: "#FFFBF3",
    fontSize: 37,
    lineHeight: 34,
    letterSpacing: -0.4,
  },

  archExplore: {
    marginTop: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  archExploreText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: "#F7E2B5",
    fontSize: 8.5,
  },

  primaryActions: {
    marginTop: 17,
    paddingHorizontal: 18,
    flexDirection: "row",
    gap: 10,
  },

  primaryActionDark: {
    flex: 1,
    minHeight: 82,
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: DivyaTheme.colors.burgundyDeep,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  primaryActionLight: {
    flex: 1,
    minHeight: 82,
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: "#F0E5D5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  primaryActionOverline: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: "rgba(255,248,239,0.54)",
    fontSize: 5.7,
    letterSpacing: 1.1,
  },

  primaryActionOverlineGold: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 5.7,
    letterSpacing: 1.1,
  },

  primaryActionTitleLight: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: "#FFF8EF",
    fontSize: 19,
  },

  primaryActionTitleDark: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.ink,
    fontSize: 19,
  },

  primaryActionArrowLight: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryActionArrowDark: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(114,37,31,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceStrip: {
    marginTop: 21,
    marginHorizontal: 18,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(80,58,48,0.14)",
    flexDirection: "row",
    alignItems: "center",
  },

  serviceDestination: {
    flex: 1,
    alignItems: "center",
  },

  serviceIndex: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 11,
  },

  serviceName: {
    marginTop: 3,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    color: DivyaTheme.colors.text,
    fontSize: 7.5,
  },

  serviceDivider: {
    width: 1,
    height: 25,
    backgroundColor: "rgba(80,58,48,0.10)",
  },

  // JOURNEY

  journey: {
    paddingHorizontal: 25,
    paddingTop: 70,
    paddingBottom: 66,
  },

  chapterNumber: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 20,
  },

  eyebrowDark: {
    marginTop: 23,
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 8,
    letterSpacing: 2.1,
  },

  editorialTitle: {
    marginTop: 11,
    fontFamily: DivyaTheme.fonts.display,
    color: DivyaTheme.colors.ink,
    fontSize: 43,
    lineHeight: 41,
    letterSpacing: -0.7,
  },

  editorialBody: {
    marginTop: 17,
    width: "91%",
    fontFamily: DivyaTheme.fonts.body,
    color: DivyaTheme.colors.muted,
    fontSize: 11,
    lineHeight: 19,
  },

  journeyList: {
    marginTop: 42,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DivyaTheme.colors.border,
  },

  journeyRow: {
    minHeight: 116,
    paddingVertical: 21,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DivyaTheme.colors.border,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  journeyNumber: {
    width: 37,
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 17,
  },

  journeyCopy: {
    flex: 1,
    paddingRight: 14,
  },

  journeyTitle: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.ink,
    fontSize: 25,
    lineHeight: 27,
  },

  journeyBody: {
    marginTop: 6,
    fontFamily: DivyaTheme.fonts.body,
    color: DivyaTheme.colors.muted,
    fontSize: 9.5,
    lineHeight: 16,
  },

  diagonalArrow: {
    transform: [{ rotate: "45deg" }],
    marginTop: 3,
  },

  // SACRED INDIA

  sacred: {
    paddingHorizontal: 16,
    paddingBottom: 74,
  },

  chapterHeader: {
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chapterSmall: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 8,
    letterSpacing: 2.1,
  },

  sacredHeading: {
    marginTop: 18,
    marginHorizontal: 9,
    fontFamily: DivyaTheme.fonts.display,
    color: DivyaTheme.colors.ink,
    fontSize: 40,
    lineHeight: 39,
  },

  kashiStory: {
    marginTop: 28,
    height: 510,
    overflow: "hidden",
    backgroundColor: DivyaTheme.colors.night,
  },

  kashiImage: {
    ...StyleSheet.absoluteFill,
  },

  kashiShade: {
    flex: 1,
    padding: 19,
    justifyContent: "space-between",
  },

  templeCounter: {
    alignSelf: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.48)",
    paddingBottom: 4,
  },

  templeCounterText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    color: "rgba(255,255,255,0.72)",
    fontSize: 8,
    letterSpacing: 1.3,
  },

  templeMeta: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: "#E7CA91",
    fontSize: 8,
    letterSpacing: 1.8,
  },

  kashiTitle: {
    marginTop: 9,
    fontFamily: DivyaTheme.fonts.display,
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 44,
  },

  templeExplore: {
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  templeExploreText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    color: "#F5DFAF",
    fontSize: 9,
  },

  sacredPair: {
    marginTop: 35,
    flexDirection: "row",
    gap: 13,
    alignItems: "flex-start",
  },

  sacredSmall: {
    flex: 1,
  },

  sacredSmallOffset: {
    flex: 1,
    marginTop: 50,
  },

  sacredSmallImage: {
    width: "100%",
    height: 205,
  },

  sacredSmallImageTall: {
    width: "100%",
    height: 255,
  },

  smallTempleMeta: {
    marginTop: 11,
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 7,
    letterSpacing: 1.2,
  },

  smallTempleName: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.ink,
    fontSize: 24,
    lineHeight: 25,
  },

  textLink: {
    marginTop: 36,
    marginHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  textLinkText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.vermilionDeep,
    fontSize: 10,
  },

  textLinkLine: {
    flex: 1,
    height: 1,
    backgroundColor: DivyaTheme.colors.border,
    marginHorizontal: 13,
  },

  // PANDIT

  panditSection: {
    marginHorizontal: 16,
    minHeight: 530,
    backgroundColor: "#6A2C25",
    overflow: "hidden",
  },

  panditCopy: {
    paddingHorizontal: 25,
    paddingTop: 35,
    paddingBottom: 31,
  },

  chapterNumberLight: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: "#E3C692",
    fontSize: 20,
  },

  panditEyebrow: {
    marginTop: 22,
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: "#E3C692",
    fontSize: 8,
    letterSpacing: 2,
  },

  panditTitle: {
    marginTop: 10,
    fontFamily: DivyaTheme.fonts.display,
    color: "#FFF8F0",
    fontSize: 42,
    lineHeight: 40,
  },

  panditBody: {
    marginTop: 15,
    width: "94%",
    fontFamily: DivyaTheme.fonts.body,
    color: "rgba(255,255,255,0.69)",
    fontSize: 10.5,
    lineHeight: 18,
  },

  panditAction: {
    marginTop: 21,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  panditActionText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: "#F6E5C1",
    fontSize: 10,
  },

  panditImage: {
    width: "100%",
    height: 240,
  },

  // ARPAN

  arpan: {
    marginTop: 72,
    minHeight: 570,
    paddingHorizontal: 30,
    paddingVertical: 42,
    backgroundColor: DivyaTheme.colors.night,
    overflow: "hidden",
    justifyContent: "center",
  },

  arpanOrbOne: {
    position: "absolute",
    width: 330,
    height: 330,
    borderRadius: 165,
    top: -170,
    right: -130,
    backgroundColor: "rgba(199,162,96,0.055)",
  },

  arpanOrbTwo: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    bottom: -130,
    left: -100,
    borderWidth: 1,
    borderColor: "rgba(199,162,96,0.08)",
  },

  arpanNumber: {
    position: "absolute",
    top: 31,
    right: 29,
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: "rgba(233,212,165,0.50)",
    fontSize: 19,
  },

  arpanSymbol: {
    fontFamily: DivyaTheme.fonts.display,
    color: DivyaTheme.colors.champagne,
    fontSize: 47,
  },

  arpanEyebrow: {
    marginTop: 30,
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.champagne,
    fontSize: 8,
    letterSpacing: 2.1,
  },

  arpanTitle: {
    marginTop: 14,
    fontFamily: DivyaTheme.fonts.display,
    color: "#FFFDF7",
    fontSize: 45,
    lineHeight: 42,
  },

  arpanBody: {
    marginTop: 20,
    width: "94%",
    fontFamily: DivyaTheme.fonts.body,
    color: "rgba(255,255,255,0.59)",
    fontSize: 11,
    lineHeight: 19,
  },

  arpanAction: {
    marginTop: 29,
    alignSelf: "flex-start",
    height: 47,
    paddingHorizontal: 17,
    borderRadius: 999,
    backgroundColor: DivyaTheme.colors.champagneLight,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  arpanActionText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.night,
    fontSize: 10,
  },

  // RITUALS

  rituals: {
    paddingHorizontal: 25,
    paddingTop: 74,
    paddingBottom: 70,
  },

  ritualRows: {
    marginTop: 39,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DivyaTheme.colors.border,
  },

  ritualRow: {
    minHeight: 91,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DivyaTheme.colors.border,
  },

  ritualNumber: {
    width: 40,
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 17,
  },

  ritualCopy: {
    flex: 1,
  },

  ritualTitle: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.ink,
    fontSize: 25,
  },

  ritualSubtitle: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    color: DivyaTheme.colors.muted,
    fontSize: 8.5,
    letterSpacing: 0.4,
  },

  ritualArrow: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  ritualCTA: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  ritualCTAText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.vermilionDeep,
    fontSize: 10,
  },

  // CLOSING

  closing: {
    minHeight: 310,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2E9DE",
  },

  closingSymbol: {
    fontFamily: DivyaTheme.fonts.display,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 34,
  },

  closingTitle: {
    marginTop: 14,
    fontFamily: DivyaTheme.fonts.display,
    color: DivyaTheme.colors.ink,
    fontSize: 34,
    lineHeight: 34,
    textAlign: "center",
  },

  closingWordmark: {
    marginTop: 27,
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    color: DivyaTheme.colors.vermilionDeep,
    fontSize: 9,
    letterSpacing: 3,
  },
});
