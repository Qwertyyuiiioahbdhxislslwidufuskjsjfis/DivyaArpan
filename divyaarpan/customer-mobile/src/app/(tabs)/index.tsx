import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getPanditLiveAvailability,
  type PanditLiveAvailability,
} from "@/lib/api";
import { DivyaTheme } from "@/constants/divya-theme";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  APP_LANGUAGES,
  type LanguageCode,
} from "@/i18n/languages";

const kashi = require(
  "../../../assets/signature/temples/kashi-vishwanath.jpg"
);
const siddhivinayak = require(
  "../../../assets/signature/temples/siddhivinayak.jpg"
);
const tirupati = require(
  "../../../assets/signature/temples/tirupati-balaji.jpg"
);
const pandit = require(
  "../../../assets/signature/atmosphere/pandit-service.jpg"
);

function go(path: string) {
  void Haptics.selectionAsync();
  router.push(path as never);
}


const bhaktiItems = [
  {
    key: "aarti" as const,
    icon: "flame-outline" as const,
  },
  {
    key: "chalisa" as const,
    icon: "book-outline" as const,
  },
  {
    key: "mantra" as const,
    icon: "musical-notes-outline" as const,
  },
  {
    key: "panchang" as const,
    icon: "sunny-outline" as const,
  },
];

const poojas = [
  {
    titleKey: "rudrabhishek" as const,
    deityKey: "lordShiva" as const,
    icon: "water-outline" as const,
  },
  {
    titleKey: "satyanarayanPooja" as const,
    deityKey: "lordVishnu" as const,
    icon: "flower-outline" as const,
  },
  {
    titleKey: "grihaPravesh" as const,
    deityKey: "shubhKarya" as const,
    icon: "home-outline" as const,
  },
];

export default function HomeScreen() {
  const livePulse = useSharedValue(0);

  useEffect(() => {
    livePulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900 }),
        withTiming(0, { duration: 900 })
      ),
      -1,
      false
    );
  }, [livePulse]);

  const livePulseStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + livePulse.value * 0.52,
    transform: [
      {
        scale: 1 + livePulse.value * 1.35,
      },
    ],
  }));
  const {
    language,
    languageCode,
    setLanguage,
    t,
  } = useLanguage();

  const [languageOpen, setLanguageOpen] =
    useState(false);

  // TEMPORARY until customer city/profile/location selection is wired.
  const customerCity = "Mumbai";

  const [
    panditAvailability,
    setPanditAvailability,
  ] = useState<PanditLiveAvailability | null>(null);

  const [
    panditAvailabilityLoading,
    setPanditAvailabilityLoading,
  ] = useState(true);

  const [
    panditAvailabilityError,
    setPanditAvailabilityError,
  ] = useState(false);

  const refreshPanditAvailability =
    useCallback(async () => {
      try {
        const availability =
          await getPanditLiveAvailability(
            customerCity
          );

        setPanditAvailability(availability);
        setPanditAvailabilityError(false);
      } catch (error) {
        console.warn(
          "Unable to refresh live Pandit availability:",
          error
        );

        // Keep the last successful count on screen.
        // Never replace a network error with a fake zero.
        setPanditAvailabilityError(true);
      } finally {
        setPanditAvailabilityLoading(false);
      }
    }, [customerCity]);

  useEffect(() => {
    void refreshPanditAvailability();

    const interval = setInterval(() => {
      void refreshPanditAvailability();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [refreshPanditAvailability]);

  async function chooseLanguage(
    code: LanguageCode
  ) {
    void Haptics.selectionAsync();
    await setLanguage(code);
    setLanguageOpen(false);
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* APP HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brand}>
              <View style={styles.logo}>
                <Text style={styles.logoOm}>ॐ</Text>
              </View>

              <View>
                <Text style={styles.brandName}>
                  DIVYAARPAN
                </Text>
                <Text style={styles.brandTagline}>
                  श्रद्धा • सेवा • समर्पण
                </Text>
              </View>
            </View>

            <View style={styles.headerButtons}>
              <Pressable
                style={styles.languageButton}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setLanguageOpen(true);
                }}
              >
                <Ionicons
                  name="language-outline"
                  size={17}
                  color="#E94B00"
                />

                <Text
                  numberOfLines={1}
                  style={styles.languageButtonText}
                >
                  {language.nativeLabel}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={13}
                  color="#E94B00"
                />
              </Pressable>

              <Pressable style={styles.headerButton}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#54291C"
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.welcomeRow}>
            <View>
              <Text style={styles.welcomeHindi}>
                शुभ दिन 🙏
              </Text>
              <Text style={styles.welcomeText}>
                आज अपनी भक्ति से जुड़ें
              </Text>
            </View>

            <Pressable
              style={styles.panchangPill}
              onPress={() => go("/poojas")}
            >
              <Ionicons
                name="sunny"
                size={16}
                color="#E94B00"
              />
              <Text style={styles.panchangPillText}>
                {t("panchang")}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color="#E94B00"
              />
            </Pressable>
          </View>
        </View>

        {/* PRIMARY BOOK MY PANDIT — HOME HERO */}
        <View style={styles.topPanditSection}>
        {/* BOOK MY PANDIT — PRIMARY SERVICE */}
        <Pressable
          style={styles.primaryPanditCard}
          onPress={() => go("/bookings")}
        >
          <LinearGradient
            colors={["#B43612", "#7C2012"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.primaryPanditGlowOne} />
          <View style={styles.primaryPanditGlowTwo} />

          <View style={styles.primaryPanditTop}>
            <View style={styles.primaryPanditIcon}>
              <Ionicons
                name="person"
                size={27}
                color="#9D2E12"
              />
            </View>

            <View style={styles.primaryPanditBadge}>
              <Ionicons
                name="shield-checkmark"
                size={13}
                color="#FFD9A7"
              />

              <Text style={styles.primaryPanditBadgeText}>
                {t("verifiedPanditsTag")}
              </Text>
            </View>
          </View>

          <Text style={styles.primaryPanditLabel}>
            {t("panditServiceLabel")}
          </Text>

          <Text style={styles.primaryPanditTitle}>
            {t("bookMyPanditTitle")}
          </Text>

          <Text style={styles.primaryPanditDescription}>
            {t("bookMyPanditDescription")}
          </Text>

          {/* REAL-TIME PANDIT AVAILABILITY */}
          <View style={styles.livePanditAvailability}>
            <View style={styles.livePanditStatusRow}>
              <View style={styles.livePanditSignal}>
                {panditAvailability?.live &&
                !panditAvailabilityError ? (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.livePanditPulseRing,
                      livePulseStyle,
                    ]}
                  />
                ) : null}

                <View
                  style={[
                    styles.livePanditDot,
                    panditAvailabilityError &&
                      !panditAvailability
                      ? styles.livePanditDotMuted
                      : null,
                  ]}
                />
              </View>

              <Text style={styles.livePanditCount}>
                {panditAvailabilityLoading &&
                !panditAvailability
                  ? t("panditAvailabilityChecking")
                  : panditAvailability
                    ? `${panditAvailability.availableNow} ${
                        panditAvailability.availableNow === 1
                          ? t("panditSingular")
                          : t("panditPlural")
                      } ${t("availableNow")}`
                    : t("liveAvailabilityUpdating")}
              </Text>

              {panditAvailability?.live &&
              !panditAvailabilityError ? (
                <View style={styles.livePanditBadge}>
                  <Text style={styles.livePanditBadgeText}>
                    {t("live")}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.livePanditMetaRow}>
              <Ionicons
                name="location-outline"
                size={13}
                color="#FFD8AF"
              />

              <Text style={styles.livePanditMeta}>
                {customerCity}
                {panditAvailability
                  ? ` · ${panditAvailability.verifiedServingArea} ${t("verifiedServingArea")}`
                  : ""}
              </Text>
            </View>

            {panditAvailabilityError &&
            panditAvailability ? (
              <Text style={styles.livePanditRefreshNote}>
                {t("reconnectingLiveAvailability")}
              </Text>
            ) : null}
          </View>

          <View style={styles.primaryPanditBenefits}>
            <View style={styles.primaryBenefit}>
              <Ionicons
                name="shield-checkmark-outline"
                size={13}
                color="#FFE2BC"
              />
              <Text style={styles.primaryBenefitText}>
                {t("verifiedPanditsTag")}
              </Text>
            </View>

            <View style={styles.primaryBenefit}>
              <Ionicons
                name="home-outline"
                size={13}
                color="#FFE2BC"
              />
              <Text style={styles.primaryBenefitText}>
                {t("atHomeTag")}
              </Text>
            </View>

            <View style={styles.primaryBenefit}>
              <Ionicons
                name="language-outline"
                size={13}
                color="#FFE2BC"
              />
              <Text style={styles.primaryBenefitText}>
                {t("multipleLanguagesTag")}
              </Text>
            </View>
          </View>

          <View style={styles.primaryPanditCta}>
            <View>
              <Text style={styles.primaryPanditCtaSmall}>
                {t("verifiedPanditService")}
              </Text>

              <Text style={styles.primaryPanditCtaText}>
                {t("bookAPandit")}
              </Text>
            </View>

            <View style={styles.primaryPanditArrow}>
              <Ionicons
                name="arrow-forward"
                size={19}
                color="#A63112"
              />
            </View>
          </View>
        </Pressable>
        </View>

        {/* {t("todaysDarshan")} */}
        <View style={styles.heroContainer}>
          <View style={styles.heroHeading}>
            <View>
              <Text style={styles.eyebrow}>
                {t("todaysDarshan")}
              </Text>
              <Text style={styles.heroHeadingTitle}>
                {t("divineDarshan")}
              </Text>
            </View>

            <Pressable
              onPress={() => go("/temples")}
              style={styles.seeAll}
            >
              <Text style={styles.seeAllText}>
                {t("allMandirs")}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={15}
                color="#E94B00"
              />
            </Pressable>
          </View>

          <Pressable
            style={styles.hero}
            onPress={() =>
              go("/temple/kashi-vishwanath")
            }
          >
            <Image
              source={kashi}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />

            <LinearGradient
              colors={[
                "rgba(27,8,3,0.03)",
                "rgba(31,8,2,0.15)",
                "rgba(38,7,2,0.88)",
              ]}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.heroBadgeText}>
                {t("todaysDarshan")}
              </Text>
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.heroMantra}>
                ॐ नमः शिवाय
              </Text>

              <Text style={styles.heroTemple}>
                {t("kashiVishwanath")}
              </Text>

              <View style={styles.heroMeta}>
                <Ionicons
                  name="location"
                  size={13}
                  color="#FFD5B0"
                />
                <Text style={styles.heroMetaText}>
                  {t("varanasi")}
                </Text>
              </View>

              <View style={styles.heroBottom}>
                <View>
                  <Text style={styles.heroOffering}>
                    {t("darshanPoojaSankalp")}
                  </Text>
                </View>

                <View style={styles.heroArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </View>

        {/* DIVYAARPAN PURPOSE */}
        <View style={styles.purposeSection}>
          <View style={styles.purposeTopRow}>
            <View style={styles.purposeOm}>
              <Text style={styles.purposeOmText}>
                ॐ
              </Text>
            </View>

            <View style={styles.purposeTopCopy}>
              <Text style={styles.purposeEyebrow}>
                {t("ourPurpose")}
              </Text>

              <Text style={styles.purposeMini}>
                {t("ourPurpose")}
              </Text>
            </View>
          </View>

          <Text style={styles.purposeTitle}>
            आपकी श्रद्धा और परंपरा से
            {"\n"}जुड़ने का एक विश्वसनीय माध्यम
          </Text>

          <Text style={styles.purposeEnglishTitle}>
            {t("purposeFaithTitle")}
          </Text>

          <Text style={styles.purposeDescription}>
            DivyaArpan का उद्देश्य मंदिर, पंडित और
            श्रद्धालु के बीच एक विश्वसनीय डिजिटल सेतु
            बनाना है — ताकि पूजा और धार्मिक सेवाएँ सरल,
            पारदर्शी और सभी के लिए सुलभ हों।
          </Text>

          <View style={styles.purposeDivider} />

          <View style={styles.purposePromises}>
            <View style={styles.purposePromise}>
              <View style={styles.purposePromiseIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#B73B12"
                />
              </View>

              <View style={styles.purposePromiseCopy}>
                <Text style={styles.purposePromiseHindi}>
                  {t("trust")}
                </Text>

                <Text style={styles.purposePromiseTitle}>
                  {t("trustedConnections")}
                </Text>

                <Text style={styles.purposePromiseText}>
                  सत्यापित पंडित और विश्वसनीय धार्मिक
                  सेवाओं से जुड़ने का माध्यम।
                </Text>
              </View>
            </View>

            <View style={styles.purposePromise}>
              <View style={styles.purposePromiseIcon}>
                <Ionicons
                  name="sparkles-outline"
                  size={20}
                  color="#B73B12"
                />
              </View>

              <View style={styles.purposePromiseCopy}>
                <Text style={styles.purposePromiseHindi}>
                  {t("simplicity")}
                </Text>

                <Text style={styles.purposePromiseTitle}>
                  {t("simpleDevotionalAccess")}
                </Text>

                <Text style={styles.purposePromiseText}>
                  पंडित खोजने से लेकर मंदिर पूजा तक,
                  धार्मिक सेवाओं तक सरल {t("access")}।
                </Text>
              </View>
            </View>

            <View style={styles.purposePromise}>
              <View style={styles.purposePromiseIcon}>
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color="#B73B12"
                />
              </View>

              <View style={styles.purposePromiseCopy}>
                <Text style={styles.purposePromiseHindi}>
                  {t("access")}
                </Text>

                <Text style={styles.purposePromiseTitle}>
                  {t("faithBeyondDistance")}
                </Text>

                <Text style={styles.purposePromiseText}>
                  आप घर पर हों, दूसरे शहर में या विदेश में —
                  अपनी आस्था और परंपरा से जुड़े रहें।
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.purposeStoryButton}
            onPress={() => go("/profile")}
          >
            <View>
              <Text style={styles.purposeStorySmall}>
                DIVYAARPAN
              </Text>

              <Text style={styles.purposeStoryText}>
                जानिए {t("ourPurpose")}
              </Text>
            </View>

            <View style={styles.purposeStoryArrow}>
              <Ionicons
                name="arrow-forward"
                size={17}
                color="#A83312"
              />
            </View>
          </Pressable>
        </View>

        {/* PRIMARY + EXPLAINABLE SERVICES */}
        <View style={styles.quickSection}>
          <View style={styles.sectionHeading}>
            <Text style={styles.eyebrow}>
              {t("yourServices")}
            </Text>

            <Text style={styles.sectionTitle}>
              {t("whatWouldYouLike")}
            </Text>
          </View>

          {/* SECONDARY SERVICES */}
          <View style={styles.explainableServices}>

            {/* MANDIR POOJA */}
            <Pressable
              style={styles.explainableServiceCard}
              onPress={() => go("/temples")}
            >
              <View
                style={[
                  styles.explainableServiceIcon,
                  { backgroundColor: "#FFF0E5" },
                ]}
              >
                <Ionicons
                  name="business-outline"
                  size={24}
                  color="#B63B0C"
                />
              </View>

              <View style={styles.explainableServiceCopy}>
                <Text style={styles.explainableServiceTitle}>
                  {t("mandirPooja")}
                </Text>

                <Text style={styles.explainableServiceDescription}>
                  {t("mandirPoojaDetailedDescription")}
                </Text>

                <View style={styles.serviceSteps}>
                  <Text style={styles.serviceStepsText}>
                    {t("chooseMandirStep")}
                  </Text>
                  <Ionicons name="chevron-forward" size={11} color="#B8907C" />
                  <Text style={styles.serviceStepsText}>
                    {t("selectPoojaStep")}
                  </Text>
                  <Ionicons name="chevron-forward" size={11} color="#B8907C" />
                  <Text style={styles.serviceStepsText}>
                    {t("addSankalpStep")}
                  </Text>
                  <Ionicons name="chevron-forward" size={11} color="#B8907C" />
                  <Text style={styles.serviceStepsText}>
                    {t("bookStep")}
                  </Text>
                </View>

                <View style={styles.serviceBestFor}>
                  <Ionicons
                    name="sparkles-outline"
                    size={12}
                    color="#B63B0C"
                  />
                  <Text style={styles.serviceBestForText}>
                    {t("mandirPoojaBestFor")}
                  </Text>
                </View>

                <View style={styles.explainableServiceAction}>
                  <Text style={styles.explainableOrangeAction}>
                    {t("exploreMandirs")}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="#D94A12"
                  />
                </View>
              </View>
            </Pressable>

            {/* POOJA FROM HOME */}
            <Pressable
              style={styles.explainableServiceCard}
              onPress={() => go("/poojas")}
            >
              <View
                style={[
                  styles.explainableServiceIcon,
                  { backgroundColor: "#FFF5DF" },
                ]}
              >
                <Ionicons
                  name="videocam-outline"
                  size={24}
                  color="#B66C12"
                />
              </View>

              <View style={styles.explainableServiceCopy}>
                <Text style={styles.explainableServiceTitle}>
                  {t("poojaFromHome")}
                </Text>

                <Text style={styles.explainableServiceDescription}>
                  {t("poojaFromHomeDetailedDescription")}
                </Text>

                <View style={styles.serviceSteps}>
                  <Text style={styles.serviceStepsText}>
                    {t("choosePoojaStep")}
                  </Text>
                  <Ionicons name="chevron-forward" size={11} color="#B8907C" />
                  <Text style={styles.serviceStepsText}>
                    {t("shareSankalpStep")}
                  </Text>
                  <Ionicons name="chevron-forward" size={11} color="#B8907C" />
                  <Text style={styles.serviceStepsText}>
                    {t("poojaPerformedStep")}
                  </Text>
                </View>

                <View style={styles.serviceBestFor}>
                  <Ionicons
                    name="home-outline"
                    size={12}
                    color="#B66C12"
                  />
                  <Text style={styles.serviceBestForText}>
                    {t("noMandirVisitRequired")}
                  </Text>
                </View>

                <View style={styles.explainableServiceAction}>
                  <Text style={styles.explainableGoldAction}>
                    {t("bookRemotePooja")}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="#B66C12"
                  />
                </View>
              </View>
            </Pressable>

            {/* POOJA AT HOME */}
            <Pressable
              style={styles.explainableServiceCard}
              onPress={() => go("/bookings")}
            >
              <View
                style={[
                  styles.explainableServiceIcon,
                  { backgroundColor: "#F1F6E9" },
                ]}
              >
                <Ionicons
                  name="home-outline"
                  size={24}
                  color="#627B32"
                />
              </View>

              <View style={styles.explainableServiceCopy}>
                <Text style={styles.explainableServiceTitle}>
                  {t("poojaAtHome")}
                </Text>

                <Text style={styles.explainableServiceDescription}>
                  {t("poojaAtHomeDescription")}
                </Text>

                <View style={styles.serviceSteps}>
                  <Text style={styles.serviceStepsText}>
                    Choose Pooja
                  </Text>
                  <Ionicons name="chevron-forward" size={11} color="#B8907C" />
                  <Text style={styles.serviceStepsText}>
                    {t("addLocationStep")}
                  </Text>
                  <Ionicons name="chevron-forward" size={11} color="#B8907C" />
                  <Text style={styles.serviceStepsText}>
                    {t("matchPanditStep")}
                  </Text>
                </View>

                <View style={styles.serviceBestFor}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={12}
                    color="#627B32"
                  />
                  <Text style={styles.serviceBestForText}>
                    {t("poojaAtHomeBestFor")}
                  </Text>
                </View>

                <View style={styles.explainableServiceAction}>
                  <Text style={styles.explainableGreenAction}>
                    {t("findAPandit")}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="#627B32"
                  />
                </View>
              </View>
            </Pressable>

            {/* {t("dailyBhaktiEyebrow")} */}
            <Pressable
              style={styles.explainableServiceCard}
              onPress={() => go("/poojas")}
            >
              <View
                style={[
                  styles.explainableServiceIcon,
                  { backgroundColor: "#FBEAF1" },
                ]}
              >
                <Ionicons
                  name="flower-outline"
                  size={24}
                  color="#943B61"
                />
              </View>

              <View style={styles.explainableServiceCopy}>
                <Text style={styles.explainableServiceTitle}>
                  {t("dailyBhakti")}
                </Text>

                <Text style={styles.explainableServiceDescription}>
                  {t("dailyBhaktiDetailedDescription")}
                </Text>

                <View style={styles.dailyBhaktiFeatures}>
                  <Text style={styles.dailyBhaktiFeatureText}>
                    {t("aarti")}
                  </Text>
                  <Text style={styles.dailyBhaktiFeatureDot}>•</Text>
                  <Text style={styles.dailyBhaktiFeatureText}>
                    {t("chalisa")}
                  </Text>
                  <Text style={styles.dailyBhaktiFeatureDot}>•</Text>
                  <Text style={styles.dailyBhaktiFeatureText}>
                    {t("mantra")}
                  </Text>
                  <Text style={styles.dailyBhaktiFeatureDot}>•</Text>
                  <Text style={styles.dailyBhaktiFeatureText}>
                    {t("bhajan")}
                  </Text>
                </View>

                <View style={styles.serviceBestFor}>
                  <Ionicons
                    name="heart-outline"
                    size={12}
                    color="#943B61"
                  />
                  <Text style={styles.serviceBestForText}>
                    {t("dailyBhaktiNoBooking")}
                  </Text>
                </View>

                <View style={styles.explainableServiceAction}>
                  <Text style={styles.explainablePinkAction}>
                    {t("startDailyBhakti")}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="#943B61"
                  />
                </View>
              </View>
            </Pressable>

          </View>
        </View>

        {/* {t("dailyBhaktiEyebrow")} */}
        <View style={styles.bhaktiSection}>
          <LinearGradient
            colors={["#7B2117", "#4E1512"]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.bhaktiHeader}>
            <View>
              <Text style={styles.bhaktiEyebrow}>
                {t("dailyBhaktiEyebrow")}
              </Text>
              <Text style={styles.bhaktiTitle}>
                {t("dailyBhaktiSectionTitle")}
              </Text>
            </View>

            <View style={styles.bhaktiOm}>
              <Text style={styles.bhaktiOmText}>
                ॐ
              </Text>
            </View>
          </View>

          <Text style={styles.bhaktiDescription}>
            अपने दिन की शुरुआत आरती, मंत्र और
            पवित्र पाठ के साथ करें।
          </Text>

          <View style={styles.bhaktiItems}>
            {bhaktiItems.map((item) => (
              <Pressable
                key={item.key}
                style={styles.bhaktiCard}
                onPress={() => go("/poojas")}
              >
                <View style={styles.bhaktiIcon}>
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color="#FFD092"
                  />
                </View>

                <Text style={styles.bhaktiHindi}>
                  {t(item.key)}
                </Text>

                <Text style={styles.bhaktiEnglish}>
                  {t(item.key)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.nowPlaying}
            onPress={() => go("/poojas")}
          >
            <View style={styles.playButton}>
              <Ionicons
                name="play"
                size={17}
                color="#7B2117"
              />
            </View>

            <View style={styles.playCopy}>
              <Text style={styles.playLabel}>
                {t("todaysPaath")}
              </Text>
              <Text style={styles.playTitle}>
                {t("hanumanChalisa")}
              </Text>
            </View>

            <View style={styles.wave}>
              <View style={styles.wave1} />
              <View style={styles.wave2} />
              <View style={styles.wave3} />
              <View style={styles.wave4} />
              <View style={styles.wave2} />
            </View>
          </Pressable>
        </View>

        {/* POPULAR POOJAS */}
        <View style={styles.poojaSection}>
          <View style={styles.sectionHeadingRow}>
            <View>
              <Text style={styles.eyebrow}>
                {t("popularPoojas")}
              </Text>
              <Text style={styles.sectionTitle}>
                {t("sacredPoojas")}
              </Text>
            </View>

            <Pressable
              style={styles.seeAll}
              onPress={() => go("/poojas")}
            >
              <Text style={styles.seeAllText}>
                {t("seeAll")}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={15}
                color="#E94B00"
              />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.poojaScroller}
          >
            {poojas.map((item, index) => (
              <Pressable
                key={item.titleKey}
                style={[
                  styles.poojaCard,
                  index === 0 &&
                    styles.poojaCardFeatured,
                ]}
                onPress={() => go("/poojas")}
              >
                <View
                  style={[
                    styles.poojaIcon,
                    index === 0 &&
                      styles.poojaIconFeatured,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={25}
                    color={
                      index === 0
                        ? "#FFFFFF"
                        : "#E94B00"
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.poojaHindi,
                    index === 0 &&
                      styles.poojaFeaturedText,
                  ]}
                >
                  {t(item.titleKey)}
                </Text>

                <Text
                  style={[
                    styles.poojaTitle,
                    index === 0 &&
                      styles.poojaFeaturedText,
                  ]}
                >
                  {t(item.titleKey)}
                </Text>

                <Text
                  style={[
                    styles.poojaDeity,
                    index === 0 &&
                      styles.poojaFeaturedMuted,
                  ]}
                >
                  {t(item.deityKey)}
                </Text>

                <View style={styles.poojaFooter}>
                  <Text
                    style={[
                      styles.poojaBook,
                      index === 0 &&
                        styles.poojaFeaturedAccent,
                    ]}
                  >
                    {t("bookPooja")}
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={
                      index === 0
                        ? "#FFD0A9"
                        : "#E94B00"
                    }
                  />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* MANDIRS */}
        <View style={styles.mandirSection}>
          <View style={styles.sectionHeadingRow}>
            <View>
              <Text style={styles.eyebrow}>
                {t("sacredPlaces")}
              </Text>
              <Text style={styles.sectionTitle}>
                {t("sacredMandirs")}
              </Text>
            </View>

            <Pressable
              style={styles.seeAll}
              onPress={() => go("/temples")}
            >
              <Text style={styles.seeAllText}>
                Explore
              </Text>
              <Ionicons
                name="arrow-forward"
                size={15}
                color="#E94B00"
              />
            </Pressable>
          </View>

          <View style={styles.mandirGrid}>
            <TempleCard
              image={siddhivinayak}
              name={t("siddhivinayak")}
              place={t("mumbai")}
            />
            <TempleCard
              image={tirupati}
              name={t("venkateshwar")}
              place={t("tirupati")}
            />
          </View>
        </View>

        {/* PANDIT CTA */}
        <Pressable
          style={styles.panditCard}
          onPress={() => go("/bookings")}
        >
          <Image
            source={pandit}
            style={styles.panditImage}
            contentFit="cover"
          />

          <View style={styles.panditBody}>
            <View style={styles.verified}>
              <Ionicons
                name="shield-checkmark"
                size={14}
                color="#E94B00"
              />
              <Text style={styles.verifiedText}>
                {t("verifiedPandits")}
              </Text>
            </View>

            <Text style={styles.panditTitle}>
              पूजा के लिए{"\n"}विश्वसनीय पंडित
            </Text>

            <Text style={styles.panditCopy}>
              अपने घर या धार्मिक अनुष्ठान के लिए
              सत्यापित पंडित सेवा बुक करें।
            </Text>

            <View style={styles.panditButton}>
              <Text style={styles.panditButtonText}>
                Book My Pandit
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </View>
          </View>
        </Pressable>

        <View style={styles.endSpace} />
      </ScrollView>

      <Modal
        visible={languageOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageOpen(false)}
      >
        <View style={styles.languageModal}>
          <Pressable
            style={styles.languageBackdrop}
            onPress={() => setLanguageOpen(false)}
          />

          <View style={styles.languageSheet}>
            <View style={styles.languageHandle} />

            <View style={styles.languageSheetHeader}>
              <View>
                <Text style={styles.languageSheetEyebrow}>
                  DIVYAARPAN
                </Text>

                <Text style={styles.languageSheetTitle}>
                  {t("chooseLanguage")}
                </Text>

                <Text style={styles.languageSheetSubtitle}>
                  अपनी भाषा चुनें
                </Text>
              </View>

              <Pressable
                style={styles.languageClose}
                onPress={() => setLanguageOpen(false)}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color="#4C2B20"
                />
              </Pressable>
            </View>

            <View style={styles.languageGrid}>
              {APP_LANGUAGES.map((item) => {
                const selected =
                  item.code === languageCode;

                return (
                  <Pressable
                    key={item.code}
                    style={[
                      styles.languageOption,
                      selected &&
                        styles.languageOptionSelected,
                    ]}
                    onPress={() =>
                      void chooseLanguage(item.code)
                    }
                  >
                    <View
                      style={[
                        styles.languageRadio,
                        selected &&
                          styles.languageRadioSelected,
                      ]}
                    >
                      {selected ? (
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color="#FFFFFF"
                        />
                      ) : null}
                    </View>

                    <View style={styles.languageOptionCopy}>
                      <Text
                        style={[
                          styles.languageNative,
                          selected &&
                            styles.languageNativeSelected,
                        ]}
                      >
                        {item.nativeLabel}
                      </Text>

                      <Text style={styles.languageEnglish}>
                        {item.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.languageTrust}>
              <Ionicons
                name="globe-outline"
                size={16}
                color="#C64310"
              />
              <Text style={styles.languageTrustText}>
                {t("languageAnytime")}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TempleCard({
  image,
  name,
  place,
}: {
  image: number;
  name: string;
  place: string;
}) {
  return (
    <Pressable
      style={styles.templeCard}
      onPress={() => go("/temples")}
    >
      <Image
        source={image}
        style={styles.templeImage}
        contentFit="cover"
      />

      <View style={styles.templeBody}>
        <Text
          numberOfLines={1}
          style={styles.templeName}
        >
          {name}
        </Text>

        <View style={styles.templeLocation}>
          <Ionicons
            name="location-outline"
            size={12}
            color="#E94B00"
          />
          <Text style={styles.templePlace}>
            {place}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9F4",
  },

  content: {
    paddingBottom: 115,
  },

  header: {
    paddingHorizontal: 17,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3DED0",
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F45112",
    shadowColor: "#E94B00",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  logoOm: {
    fontFamily: DivyaTheme.fonts.displayBold,
    fontSize: 27,
    color: "#FFFFFF",
  },

  brandName: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 20,
    letterSpacing: 0.7,
    color: "#E94B00",
  },

  brandTagline: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 9,
    color: "#75483A",
  },

  headerButtons: {
    flexDirection: "row",
    gap: 7,
  },

  headerButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5ED",
  },

  languageButton: {
    height: 39,
    maxWidth: 104,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#F3D2BE",
    backgroundColor: "#FFF5ED",
  },

  languageButtonText: {
    maxWidth: 58,
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 9,
    color: "#B83B0C",
  },

  languageModal: {
    flex: 1,
    justifyContent: "flex-end",
  },

  languageBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(35, 16, 9, 0.48)",
  },

  languageSheet: {
    width: "100%",
    maxHeight: "82%",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#FFFDF9",
    shadowColor: "#2D130B",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 24,
  },

  languageHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E4CFC1",
  },

  languageSheetHeader: {
    marginTop: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  languageSheetEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: "#E94B00",
  },

  languageSheetTitle: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 22,
    color: "#2C1811",
  },

  languageSheetSubtitle: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.hindiSemiBold,
    fontSize: 12,
    color: "#84685D",
  },

  languageClose: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "#FFF0E6",
  },

  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 9,
  },

  languageOption: {
    width: "48.7%",
    minHeight: 67,
    paddingHorizontal: 11,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECDDD4",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },

  languageOptionSelected: {
    borderColor: "#F45112",
    backgroundColor: "#FFF1E7",
  },

  languageRadio: {
    width: 24,
    height: 24,
    marginRight: 9,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D7BCAF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  languageRadioSelected: {
    borderColor: "#F45112",
    backgroundColor: "#F45112",
  },

  languageOptionCopy: {
    flex: 1,
  },

  languageNative: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 12,
    color: "#382018",
  },

  languageNativeSelected: {
    color: "#C53D0A",
  },

  languageEnglish: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 8,
    color: "#967A70",
  },

  languageTrust: {
    marginTop: 17,
    minHeight: 42,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 13,
    backgroundColor: "#FFF3E9",
  },

  languageTrustText: {
    flex: 1,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 9,
    color: "#76584C",
  },

  welcomeRow: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  welcomeHindi: {
    fontFamily: DivyaTheme.fonts.hindiBold,
    fontSize: 13,
    color: "#3B2118",
  },

  welcomeText: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.hindiMedium,
    fontSize: 10,
    color: "#8A7066",
  },

  panchangPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#FFF0E4",
  },

  panchangPillText: {
    fontFamily: DivyaTheme.fonts.hindiBold,
    fontSize: 10,
    color: "#B63B0C",
  },

  heroContainer: {
    paddingHorizontal: 14,
    paddingTop: 20,
  },

  heroHeading: {
    marginBottom: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  eyebrow: {
    fontFamily: DivyaTheme.fonts.hindiBold,
    fontSize: 10,
    letterSpacing: 0.65,
    color: "#E94B00",
  },

  heroHeadingTitle: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.hindiExtraBold,
    fontSize: 22,
    color: "#2C1811",
  },

  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingBottom: 2,
  },

  seeAllText: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 10,
    color: "#E94B00",
  },

  hero: {
    height: 265,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#5A1C14",
    shadowColor: "#572014",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },

  heroBadge: {
    position: "absolute",
    left: 14,
    top: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "rgba(58,16,7,0.78)",
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFAD32",
  },

  heroBadgeText: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 8,
    letterSpacing: 0.55,
    color: "#FFFFFF",
  },

  heroCopy: {
    marginTop: "auto",
    padding: 16,
  },

  heroMantra: {
    fontFamily: DivyaTheme.fonts.hindiSemiBold,
    fontSize: 12,
    color: "#FFD19A",
  },

  heroTemple: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.hindiExtraBold,
    fontSize: 27,
    color: "#FFFFFF",
  },

  heroMeta: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  heroMetaText: {
    fontFamily: DivyaTheme.fonts.hindiSemiBold,
    fontSize: 9,
    color: "#F7D8C7",
  },

  heroBottom: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroOffering: {
    fontFamily: DivyaTheme.fonts.hindiBold,
    fontSize: 10,
    color: "#FFFFFF",
  },

  heroArrow: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F45112",
  },

  purposeSection: {
    marginHorizontal: 14,
    marginTop: 20,
    padding: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#EBCFBC",
    backgroundColor: "#FFF9F1",
    shadowColor: "#6B301D",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  purposeTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  purposeOm: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F45112",
  },

  purposeOmText: {
    fontFamily: DivyaTheme.fonts.hindiExtraBold,
    fontSize: 23,
    color: "#FFFFFF",
  },

  purposeTopCopy: {
    marginLeft: 11,
  },

  purposeEyebrow: {
    fontFamily: DivyaTheme.fonts.hindiExtraBold,
    fontSize: 14,
    color: "#A93111",
  },

  purposeMini: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 7,
    letterSpacing: 1.4,
    color: "#B98A72",
  },

  purposeTitle: {
    marginTop: 17,
    fontFamily: DivyaTheme.fonts.hindiExtraBold,
    fontSize: 22,
    lineHeight: 32,
    color: "#2C1811",
  },

  purposeEnglishTitle: {
    marginTop: 5,
    fontFamily: DivyaTheme.fonts.displayBold,
    fontSize: 18,
    lineHeight: 23,
    color: "#B23A13",
  },

  purposeDescription: {
    marginTop: 11,
    fontFamily: DivyaTheme.fonts.hindiMedium,
    fontSize: 11,
    lineHeight: 20,
    color: "#735E54",
  },

  purposeDivider: {
    height: 1,
    marginTop: 18,
    marginBottom: 4,
    backgroundColor: "#EED9CB",
  },

  purposePromises: {
    marginTop: 3,
  },

  purposePromise: {
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#F1E1D6",
  },

  purposePromiseIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0E4",
  },

  purposePromiseCopy: {
    flex: 1,
    marginLeft: 11,
  },

  purposePromiseHindi: {
    fontFamily: DivyaTheme.fonts.hindiExtraBold,
    fontSize: 12,
    color: "#A83212",
  },

  purposePromiseTitle: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 10,
    color: "#342019",
  },

  purposePromiseText: {
    marginTop: 3,
    fontFamily: DivyaTheme.fonts.hindiMedium,
    fontSize: 9,
    lineHeight: 16,
    color: "#806A61",
  },

  purposeStoryButton: {
    minHeight: 55,
    marginTop: 15,
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 17,
    backgroundColor: "#FCE8D9",
  },

  purposeStorySmall: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 7,
    letterSpacing: 1,
    color: "#C37656",
  },

  purposeStoryText: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.hindiExtraBold,
    fontSize: 12,
    color: "#742313",
  },

  purposeStoryArrow: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD5B3",
  },

  quickSection: {
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 25,
  },

  sectionHeading: {
    marginBottom: 13,
  },

  sectionHeadingRow: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  sectionTitle: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 22,
    lineHeight: 27,
    color: "#2C1811",
  },

  primaryPanditCard: {
    position: "relative",
    overflow: "hidden",
    minHeight: 320,
    padding: 18,
    borderRadius: 25,
    shadowColor: "#6D1F10",
    shadowOpacity: 0.24,
    shadowRadius: 17,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    elevation: 9,
  },

  primaryPanditGlowOne: {
    position: "absolute",
    right: -55,
    top: -70,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(255,190,103,0.13)",
  },

  primaryPanditGlowTwo: {
    position: "absolute",
    left: -75,
    bottom: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,221,177,0.06)",
  },

  primaryPanditTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  primaryPanditIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD7A6",
  },

  primaryPanditBadge: {
    maxWidth: "58%",
    minHeight: 31,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,220,177,0.28)",
    backgroundColor: "rgba(255,255,255,0.09)",
  },

  primaryPanditBadgeText: {
    flexShrink: 1,
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 8,
    color: "#FFE2BD",
  },

  primaryPanditLabel: {
    marginTop: 20,
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 8,
    letterSpacing: 1.2,
    color: "#FFBC73",
  },

  primaryPanditTitle: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 28,
    lineHeight: 34,
    color: "#FFFFFF",
  },

  primaryPanditDescription: {
    marginTop: 8,
    maxWidth: 390,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 18,
    color: "#F7D8CB",
  },

  topPanditSection: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 22,
  },

  topLivePanditCard: {
    position: "relative",
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 18,
    minHeight: 76,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F4CFAD",
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#7C2D12",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  topLivePanditCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  topLivePanditIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFDDB8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  topLivePanditContent: {
    flex: 1,
    minWidth: 0,
  },

  topLivePanditTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  topLivePanditDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2DBE69",
    marginRight: 7,
  },

  topLivePanditDotMuted: {
    backgroundColor: "#C9A998",
  },

  topLivePanditTitle: {
    flexShrink: 1,
    color: DivyaTheme.colors.ink,
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 12,
    lineHeight: 17,
  },

  topLiveBadge: {
    marginLeft: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: "#E5F7EA",
    borderWidth: 1,
    borderColor: "#A9DCB7",
  },

  topLiveBadgeText: {
    color: "#168743",
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 7,
    letterSpacing: 1,
  },

  topLivePanditMeta: {
    marginTop: 4,
    color: "#8B5A45",
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9.5,
    lineHeight: 14,
  },

  topLivePanditAction: {
    width: 34,
    height: 34,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: "#FFF8EF",
    borderWidth: 1,
    borderColor: "#F1C79F",
    alignItems: "center",
    justifyContent: "center",
  },

  livePanditAvailability: {
    marginTop: 17,
    marginBottom: 17,
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,226,188,0.20)",
  },

  livePanditStatusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  livePanditSignal: {
    width: 20,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginRight: 3,
  },

  livePanditPulseRing: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(45,255,125,0.28)",
    borderWidth: 1,
    borderColor: "#58FF98",
  },

  livePanditDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#55FF91",
    borderWidth: 1,
    borderColor: "#D1FFE1",
  },

  livePanditDotMuted: {
    backgroundColor: "#D8B9A7",
  },

  livePanditCount: {
    flex: 1,
    color: "#FFF7ED",
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 12,
    lineHeight: 17,
  },

  livePanditBadge: {
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "rgba(112,226,154,0.16)",
    borderWidth: 1,
    borderColor: "rgba(112,226,154,0.42)",
  },

  livePanditBadgeText: {
    color: "#9AF0B8",
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 8,
    letterSpacing: 1.2,
  },

  livePanditMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  livePanditMeta: {
    marginLeft: 5,
    color: "#FFD8AF",
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
  },

  livePanditRefreshNote: {
    marginTop: 5,
    color: "#FFD8AF",
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 13,
  },

  primaryPanditBenefits: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  primaryBenefit: {
    minHeight: 29,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.09)",
  },

  primaryBenefitText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 8,
    color: "#FFE4C7",
  },

  primaryPanditCta: {
    marginTop: 18,
    minHeight: 54,
    paddingLeft: 15,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 17,
    backgroundColor: "#FFF2DE",
  },

  primaryPanditCtaSmall: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 7,
    letterSpacing: 0.8,
    color: "#C26A45",
  },

  primaryPanditCtaText: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 12,
    color: "#742214",
  },

  primaryPanditArrow: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD3A0",
  },

  explainableServices: {
    marginTop: 12,
    gap: 9,
  },

  explainableServiceCard: {
    minHeight: 178,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEDDD2",
    backgroundColor: "#FFFFFF",
    shadowColor: "#63311D",
    shadowOpacity: 0.05,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  explainableServiceIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  explainableServiceCopy: {
    flex: 1,
    marginLeft: 13,
  },

  explainableServiceTitle: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 14,
    lineHeight: 19,
    color: "#2C1811",
  },

  explainableServiceDescription: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 15,
    color: "#806A61",
  },

  explainableServiceAction: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  explainableOrangeAction: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 9,
    color: "#D94A12",
  },

  explainableGoldAction: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 9,
    color: "#B66C12",
  },

  explainablePinkAction: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 9,
    color: "#943B61",
  },

  serviceSteps: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    rowGap: 4,
  },

  serviceStepsText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 8.5,
    lineHeight: 13,
    color: "#65483B",
  },

  serviceBestFor: {
    marginTop: 9,
    paddingHorizontal: 9,
    paddingVertical: 6,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
    backgroundColor: "#FFF8F2",
  },

  serviceBestForText: {
    flexShrink: 1,
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 8.5,
    lineHeight: 13,
    color: "#72564A",
  },

  explainableGreenAction: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 9,
    color: "#627B32",
  },

  dailyBhaktiFeatures: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
  },

  dailyBhaktiFeatureText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 8.5,
    color: "#71485A",
  },

  dailyBhaktiFeatureDot: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 8,
    color: "#C58BA5",
  },

  bhaktiSection: {
    position: "relative",
    overflow: "hidden",
    marginHorizontal: 12,
    borderRadius: 24,
    padding: 17,
  },

  bhaktiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bhaktiEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 8,
    letterSpacing: 1.1,
    color: "#FFB46E",
  },

  bhaktiTitle: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.hindiExtraBold,
    fontSize: 24,
    color: "#FFFFFF",
  },

  bhaktiOm: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,207,147,0.28)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  bhaktiOmText: {
    fontFamily: DivyaTheme.fonts.displayBold,
    fontSize: 24,
    color: "#FFD093",
  },

  bhaktiDescription: {
    marginTop: 5,
    maxWidth: 300,
    fontFamily: DivyaTheme.fonts.hindiMedium,
    fontSize: 10,
    lineHeight: 16,
    color: "#EBCBC1",
  },

  bhaktiItems: {
    marginTop: 15,
    flexDirection: "row",
    gap: 6,
  },

  bhaktiCard: {
    flex: 1,
    minHeight: 91,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,211,161,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  bhaktiIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,183,98,0.12)",
  },

  bhaktiHindi: {
    marginTop: 6,
    fontFamily: DivyaTheme.fonts.hindiBold,
    fontSize: 9,
    color: "#FFFFFF",
  },

  bhaktiEnglish: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 7,
    color: "#D8B6AD",
  },

  nowPlaying: {
    marginTop: 13,
    minHeight: 61,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.09)",
  },

  playButton: {
    width: 37,
    height: 37,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD19B",
  },

  playCopy: {
    flex: 1,
    marginLeft: 10,
  },

  playLabel: {
    fontFamily: DivyaTheme.fonts.hindiSemiBold,
    fontSize: 8,
    color: "#EABBA9",
  },

  playTitle: {
    marginTop: 1,
    fontFamily: DivyaTheme.fonts.hindiBold,
    fontSize: 11,
    color: "#FFFFFF",
  },

  wave: {
    height: 27,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  wave1: {
    width: 2,
    height: 9,
    borderRadius: 2,
    backgroundColor: "#FFC27D",
  },

  wave2: {
    width: 2,
    height: 17,
    borderRadius: 2,
    backgroundColor: "#FFC27D",
  },

  wave3: {
    width: 2,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#FFC27D",
  },

  wave4: {
    width: 2,
    height: 13,
    borderRadius: 2,
    backgroundColor: "#FFC27D",
  },

  poojaSection: {
    paddingTop: 27,
    paddingBottom: 8,
  },

  poojaSectionPadding: {
    paddingHorizontal: 14,
  },

  poojaScroller: {
    paddingHorizontal: 14,
    gap: 10,
    paddingBottom: 8,
  },

  poojaCard: {
    width: 180,
    minHeight: 202,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EFDDD0",
    backgroundColor: "#FFFFFF",
  },

  poojaCardFeatured: {
    backgroundColor: "#8B291C",
    borderColor: "#8B291C",
  },

  poojaIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0E5",
  },

  poojaIconFeatured: {
    backgroundColor: "#F45112",
  },

  poojaHindi: {
    marginTop: 16,
    fontFamily: DivyaTheme.fonts.hindiBold,
    fontSize: 11,
    color: "#4B2C21",
  },

  poojaTitle: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 16,
    color: "#28160F",
  },

  poojaDeity: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    color: "#90776D",
  },

  poojaFooter: {
    marginTop: "auto",
    paddingTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  poojaBook: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 10,
    color: "#E94B00",
  },

  poojaFeaturedText: {
    color: "#FFFFFF",
  },

  poojaFeaturedMuted: {
    color: "#EBC5B8",
  },

  poojaFeaturedAccent: {
    color: "#FFD0A9",
  },

  mandirSection: {
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 26,
  },

  mandirGrid: {
    flexDirection: "row",
    gap: 10,
  },

  templeCard: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EFDDD0",
    backgroundColor: "#FFFFFF",
  },

  templeImage: {
    width: "100%",
    height: 130,
  },

  templeBody: {
    padding: 11,
  },

  templeName: {
    fontFamily: DivyaTheme.fonts.hindiBold,
    fontSize: 11,
    color: "#2C1811",
  },

  templeLocation: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  templePlace: {
    fontFamily: DivyaTheme.fonts.bodyMedium,
    fontSize: 9,
    color: "#866D63",
  },

  panditCard: {
    marginHorizontal: 14,
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#EFD7C5",
    backgroundColor: "#FFFFFF",
  },

  panditImage: {
    width: "100%",
    height: 225,
  },

  panditBody: {
    padding: 17,
  },

  verified: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#FFF0E5",
  },

  verifiedText: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 8,
    letterSpacing: 0.55,
    color: "#C33D0C",
  },

  panditTitle: {
    marginTop: 12,
    fontFamily: DivyaTheme.fonts.hindiExtraBold,
    fontSize: 27,
    lineHeight: 31,
    color: "#2C1811",
  },

  panditCopy: {
    marginTop: 7,
    fontFamily: DivyaTheme.fonts.hindiMedium,
    fontSize: 10,
    lineHeight: 17,
    color: "#786158",
  },

  panditButton: {
    marginTop: 15,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F45112",
  },

  panditButtonText: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 12,
    color: "#FFFFFF",
  },

  endSpace: {
    height: 28,
  },
});
