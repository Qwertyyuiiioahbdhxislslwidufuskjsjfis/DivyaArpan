import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { DivyaTheme } from "@/constants/divya-theme";

const hero = require("../../../assets/signature/atmosphere/home-hero.jpg");
const kashi = require("../../../assets/signature/temples/kashi-vishwanath.jpg");
const siddhivinayak = require("../../../assets/signature/temples/siddhivinayak.jpg");
const tirupati = require("../../../assets/signature/temples/tirupati-balaji.jpg");

function go(path: string) {
  Haptics.selectionAsync().catch(() => undefined);
  router.push(path as never);
}

const services = [
  {
    title: "Book a\nPandit",
    subtitle: "AT HOME OR VENUE",
    icon: "person-outline",
    route: "/bookings",
    tone: "burgundy",
  },
  {
    title: "Temple\nPooja",
    subtitle: "AT SACRED TEMPLES",
    icon: "business-outline",
    route: "/temples",
    tone: "ivory",
  },
  {
    title: "Offer\nArpan",
    subtitle: "PRAYERS & OFFERINGS",
    icon: "flower-outline",
    route: "/poojas",
    tone: "gold",
  },
  {
    title: "Ask a\nPandit",
    subtitle: "GUIDANCE & SUPPORT",
    icon: "chatbubble-ellipses-outline",
    route: "/bookings",
    tone: "ivory",
  },
] as const;

const temples = [
  {
    name: "Kashi Vishwanath",
    place: "VARANASI, UTTAR PRADESH",
    image: kashi,
    route: "/temple/kashi-vishwanath",
  },
  {
    name: "Siddhivinayak",
    place: "MUMBAI, MAHARASHTRA",
    image: siddhivinayak,
    route: "/temples",
  },
  {
    name: "Sri Venkateswara",
    place: "TIRUPATI, ANDHRA PRADESH",
    image: tirupati,
    route: "/temples",
  },
] as const;

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ImageBackground
          source={hero}
          resizeMode="cover"
          style={styles.hero}
        >
          <LinearGradient
            colors={[
              "rgba(255,248,235,0.10)",
              "rgba(255,239,205,0.20)",
              "rgba(40,18,12,0.18)",
              "rgba(39,18,13,0.66)",
            ]}
            locations={[0, 0.38, 0.72, 1]}
            style={styles.heroGradient}
          >
            <View style={styles.topBar}>
              <View style={styles.brandRow}>
                <View style={styles.brandMark}>
                  <Text style={styles.om}>ॐ</Text>
                </View>

                <View>
                  <Text style={styles.brand}>DIVYAARPAN</Text>
                  <Text style={styles.brandSub}>DEVOTION · CLOSER</Text>
                </View>
              </View>

              <View style={styles.topActions}>
                <Pressable style={styles.location}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={DivyaTheme.colors.vermilionDeep}
                  />
                  <Text style={styles.locationText}>Mumbai</Text>
                  <Ionicons
                    name="chevron-down"
                    size={13}
                    color={DivyaTheme.colors.ink}
                  />
                </Pressable>

                <Pressable style={styles.roundButton}>
                  <Ionicons
                    name="notifications-outline"
                    size={18}
                    color={DivyaTheme.colors.vermilionDeep}
                  />
                  <View style={styles.notificationDot} />
                </Pressable>

                <Pressable
                  style={styles.profileButton}
                  onPress={() => go("/profile")}
                >
                  <Ionicons
                    name="person"
                    size={18}
                    color={DivyaTheme.colors.vermilionDeep}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>
                A MORE MEANINGFUL TODAY
              </Text>

              <Text style={styles.heroTitle}>
                Begin your day{"\n"}with devotion.
              </Text>

              <Text style={styles.heroQuote}>
                “Faith makes the ordinary{"\n"}extraordinary.”
              </Text>
            </View>

            <View style={styles.searchWrap}>
              <Ionicons
                name="search-outline"
                size={22}
                color={DivyaTheme.colors.ink}
              />

              <TextInput
                placeholder="Search temples, poojas, pandits..."
                placeholderTextColor="#8E837C"
                style={styles.searchInput}
              />

              <Pressable style={styles.filterButton}>
                <Ionicons
                  name="options-outline"
                  size={20}
                  color={DivyaTheme.colors.ink}
                />
              </Pressable>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.services}>
          {services.map((service) => {
            const burgundy = service.tone === "burgundy";
            const gold = service.tone === "gold";

            return (
              <Pressable
                key={service.title}
                style={[
                  styles.serviceCard,
                  burgundy && styles.serviceBurgundy,
                  gold && styles.serviceGold,
                  !burgundy && !gold && styles.serviceIvory,
                ]}
                onPress={() => go(service.route)}
              >
                <View
                  style={[
                    styles.serviceIcon,
                    burgundy && styles.serviceIconDark,
                  ]}
                >
                  <Ionicons
                    name={service.icon}
                    size={23}
                    color={
                      burgundy
                        ? "#EED79E"
                        : gold
                          ? "#FFF6E5"
                          : DivyaTheme.colors.vermilionDeep
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.serviceTitle,
                    (burgundy || gold) && styles.serviceTitleLight,
                  ]}
                >
                  {service.title}
                </Text>

                <Text
                  style={[
                    styles.serviceSubtitle,
                    (burgundy || gold) && styles.serviceSubtitleLight,
                  ]}
                >
                  {service.subtitle}
                </Text>

                <View
                  style={[
                    styles.serviceArrow,
                    (burgundy || gold) && styles.serviceArrowLight,
                  ]}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={17}
                    color={
                      burgundy || gold
                        ? "#FFF7E9"
                        : DivyaTheme.colors.vermilionDeep
                    }
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Temples</Text>

            <Pressable
              style={styles.viewAll}
              onPress={() => go("/temples")}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={DivyaTheme.colors.vermilionDeep}
              />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templeRail}
          >
            {temples.map((temple) => (
              <Pressable
                key={temple.name}
                style={styles.templeCard}
                onPress={() => go(temple.route)}
              >
                <Image
                  source={temple.image}
                  style={styles.templeImage}
                  contentFit="cover"
                />

                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(20,10,8,0.12)",
                    "rgba(20,10,8,0.88)",
                  ]}
                  style={styles.templeShade}
                >
                  <Pressable style={styles.favorite}>
                    <Ionicons
                      name="heart-outline"
                      size={18}
                      color="#FFF"
                    />
                  </Pressable>

                  <View>
                    <Text style={styles.templeName}>
                      {temple.name}
                    </Text>
                    <Text style={styles.templePlace}>
                      {temple.place}
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <Pressable style={styles.todayCard}>
          <View style={styles.todayIcon}>
            <Ionicons
              name="calendar-outline"
              size={23}
              color={DivyaTheme.colors.vermilionDeep}
            />
          </View>

          <View style={styles.todayCopy}>
            <Text style={styles.todayTitle}>Sacred Today</Text>
            <Text style={styles.todayText}>
              Ekadashi · Favourable for Vishnu Pooja
            </Text>
          </View>

          <View style={styles.todayButton}>
            <Text style={styles.todayButtonText}>View Details</Text>
            <Ionicons
              name="arrow-forward"
              size={15}
              color={DivyaTheme.colors.vermilionDeep}
            />
          </View>
        </Pressable>

        <LinearGradient
          colors={["#631B21", "#7A2724", "#361311"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.prayerBanner}
        >
          <View style={styles.lotusIcon}>
            <Ionicons
              name="flower-outline"
              size={28}
              color="#E9C57C"
            />
          </View>

          <View style={styles.prayerCopy}>
            <Text style={styles.prayerTitle}>
              Small prayers.{"\n"}A more peaceful you.
            </Text>
          </View>

          <View style={styles.prayerArrow}>
            <Ionicons
              name="arrow-forward"
              size={17}
              color="#FFF5E3"
            />
          </View>
        </LinearGradient>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9F1",
  },

  content: {
    paddingBottom: 16,
  },

  hero: {
    height: 410,
    backgroundColor: "#E9D3AF",
  },

  heroGradient: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    justifyContent: "space-between",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,250,240,0.80)",
    borderWidth: 1,
    borderColor: "rgba(155,111,50,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  om: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.vermilionDeep,
    fontSize: 20,
  },

  brand: {
    fontFamily: DivyaTheme.fonts.bodyExtraBold,
    fontSize: 12,
    letterSpacing: 2.9,
    color: DivyaTheme.colors.ink,
  },

  brandSub: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.bodyBold,
    fontSize: 5.7,
    letterSpacing: 1.8,
    color: DivyaTheme.colors.champagneDeep,
  },

  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  locationText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    fontSize: 9,
    color: DivyaTheme.colors.ink,
  },

  roundButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "rgba(255,250,240,0.86)",
    alignItems: "center",
    justifyContent: "center",
  },

  profileButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "rgba(255,250,240,0.86)",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    right: 7,
    top: 7,
    backgroundColor: "#B6232C",
  },

  heroCopy: {
    marginTop: 26,
  },

  heroEyebrow: {
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.champagneDeep,
    fontSize: 7,
    letterSpacing: 2,
  },

  heroTitle: {
    marginTop: 10,
    fontFamily: DivyaTheme.fonts.display,
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 41,
    lineHeight: 40,
    letterSpacing: -0.7,
  },

  heroQuote: {
    marginTop: 10,
    fontFamily: DivyaTheme.fonts.displayMedium,
    fontStyle: "italic",
    color: DivyaTheme.colors.text,
    fontSize: 18,
    lineHeight: 23,
  },

  searchWrap: {
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,252,247,0.96)",
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    ...DivyaTheme.shadow.soft,
  },

  searchInput: {
    flex: 1,
    fontFamily: DivyaTheme.fonts.body,
    fontSize: 13,
    color: DivyaTheme.colors.ink,
    outlineStyle: "none" as never,
  },

  filterButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  services: {
    paddingHorizontal: 14,
    paddingTop: 14,
    flexDirection: "row",
    gap: 8,
  },

  serviceCard: {
    flex: 1,
    minHeight: 150,
    paddingHorizontal: 9,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
    ...DivyaTheme.shadow.soft,
  },

  serviceBurgundy: {
    backgroundColor: "#651A21",
    borderColor: "#651A21",
  },

  serviceGold: {
    backgroundColor: "#C18A2D",
    borderColor: "#C18A2D",
  },

  serviceIvory: {
    backgroundColor: "#FFF9EF",
    borderColor: "#EADBC8",
  },

  serviceIcon: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#F5E8D8",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceIconDark: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  serviceTitle: {
    textAlign: "center",
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.ink,
    fontSize: 17,
    lineHeight: 18,
  },

  serviceTitleLight: {
    color: "#FFF7EB",
  },

  serviceSubtitle: {
    textAlign: "center",
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: DivyaTheme.colors.muted,
    fontSize: 5.8,
    lineHeight: 9,
    letterSpacing: 0.7,
  },

  serviceSubtitleLight: {
    color: "rgba(255,247,235,0.66)",
  },

  serviceArrow: {
    width: 31,
    height: 31,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(112,44,37,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceArrowLight: {
    borderColor: "rgba(255,255,255,0.30)",
  },

  section: {
    paddingTop: 25,
  },

  sectionHeader: {
    paddingHorizontal: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontFamily: DivyaTheme.fonts.display,
    color: DivyaTheme.colors.ink,
    fontSize: 29,
  },

  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  viewAllText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    color: DivyaTheme.colors.vermilionDeep,
    fontSize: 10,
  },

  templeRail: {
    paddingHorizontal: 14,
    gap: 10,
  },

  templeCard: {
    width: 180,
    height: 230,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#31201A",
  },

  templeImage: {
    ...StyleSheet.absoluteFill,
  },

  templeShade: {
    flex: 1,
    justifyContent: "space-between",
    padding: 12,
  },

  favorite: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignSelf: "flex-end",
    backgroundColor: "rgba(20,13,10,0.34)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },

  templeName: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: "#FFF",
    fontSize: 20,
    lineHeight: 22,
  },

  templePlace: {
    marginTop: 4,
    fontFamily: DivyaTheme.fonts.bodyBold,
    color: "#F1D7A3",
    fontSize: 6.5,
    letterSpacing: 1,
  },

  todayCard: {
    marginHorizontal: 14,
    marginTop: 18,
    minHeight: 82,
    borderRadius: 18,
    paddingHorizontal: 14,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#EEDFCB",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...DivyaTheme.shadow.whisper,
  },

  todayIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F6E8D7",
    alignItems: "center",
    justifyContent: "center",
  },

  todayCopy: {
    flex: 1,
  },

  todayTitle: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: DivyaTheme.colors.ink,
    fontSize: 20,
  },

  todayText: {
    marginTop: 2,
    fontFamily: DivyaTheme.fonts.body,
    color: DivyaTheme.colors.muted,
    fontSize: 8.5,
  },

  todayButton: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 11,
    backgroundColor: "#F2E4D3",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  todayButtonText: {
    fontFamily: DivyaTheme.fonts.bodySemiBold,
    color: DivyaTheme.colors.vermilionDeep,
    fontSize: 8,
  },

  prayerBanner: {
    minHeight: 106,
    marginHorizontal: 14,
    marginTop: 16,
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    overflow: "hidden",
  },

  lotusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(233,197,124,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },

  prayerCopy: {
    flex: 1,
  },

  prayerTitle: {
    fontFamily: DivyaTheme.fonts.displayMedium,
    color: "#F8E2B8",
    fontSize: 20,
    lineHeight: 21,
  },

  prayerArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomSpacer: {
    height: 12,
  },
});
