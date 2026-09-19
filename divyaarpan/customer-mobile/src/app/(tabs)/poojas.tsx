import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { DivyaTheme } from "@/constants/divya-theme";
import { useTranslation } from "@/i18n/useTranslation";

type IconName = keyof typeof Ionicons.glyphMap;

const poojaDiscovery = [
  {
    titleKey: "homeBeginnings",
    descriptionKey: "homeBeginningsDescription",
    icon: "home-outline" as IconName,
    route: "/bookings",
  },
  {
    titleKey: "familyWellbeing",
    descriptionKey: "familyWellbeingDescription",
    icon: "people-outline" as IconName,
    route: "/bookings",
  },
  {
    titleKey: "prosperitySuccess",
    descriptionKey: "prosperitySuccessDescription",
    icon: "trending-up-outline" as IconName,
    route: "/bookings",
  },
  {
    titleKey: "healthPeace",
    descriptionKey: "healthPeaceDescription",
    icon: "heart-outline" as IconName,
    route: "/bookings",
  },
  {
    titleKey: "festivalsSacredDays",
    descriptionKey: "festivalsSacredDaysDescription",
    icon: "calendar-outline" as IconName,
    route: "/temples",
  },
  {
    titleKey: "mandirPoojasCategory",
    descriptionKey: "mandirPoojasCategoryDescription",
    icon: "business-outline" as IconName,
    route: "/temples",
  },
] as const;

const poojaModes = [
  {
    titleKey: "mandirPooja",
    descriptionKey: "mandirPoojaDescription",
    icon: "business-outline" as IconName,
    route: "/temples",
  },
  {
    titleKey: "poojaFromHome",
    descriptionKey: "poojaFromHomeDescription",
    icon: "videocam-outline" as IconName,
    route: "/poojas",
  },
  {
    titleKey: "poojaAtHome",
    descriptionKey: "poojaAtHomeDescription",
    icon: "home-outline" as IconName,
    route: "/bookings",
  },
  {
    titleKey: "festivalsSacredDays",
    descriptionKey: "festivalsSacredDaysDescription",
    icon: "calendar-outline" as IconName,
    route: "/temples",
  },
] as const;

const popularPoojas = [
  {
    titleKey: "ganeshPooja",
    deityKey: "shriGanesh",
    purposeKey: "auspiciousBeginnings",
    icon: "flower-outline" as IconName,
  },
  {
    titleKey: "rudrabhishek",
    deityKey: "mahadev",
    purposeKey: "peaceDivineBlessings",
    icon: "water-outline" as IconName,
  },
  {
    titleKey: "satyanarayanPooja",
    deityKey: "shriVishnu",
    purposeKey: "familyProsperity",
    icon: "sparkles-outline" as IconName,
  },
  {
    titleKey: "navgrahPooja",
    deityKey: "navgraha",
    purposeKey: "planetaryHarmony",
    icon: "planet-outline" as IconName,
  },
  {
    titleKey: "grihaPravesh",
    deityKey: "vastuGrihaDevata",
    purposeKey: "sacredHomeBeginning",
    icon: "home-outline" as IconName,
  },
] as const;

const deities = [
  { nameKey: "mahadev", icon: "moon-outline" as IconName },
  { nameKey: "ganesh", icon: "flower-outline" as IconName },
  { nameKey: "vishnu", icon: "sparkles-outline" as IconName },
  { nameKey: "devi", icon: "flame-outline" as IconName },
  { nameKey: "hanuman", icon: "shield-outline" as IconName },
] as const;

const sacredDays = [
  {
    titleKey: "navratri",
    subtitleKey: "durgaPoojaDeviUpasana",
    tagKey: "festivalTag",
  },
  {
    titleKey: "mahashivratri",
    subtitleKey: "rudrabhishekShivaPooja",
    tagKey: "shivaTag",
  },
  {
    titleKey: "purnima",
    subtitleKey: "satyanarayanPooja",
    tagKey: "monthlyTag",
  },
] as const;

export default function PoojasScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const go = (route: string) => {
    router.push(route as never);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>{t("poojasHeaderEyebrow")}</Text>

            <Text style={styles.title}>
              {t("poojasHeaderTitle")}
            </Text>

            <Text style={styles.subtitle}>
              {t("poojasHeaderDescription")}
            </Text>
          </View>

          <View style={styles.omCircle}>
            <Text style={styles.omText}>ॐ</Text>
          </View>
        </View>

        {/* PURPOSE-BASED POOJA DISCOVERY */}

        <View style={styles.discoverySection}>
          <View style={styles.discoveryHeading}>
            <View style={styles.discoverySymbol}>
              <Text style={styles.discoveryOm}>ॐ</Text>
            </View>

            <View style={styles.discoveryHeadingCopy}>
              <Text style={styles.discoveryEyebrow}>
                {t("poojaDiscoveryEyebrow")}
              </Text>

              <Text style={styles.discoveryTitle}>
                {t("poojaDiscoveryTitle")}
              </Text>
            </View>
          </View>

          <Text style={styles.discoveryDescription}>
            {t("poojaDiscoveryDescription")}
          </Text>

          <View style={styles.discoveryList}>
            {poojaDiscovery.map((item, index) => (
              <Pressable
                key={item.titleKey}
                style={({ pressed }) => [
                  styles.discoveryCard,
                  index === 0 && styles.discoveryCardFeatured,
                  pressed && styles.discoveryCardPressed,
                ]}
                onPress={() => go(item.route)}
              >
                <View
                  style={[
                    styles.discoveryIcon,
                    index === 0 && styles.discoveryIconFeatured,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color={
                      index === 0
                        ? "#FFF8E9"
                        : DivyaTheme.colors.vermilionDeep
                    }
                  />
                </View>

                <View style={styles.discoveryCopy}>
                  <Text
                    style={[
                      styles.discoveryCardTitle,
                      index === 0 &&
                        styles.discoveryCardTitleFeatured,
                    ]}
                  >
                    {t(item.titleKey)}
                  </Text>

                  <Text
                    style={[
                      styles.discoveryCardDescription,
                      index === 0 &&
                        styles.discoveryCardDescriptionFeatured,
                    ]}
                  >
                    {t(item.descriptionKey)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.discoveryArrow,
                    index === 0 &&
                      styles.discoveryArrowFeatured,
                  ]}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={
                      index === 0
                        ? "#FFF4E1"
                        : DivyaTheme.colors.vermilionDeep
                    }
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* HOW TO PERFORM */}

        <View style={styles.section}>
          <Text style={styles.eyebrow}>{t("chooseJourneyEyebrow")}</Text>

          <Text style={styles.sectionTitle}>
            {t("chooseJourneyTitle")}
          </Text>

          <View style={styles.modeGrid}>
            {poojaModes.map((item) => (
              <Pressable
                key={item.titleKey}
                style={styles.modeCard}
                onPress={() => go(item.route)}
              >
                <View style={styles.modeIcon}>
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color={DivyaTheme.colors.vermilionDeep}
                  />
                </View>

                <Text style={styles.modeTitle}>
                  {t(item.titleKey)}
                </Text>

                <Text style={styles.modeSubtitle}>
                  {t(item.descriptionKey)}
                </Text>

                <View style={styles.modeArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={13}
                    color={DivyaTheme.colors.vermilionDeep}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* {t("popularPoojas")} */}

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <View>
              <Text style={styles.eyebrow}>
                POPULAR POOJAS
              </Text>

              <Text style={styles.sectionTitle}>
                {t("chosenWithShraddha")}
              </Text>
            </View>

            <Text style={styles.seeAll}>
              {t("seeAll")}
            </Text>
          </View>

          <View style={styles.popularList}>
            {popularPoojas.map((item, index) => (
              <Pressable
                key={item.titleKey}
                style={[
                  styles.popularRow,
                  index === popularPoojas.length - 1 &&
                    styles.popularRowLast,
                ]}
                onPress={() => go("/bookings")}
              >
                <View style={styles.popularIcon}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={DivyaTheme.colors.vermilionDeep}
                  />
                </View>

                <View style={styles.popularCopy}>
                  <Text style={styles.popularTitle}>
                    {t(item.titleKey)}
                  </Text>

                  <Text style={styles.popularMeta}>
                    {t(item.deityKey)} · {t(item.purposeKey)}
                  </Text>
                </View>

                <View style={styles.popularArrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={DivyaTheme.colors.vermilionDeep}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* BY DEITY */}

        <View style={styles.section}>
          <Text style={styles.eyebrow}>{t("exploreByDeity")}</Text>

          <Text style={styles.sectionTitle}>
            {t("beginWithIshta")}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.deityRail}
          >
            {deities.map((item) => (
              <Pressable
                key={item.nameKey}
                style={styles.deityCard}
                onPress={() => go("/bookings")}
              >
                <View style={styles.deityIcon}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color="#E7C37E"
                  />
                </View>

                <Text style={styles.deityName}>
                  {t(item.nameKey)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* SACRED DAYS */}

        <View style={styles.section}>
          <Text style={styles.eyebrow}>{t("upcomingSacredDays")}</Text>

          <Text style={styles.sectionTitle}>
            {t("divineOccasionPoojas")}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sacredRail}
          >
            {sacredDays.map((item) => (
              <Pressable
                key={item.titleKey}
                style={styles.sacredCard}
                onPress={() => go("/temples")}
              >
                <View style={styles.sacredTag}>
                  <Text style={styles.sacredTagText}>
                    {t(item.tagKey)}
                  </Text>
                </View>

                <Text style={styles.sacredTitle}>
                  {t(item.titleKey)}
                </Text>

                <Text style={styles.sacredSubtitle}>
                  {t(item.subtitleKey)}
                </Text>

                <View style={styles.sacredFooter}>
                  <Text style={styles.sacredLink}>
                    {t("explorePoojas")}
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="#EBCB8B"
                  />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* HELP */}

        <Pressable
          style={styles.helpCard}
          onPress={() => go("/bookings")}
        >
          <View style={styles.helpIcon}>
            <Ionicons
              name="person-outline"
              size={19}
              color="#E8C77F"
            />
          </View>

          <View style={styles.helpCopy}>
            <Text style={styles.helpEyebrow}>
              {t("notSureWhichPooja")}
            </Text>

            <Text style={styles.helpTitle}>
              {t("speakWithPandit")}
            </Text>

            <Text style={styles.helpSub}>
              {t("panditGuidanceDescription")}
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={17}
            color="#E8C77F"
          />
        </Pressable>

        <View style={styles.closing}>
          <Text style={styles.closingOm}>ॐ</Text>
          <Text style={styles.closingText}>
            {t("devotionToSurrender")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF8EE",
  },

  content: {
    paddingBottom: 34,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  eyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 6,
    letterSpacing: 1.45,
    color: "#A87632",
  },

  title: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 34,
    lineHeight: 35,
    color: DivyaTheme.colors.burgundyDeep,
  },

  subtitle: {
    marginTop: 5,
    maxWidth: 310,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 8,
    lineHeight: 11,
    color: DivyaTheme.colors.muted,
  },

  omCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#F3E3CC",
    borderWidth: 1,
    borderColor: "#E6CFA9",
    alignItems: "center",
    justifyContent: "center",
  },

  omText: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 22,
    color: DivyaTheme.colors.vermilionDeep,
  },

  discoverySection: {
    marginHorizontal: 14,
    marginTop: 4,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E9D5B8",
    ...DivyaTheme.shadow.card,
  },

  discoveryHeading: {
    flexDirection: "row",
    alignItems: "center",
  },

  discoverySymbol: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5E4CE",
    borderWidth: 1,
    borderColor: "#E7CBA5",
  },

  discoveryOm: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 22,
    color: DivyaTheme.colors.vermilionDeep,
  },

  discoveryHeadingCopy: {
    flex: 1,
    marginLeft: 12,
  },

  discoveryEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 6,
    letterSpacing: 1.35,
    color: "#A66C27",
  },

  discoveryTitle: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 25,
    lineHeight: 28,
    color: DivyaTheme.colors.ink,
  },

  discoveryDescription: {
    marginTop: 12,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 8,
    lineHeight: 13,
    color: DivyaTheme.colors.muted,
  },

  discoveryList: {
    marginTop: 14,
    gap: 8,
  },

  discoveryCard: {
    minHeight: 78,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#FFF9F1",
    borderWidth: 1,
    borderColor: "#EAD9C1",
    flexDirection: "row",
    alignItems: "center",
  },

  discoveryCardFeatured: {
    minHeight: 88,
    backgroundColor: "#7A2626",
    borderColor: "#7A2626",
  },

  discoveryCardPressed: {
    opacity: 0.84,
  },

  discoveryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3E2CC",
  },

  discoveryIconFeatured: {
    backgroundColor: "rgba(255,248,233,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,248,233,0.16)",
  },

  discoveryCopy: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },

  discoveryCardTitle: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 17,
    lineHeight: 20,
    color: DivyaTheme.colors.ink,
  },

  discoveryCardTitleFeatured: {
    color: "#FFF8E9",
  },

  discoveryCardDescription: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 7,
    lineHeight: 11,
    color: DivyaTheme.colors.muted,
  },

  discoveryCardDescriptionFeatured: {
    color: "rgba(255,248,233,0.70)",
  },

  discoveryArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5D1B4",
  },

  discoveryArrowFeatured: {
    borderColor: "rgba(255,248,233,0.22)",
  },

  hero: {
    marginHorizontal: 14,
    minHeight: 236,
    padding: 18,
    borderRadius: 24,
    overflow: "hidden",
    justifyContent: "flex-end",
    ...DivyaTheme.shadow.card,
  },

  heroGlowOne: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -70,
    top: -70,
    borderWidth: 1,
    borderColor: "rgba(235,203,139,0.12)",
  },

  heroGlowTwo: {
    position: "absolute",
    width: 125,
    height: 125,
    borderRadius: 63,
    right: -40,
    top: -38,
    borderWidth: 1,
    borderColor: "rgba(235,203,139,0.14)",
  },

  heroEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.7,
    letterSpacing: 1.5,
    color: "#E7C47E",
  },

  heroTitle: {
    marginTop: 6,
    maxWidth: 320,
    fontFamily: DivyaTheme.fonts.display,
    fontSize: 30,
    lineHeight: 30,
    color: "#FFF8E9",
  },

  heroBody: {
    marginTop: 7,
    maxWidth: 330,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 7.2,
    lineHeight: 11,
    color: "rgba(255,248,233,0.66)",
  },

  heroButton: {
    marginTop: 15,
    alignSelf: "flex-start",
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#EDCF91",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  heroButtonText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 7.5,
    color: "#642027",
  },

  section: {
    paddingHorizontal: 14,
    paddingTop: 28,
  },

  sectionTitle: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 24,
    lineHeight: 26,
    color: DivyaTheme.colors.ink,
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  seeAll: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 7.5,
    color: DivyaTheme.colors.vermilionDeep,
  },

  modeGrid: {
    marginTop: 13,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  modeCard: {
    width: "48.7%",
    minHeight: 154,
    padding: 13,
    borderRadius: 19,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E9D8C0",
  },

  modeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F4E6D1",
    alignItems: "center",
    justifyContent: "center",
  },

  modeTitle: {
    marginTop: 13,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 17,
    lineHeight: 18,
    color: DivyaTheme.colors.ink,
  },

  modeSubtitle: {
    marginTop: 4,
    maxWidth: 135,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 6.5,
    lineHeight: 9,
    color: DivyaTheme.colors.muted,
  },

  modeArrow: {
    marginTop: 11,
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E6D2B5",
    alignItems: "center",
    justifyContent: "center",
  },

  popularList: {
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E9D8C0",
  },

  popularRow: {
    minHeight: 75,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EBDDC9",
  },

  popularRowLast: {
    borderBottomWidth: 0,
  },

  popularIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5E7D3",
    alignItems: "center",
    justifyContent: "center",
  },

  popularCopy: {
    flex: 1,
    marginLeft: 11,
  },

  popularTitle: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 17,
    color: DivyaTheme.colors.ink,
  },

  popularMeta: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 6.6,
    color: DivyaTheme.colors.muted,
  },

  popularArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E7D6BD",
    alignItems: "center",
    justifyContent: "center",
  },

  deityRail: {
    paddingTop: 13,
    paddingRight: 10,
    gap: 9,
  },

  deityCard: {
    width: 104,
    minHeight: 118,
    borderRadius: 19,
    padding: 12,
    backgroundColor: "#5D1C22",
  },

  deityIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(237,204,141,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  deityName: {
    marginTop: 17,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 16,
    color: "#FFF4E1",
  },

  purposeWrap: {
    marginTop: 13,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  purposeChip: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#E7D4B9",
    alignItems: "center",
    justifyContent: "center",
  },

  purposeText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 7,
    color: DivyaTheme.colors.ink,
  },

  sacredRail: {
    paddingTop: 13,
    paddingRight: 10,
    gap: 10,
  },

  sacredCard: {
    width: 225,
    minHeight: 176,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#642027",
  },

  sacredTag: {
    alignSelf: "flex-start",
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "rgba(237,204,141,0.10)",
    justifyContent: "center",
  },

  sacredTagText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.5,
    letterSpacing: 1.1,
    color: "#E7C47E",
  },

  sacredTitle: {
    marginTop: 18,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 22,
    color: "#FFF5E4",
  },

  sacredSubtitle: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 6.8,
    lineHeight: 10,
    color: "rgba(255,245,228,0.62)",
  },

  sacredFooter: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  sacredLink: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 7,
    color: "#EBCB8B",
  },

  helpCard: {
    marginHorizontal: 14,
    marginTop: 28,
    minHeight: 102,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#4F171C",
    flexDirection: "row",
    alignItems: "center",
  },

  helpIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "rgba(232,199,127,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  helpCopy: {
    flex: 1,
    marginHorizontal: 12,
  },

  helpEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.5,
    letterSpacing: 1.2,
    color: "#E3BF76",
  },

  helpTitle: {
    marginTop: 3,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 18,
    color: "#FFF5E4",
  },

  helpSub: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 6.2,
    lineHeight: 9,
    color: "rgba(255,245,228,0.58)",
  },

  closing: {
    paddingTop: 30,
    paddingBottom: 14,
    alignItems: "center",
  },

  closingOm: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontSize: 25,
    color: "#A36E31",
  },

  closingText: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 8,
    color: DivyaTheme.colors.ink,
  },
});
