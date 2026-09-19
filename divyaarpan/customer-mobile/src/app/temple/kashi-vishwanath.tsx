import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { DivyaTheme } from "@/constants/divya-theme";
const kashi = require("../../../assets/signature/temples/kashi-vishwanath.jpg");


const services = [
  {
    title: "Rudrabhishek",
    subtitle: "Sacred Shiva abhishek",
    icon: "water-outline" as const,
  },
  {
    title: "Mangala Aarti",
    subtitle: "Morning divine aarti",
    icon: "sunny-outline" as const,
  },
  {
    title: "Special Pooja",
    subtitle: "Personal Sankalp pooja",
    icon: "flame-outline" as const,
  },
];

export default function KashiVishwanathScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ImageBackground
          source={kashi}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={[
              "rgba(30,10,15,0.04)",
              "rgba(30,10,15,0.24)",
              "rgba(30,10,15,0.88)",
            ]}
            style={styles.overlay}
          >
            <View style={styles.heroTop}>
              <Pressable
                style={styles.circleButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              </Pressable>

              <View style={styles.heroActions}>
                <Pressable style={styles.circleButton}>
                  <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
                </Pressable>

                <Pressable style={styles.circleButton}>
                  <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>

            <View>
              <Text style={styles.heroEyebrow}>DIVINE DESTINATION</Text>

              <Text style={styles.heroTitle}>Kashi Vishwanath</Text>

              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={15}
                  color="#F8E2B0"
                />
                <Text style={styles.locationText}>
                  Varanasi, Uttar Pradesh
                </Text>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={14} color="#F6C95F" />
                  <Text style={styles.metaText}>4.9</Text>
                </View>

                <View style={styles.metaDot} />

                <Text style={styles.metaText}>Jyotirlinga</Text>

                <View style={styles.metaDot} />

                <Text style={styles.metaText}>12 Poojas</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.body}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteSanskrit}>ॐ नमः शिवाय</Text>
            <Text style={styles.quoteText}>
              One of India's most sacred Shiva temples, revered as a Jyotirlinga.
            </Text>
          </View>

          <View style={styles.tabs}>
            <Pressable style={[styles.tab, styles.tabActive]}>
              <Text style={[styles.tabText, styles.tabTextActive]}>Overview</Text>
            </Pressable>

            <Pressable style={styles.tab}>
              <Text style={styles.tabText}>Poojas</Text>
            </Pressable>

            <Pressable style={styles.tab}>
              <Text style={styles.tabText}>Aarti</Text>
            </Pressable>

            <Pressable style={styles.tab}>
              <Text style={styles.tabText}>Gallery</Text>
            </Pressable>
          </View>

          <Text style={styles.description}>
            Kashi Vishwanath Temple is one of the most revered temples dedicated
            to Lord Shiva. Devotees visit for darshan, Rudrabhishek, aarti and
            spiritual Sankalp.
          </Text>

          <View style={styles.features}>
            <Feature icon="sparkles-outline" label="Jyotirlinga" />
            <Feature icon="flame-outline" label="Daily Aarti" />
            <Feature icon="videocam-outline" label="Live Darshan" />
            <Feature icon="gift-outline" label="Prasad Seva" />
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>DIVINE OFFERINGS</Text>
              <Text style={styles.sectionTitle}>Popular Poojas</Text>
            </View>

            <Pressable>
              <Text style={styles.sectionAction}>View All</Text>
            </Pressable>
          </View>

          <View style={styles.serviceList}>
            {services.map((service) => (
              <Pressable key={service.title} style={styles.serviceCard}>
                <View style={styles.serviceIcon}>
                  <Ionicons
                    name={service.icon}
                    size={22}
                    color={DivyaTheme.colors.saffronDark}
                  />
                </View>

                <View style={styles.serviceCopy}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                </View>

                <Pressable
                  style={styles.bookButtonSmall}
                  onPress={() =>
                    router.push(
                      `/temple-pooja-booking?pooja=${encodeURIComponent(
                        service.title
                      )}` as never
                    )
                  }
                >
                  <Text style={styles.bookButtonSmallText}>Book</Text>
                </Pressable>
              </Pressable>
            ))}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="time-outline"
                size={20}
                color={DivyaTheme.colors.goldDeep}
              />

              <View>
                <Text style={styles.infoLabel}>Temple Timings</Text>
                <Text style={styles.infoValue}>Open daily • 3:00 AM – 11:00 PM</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={DivyaTheme.colors.goldDeep}
              />

              <View>
                <Text style={styles.infoLabel}>Best Days</Text>
                <Text style={styles.infoValue}>Monday • Mahashivratri • Shravan</Text>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              router.push(
                "/temple-pooja-booking?pooja=Rudrabhishek" as never
              )
            }
          >
            <Text style={styles.primaryButtonText}>Begin a Temple Pooja</Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={DivyaTheme.colors.burgundyDeep}
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Feature({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={DivyaTheme.colors.goldDeep}
        />
      </View>

      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DivyaTheme.colors.background,
  },

  content: {
    paddingBottom: 40,
  },

  hero: {
    height: 430,
  },

  heroImage: {
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  heroActions: {
    flexDirection: "row",
    gap: 10,
  },

  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroEyebrow: {
    color: "#F6D89B",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  heroTitle: {
    marginTop: 6,
    color: "#FFFFFF",
    fontSize: 33,
    lineHeight: 36,
    fontWeight: "800",
  },

  locationRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  locationText: {
    color: "#FFF1D5",
    fontSize: 12,
  },

  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.6)",
  },

  body: {
    paddingHorizontal: 18,
  },

  quoteCard: {
    marginTop: 18,
    padding: 17,
    borderRadius: 20,
    backgroundColor: DivyaTheme.colors.goldWash,
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
  },

  quoteSanskrit: {
    color: DivyaTheme.colors.burgundy,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  quoteText: {
    marginTop: 6,
    color: DivyaTheme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },

  tabs: {
    marginTop: 20,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: DivyaTheme.colors.divider,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },

  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: DivyaTheme.colors.burgundy,
  },

  tabText: {
    color: DivyaTheme.colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },

  tabTextActive: {
    color: DivyaTheme.colors.burgundy,
  },

  description: {
    marginTop: 18,
    color: DivyaTheme.colors.text,
    fontSize: 13,
    lineHeight: 21,
  },

  features: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  feature: {
    width: "23%",
    alignItems: "center",
  },

  featureIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DivyaTheme.colors.goldWash,
  },

  featureText: {
    marginTop: 7,
    color: DivyaTheme.colors.text,
    fontSize: 9,
    textAlign: "center",
    fontWeight: "700",
  },

  sectionHeader: {
    marginTop: 30,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionEyebrow: {
    color: DivyaTheme.colors.goldDeep,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.3,
  },

  sectionTitle: {
    marginTop: 3,
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 22,
    fontWeight: "800",
  },

  sectionAction: {
    color: DivyaTheme.colors.burgundy,
    fontSize: 11,
    fontWeight: "700",
  },

  serviceList: {
    gap: 10,
  },

  serviceCard: {
    minHeight: 74,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DivyaTheme.colors.goldWash,
  },

  serviceCopy: {
    flex: 1,
    marginLeft: 12,
  },

  serviceTitle: {
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 14,
    fontWeight: "800",
  },

  serviceSubtitle: {
    marginTop: 3,
    color: DivyaTheme.colors.muted,
    fontSize: 10,
  },

  bookButtonSmall: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: DivyaTheme.colors.burgundy,
  },

  bookButtonSmallText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  infoCard: {
    marginTop: 22,
    padding: 16,
    borderRadius: 20,
    backgroundColor: DivyaTheme.colors.surfaceWarm,
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  infoLabel: {
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 11,
    fontWeight: "800",
  },

  infoValue: {
    marginTop: 2,
    color: DivyaTheme.colors.muted,
    fontSize: 10,
  },

  infoDivider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: DivyaTheme.colors.divider,
  },

  primaryButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F3CF81",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  primaryButtonText: {
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 14,
    fontWeight: "900",
  },
});
