import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { DivyaTheme } from "@/constants/divya-theme";
import { SectionTitle } from "@/components/divya/SectionTitle";
import { DivyaDhwaniButton } from "@/components/divya/DivyaDhwaniButton";

const temples = [
  {
    name: "Kashi Vishwanath",
    place: "Varanasi",
    famous: "Jyotirlinga • Rudrabhishek",
    icon: "🕉️",
  },
  {
    name: "Mahakaleshwar",
    place: "Ujjain",
    famous: "Bhasma Aarti • Jyotirlinga",
    icon: "🔱",
  },
  {
    name: "Siddhivinayak",
    place: "Mumbai",
    famous: "Ganesh Darshan • Sankashti",
    icon: "🌺",
  },
];

const poojas = [
  {
    title: "Rudrabhishek",
    subtitle: "Shiva worship & sacred abhishek",
    icon: "🔱",
  },
  {
    title: "Satyanarayan Pooja",
    subtitle: "Gratitude, blessings & wellbeing",
    icon: "🪔",
  },
  {
    title: "Griha Pravesh",
    subtitle: "Sacred beginning for a new home",
    icon: "🏠",
  },
];

export default function HomeScreen() {
  const glow = useRef(new Animated.Value(0)).current;
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glow]);

  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.55],
  });

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <LinearGradient
          colors={["#FFF1D8", "#F7C982", "#E99343"]}
          start={{ x: 0.05, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.glow,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              },
            ]}
          />

          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>Namaste 🙏</Text>
              <Text style={styles.heroTitle}>Begin with devotion.</Text>
            </View>

            <DivyaDhwaniButton
              enabled={soundEnabled}
              onPress={() => setSoundEnabled((current) => !current)}
            />
          </View>

          <View style={styles.spiritualCard}>
            <Text style={styles.spiritualEyebrow}>TODAY'S SPIRITUAL GUIDE</Text>
            <Text style={styles.spiritualTitle}>
              A peaceful evening for prayer
            </Text>
            <Text style={styles.spiritualBody}>
              Explore a temple, understand a sacred ritual, or begin your
              Sankalp with a verified Pandit.
            </Text>
          </View>

          <View style={styles.heroActions}>
            <Pressable style={styles.primaryAction}>
              <Ionicons name="person-add-outline" size={21} color="#FFFFFF" />
              <View>
                <Text style={styles.primaryActionTitle}>Book a Pandit</Text>
                <Text style={styles.primaryActionSub}>
                  Home • Temple • Online
                </Text>
              </View>
            </Pressable>

            <Pressable style={styles.secondaryAction}>
              <Ionicons
                name="business-outline"
                size={21}
                color={DivyaTheme.colors.maroon}
              />
              <Text style={styles.secondaryActionText}>Explore Temples</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.liveCard}>
          <View style={styles.liveIndicator} />
          <View style={{ flex: 1 }}>
            <Text style={styles.liveTitle}>Pandits available near you</Text>
            <Text style={styles.liveSubtitle}>
              Live availability will update from DivyaArpan
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={DivyaTheme.colors.saffronDark}
          />
        </View>

        <SectionTitle
          eyebrow="Sacred India"
          title="Temples to discover"
          action="View all"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalRow}
        >
          {temples.map((temple) => (
            <Pressable key={temple.name} style={styles.templeCard}>
              <LinearGradient
                colors={["#FFF4DE", "#F6DEC2"]}
                style={styles.templeVisual}
              >
                <Text style={styles.templeEmoji}>{temple.icon}</Text>
              </LinearGradient>

              <Text style={styles.templeName}>{temple.name}</Text>
              <Text style={styles.templePlace}>{temple.place}</Text>

              <View style={styles.famousTag}>
                <Text style={styles.famousText}>{temple.famous}</Text>
              </View>

              <Text style={styles.discoverText}>Why this Mandir is famous →</Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionTitle
          eyebrow="Sacred Rituals"
          title="Popular Poojas"
          action="Explore"
        />

        <View style={styles.poojaList}>
          {poojas.map((pooja) => (
            <Pressable key={pooja.title} style={styles.poojaCard}>
              <View style={styles.poojaIcon}>
                <Text style={{ fontSize: 25 }}>{pooja.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.poojaTitle}>{pooja.title}</Text>
                <Text style={styles.poojaSubtitle}>{pooja.subtitle}</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={DivyaTheme.colors.gold}
              />
            </Pressable>
          ))}
        </View>

        <SectionTitle eyebrow="Offer with faith" title="Arpan" />

        <LinearGradient
          colors={["#682727", "#8A3C2C"]}
          style={styles.arpanCard}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.arpanEyebrow}>DIVYA ARPAN</Text>
            <Text style={styles.arpanTitle}>
              Send your offering with Sankalp
            </Text>
            <Text style={styles.arpanBody}>
              Flowers, diya, prasad and selected temple offerings.
            </Text>

            <Pressable style={styles.arpanButton}>
              <Text style={styles.arpanButtonText}>Explore Arpan</Text>
            </Pressable>
          </View>

          <Text style={styles.arpanEmoji}>🪔</Text>
        </LinearGradient>

        <SectionTitle eyebrow="Your Journey" title="Live booking" />

        <View style={styles.emptyBooking}>
          <View style={styles.emptyBookingIcon}>
            <Ionicons
              name="sparkles-outline"
              size={25}
              color={DivyaTheme.colors.saffron}
            />
          </View>

          <Text style={styles.emptyBookingTitle}>No active booking yet</Text>
          <Text style={styles.emptyBookingText}>
            When you book a Pandit or temple pooja, its live journey will
            appear here.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DivyaTheme.colors.background,
  },

  content: {
    paddingBottom: 28,
  },

  hero: {
    margin: 14,
    borderRadius: 30,
    padding: 20,
    paddingTop: 58,
    overflow: "hidden",
    minHeight: 430,
  },

  glow: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#FFF8D8",
    right: -60,
    top: 95,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  greeting: {
    color: DivyaTheme.colors.maroon,
    fontWeight: "800",
    fontSize: 15,
  },

  heroTitle: {
    color: DivyaTheme.colors.deep,
    fontWeight: "900",
    fontSize: 30,
    marginTop: 4,
    maxWidth: 220,
  },

  spiritualCard: {
    backgroundColor: "rgba(255,255,255,0.73)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    padding: 17,
    borderRadius: 22,
    marginTop: 40,
  },

  spiritualEyebrow: {
    color: DivyaTheme.colors.saffronDark,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  spiritualTitle: {
    color: DivyaTheme.colors.deep,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 6,
  },

  spiritualBody: {
    color: "#6B5142",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },

  heroActions: {
    marginTop: 18,
    gap: 10,
  },

  primaryAction: {
    backgroundColor: DivyaTheme.colors.maroon,
    borderRadius: 18,
    paddingHorizontal: 17,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  primaryActionTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  primaryActionSub: {
    color: "#F0D9D9",
    fontSize: 11,
    marginTop: 2,
  },

  secondaryAction: {
    backgroundColor: "rgba(255,255,255,0.77)",
    borderRadius: 18,
    paddingHorizontal: 17,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  secondaryActionText: {
    color: DivyaTheme.colors.maroon,
    fontWeight: "800",
  },

  liveCard: {
    marginHorizontal: 18,
    marginTop: 5,
    marginBottom: 30,
    padding: 15,
    borderRadius: 18,
    backgroundColor: DivyaTheme.colors.greenSoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  liveIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DivyaTheme.colors.green,
  },

  liveTitle: {
    color: DivyaTheme.colors.deep,
    fontSize: 14,
    fontWeight: "800",
  },

  liveSubtitle: {
    color: DivyaTheme.colors.muted,
    fontSize: 11,
    marginTop: 2,
  },

  horizontalRow: {
    paddingLeft: 18,
    paddingRight: 8,
    gap: 12,
    marginBottom: 32,
  },

  templeCard: {
    width: 230,
    padding: 13,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
  },

  templeVisual: {
    height: 125,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  templeEmoji: {
    fontSize: 48,
  },

  templeName: {
    color: DivyaTheme.colors.deep,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 13,
  },

  templePlace: {
    color: DivyaTheme.colors.muted,
    fontSize: 12,
    marginTop: 2,
  },

  famousTag: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF3E2",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 9,
  },

  famousText: {
    color: DivyaTheme.colors.saffronDark,
    fontSize: 10,
    fontWeight: "700",
  },

  discoverText: {
    color: DivyaTheme.colors.maroon,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 12,
  },

  poojaList: {
    marginHorizontal: 18,
    gap: 10,
    marginBottom: 32,
  },

  poojaCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
    padding: 14,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  poojaIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF2DE",
  },

  poojaTitle: {
    color: DivyaTheme.colors.deep,
    fontWeight: "900",
    fontSize: 15,
  },

  poojaSubtitle: {
    color: DivyaTheme.colors.muted,
    fontSize: 11,
    marginTop: 3,
  },

  arpanCard: {
    marginHorizontal: 18,
    marginBottom: 32,
    padding: 20,
    borderRadius: 25,
    minHeight: 185,
    flexDirection: "row",
    alignItems: "center",
  },

  arpanEyebrow: {
    color: "#F7C98C",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  arpanTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 7,
    maxWidth: 230,
  },

  arpanBody: {
    color: "#EED7D2",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    maxWidth: 230,
  },

  arpanButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    marginTop: 15,
  },

  arpanButtonText: {
    color: DivyaTheme.colors.maroon,
    fontWeight: "900",
    fontSize: 11,
  },

  arpanEmoji: {
    fontSize: 52,
    marginLeft: 8,
  },

  emptyBooking: {
    marginHorizontal: 18,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },

  emptyBookingIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#FFF2DE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyBookingTitle: {
    color: DivyaTheme.colors.deep,
    fontSize: 16,
    fontWeight: "900",
  },

  emptyBookingText: {
    color: DivyaTheme.colors.muted,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 280,
  },
});
