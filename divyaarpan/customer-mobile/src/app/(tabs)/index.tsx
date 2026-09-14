import { useMemo } from "react";
import {
  Image,
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

const quickActions = [
  {
    title: "Book\nPandit",
    icon: "person-outline" as const,
    route: "/bookings",
  },
  {
    title: "Temple\nPooja",
    icon: "business-outline" as const,
    route: "/temples",
  },
  {
    title: "Arpan\nSeva",
    icon: "flower-outline" as const,
    route: "/poojas",
  },
  {
    title: "Ask\nPandit",
    icon: "chatbubble-ellipses-outline" as const,
    route: "/bookings",
  },
];

const temples = [
  {
    name: "Kashi Vishwanath",
    place: "Varanasi",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Mahakaleshwar",
    place: "Ujjain",
    image:
      "https://images.unsplash.com/photo-1600100397608-f010f5c0a56d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Siddhivinayak",
    place: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=900&q=85",
  },
];

const poojas = [
  {
    title: "Rudrabhishek",
    subtitle: "For peace & prosperity",
    icon: "water-outline" as const,
  },
  {
    title: "Satyanarayan Pooja",
    subtitle: "For gratitude & wellbeing",
    icon: "flame-outline" as const,
  },
  {
    title: "Griha Pravesh",
    subtitle: "For a new beginning",
    icon: "home-outline" as const,
  },
];

export default function HomeScreen() {
  const greeting = useMemo(() => "Good Morning", []);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topbar}>
          <View style={styles.brandBlock}>
            <View style={styles.logoMark}>
              <Ionicons
                name="flower-outline"
                size={25}
                color={DivyaTheme.colors.goldDeep}
              />
            </View>

            <View>
              <Text style={styles.brand}>DivyaArpan</Text>
              <Text style={styles.greeting}>{greeting}, Chandraprakash</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable style={styles.roundButton}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={DivyaTheme.colors.burgundy}
              />
            </Pressable>

            <Pressable
              style={styles.avatar}
              onPress={() => router.push("/profile")}
            >
              <Ionicons name="person" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={15}
            color={DivyaTheme.colors.goldDeep}
          />
          <Text style={styles.location}>Mumbai, Maharashtra</Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={DivyaTheme.colors.muted}
          />
        </View>

        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&w=1400&q=90",
          }}
          imageStyle={styles.heroImage}
          style={styles.hero}
        >
          <LinearGradient
            colors={[
              "rgba(70,20,29,0.18)",
              "rgba(70,20,29,0.32)",
              "rgba(55,14,24,0.76)",
            ]}
            style={styles.heroOverlay}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroPill}>
                <Ionicons
                  name="sunny-outline"
                  size={14}
                  color={DivyaTheme.colors.goldLight}
                />
                <Text style={styles.heroPillText}>TODAY WITH DIVYAARPAN</Text>
              </View>
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>
                Begin your day{"\n"}
                with devotion.
              </Text>

              <Text style={styles.heroBody}>
                Sacred temples. Authentic poojas. Verified Pandits.
              </Text>

              <Pressable
                style={styles.heroButton}
                onPress={() => router.push("/temples")}
              >
                <Text style={styles.heroButtonText}>Explore Now</Text>
                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color={DivyaTheme.colors.burgundyDeep}
                />
              </Pressable>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={19}
            color={DivyaTheme.colors.muted}
          />

          <Text style={styles.searchPlaceholder}>
            Search temples, poojas, pandits...
          </Text>

          <View style={styles.searchFilter}>
            <Ionicons
              name="options-outline"
              size={18}
              color={DivyaTheme.colors.burgundy}
            />
          </View>
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map((item) => (
            <Pressable
              key={item.title}
              style={styles.quickItem}
              onPress={() => router.push(item.route as never)}
            >
              <LinearGradient
                colors={["#FFF8EA", "#FFE9C6"]}
                style={styles.quickIcon}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={DivyaTheme.colors.burgundy}
                />
              </LinearGradient>

              <Text style={styles.quickText}>{item.title}</Text>
            </Pressable>
          ))}
        </View>

        <SectionHeader
          eyebrow="SACRED DESTINATIONS"
          title="Popular Temples"
          action="See All"
          onPress={() => router.push("/temples")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalRow}
        >
          {temples.map((temple) => (
            <Pressable
              key={temple.name}
              style={styles.templeCard}
              onPress={() => router.push("/temples")}
            >
              <Image
                source={{ uri: temple.image }}
                style={styles.templeImage}
              />

              <View style={styles.templeBody}>
                <Text style={styles.templeName}>{temple.name}</Text>

                <View style={styles.templePlaceRow}>
                  <Ionicons
                    name="location-outline"
                    size={13}
                    color={DivyaTheme.colors.goldDeep}
                  />
                  <Text style={styles.templePlace}>{temple.place}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.festivalCard}>
          <LinearGradient
            colors={["#6D182B", "#8F2C39", "#B45A3D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.festivalGradient}
          >
            <View style={styles.festivalCopy}>
              <Text style={styles.festivalEyebrow}>SPECIAL SEVA</Text>

              <Text style={styles.festivalTitle}>
                Offer your Sankalp{"\n"}from anywhere
              </Text>

              <Text style={styles.festivalBody}>
                Let DivyaArpan help you offer prayers through trusted temples.
              </Text>

              <Pressable
                style={styles.festivalButton}
                onPress={() => router.push("/poojas")}
              >
                <Text style={styles.festivalButtonText}>Offer Arpan</Text>
                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color={DivyaTheme.colors.burgundy}
                />
              </Pressable>
            </View>

            <View style={styles.festivalSymbol}>
              <Text style={styles.om}>ॐ</Text>
            </View>
          </LinearGradient>
        </View>

        <SectionHeader
          eyebrow="TRADITIONAL POOJAS"
          title="Popular Poojas"
          action="Explore"
          onPress={() => router.push("/poojas")}
        />

        <View style={styles.poojaList}>
          {poojas.map((pooja) => (
            <Pressable
              key={pooja.title}
              style={styles.poojaItem}
              onPress={() => router.push("/poojas")}
            >
              <View style={styles.poojaIcon}>
                <Ionicons
                  name={pooja.icon}
                  size={23}
                  color={DivyaTheme.colors.saffronDark}
                />
              </View>

              <View style={styles.poojaText}>
                <Text style={styles.poojaTitle}>{pooja.title}</Text>
                <Text style={styles.poojaSubtitle}>{pooja.subtitle}</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={DivyaTheme.colors.goldDeep}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.trustRow}>
          <TrustItem icon="shield-checkmark-outline" text="Verified Pandits" />
          <TrustItem icon="card-outline" text="Secure Payments" />
          <TrustItem icon="language-outline" text="Multilingual" />
        </View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
  onPress,
}: {
  eyebrow: string;
  title: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <Pressable onPress={onPress}>
        <Text style={styles.sectionAction}>{action}</Text>
      </Pressable>
    </View>
  );
}

function TrustItem({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.trustItem}>
      <Ionicons
        name={icon}
        size={20}
        color={DivyaTheme.colors.goldDeep}
      />
      <Text style={styles.trustText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DivyaTheme.colors.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120,
  },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DivyaTheme.colors.goldWash,
  },

  brand: {
    color: DivyaTheme.colors.burgundy,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  greeting: {
    marginTop: 2,
    color: DivyaTheme.colors.muted,
    fontSize: 12,
  },

  headerActions: {
    flexDirection: "row",
    gap: 10,
  },

  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DivyaTheme.colors.burgundy,
    alignItems: "center",
    justifyContent: "center",
  },

  locationRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 50,
  },

  location: {
    color: DivyaTheme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },

  hero: {
    marginTop: 20,
    height: 330,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: DivyaTheme.colors.backgroundDeep,
  },

  heroImage: {
    borderRadius: 30,
  },

  heroOverlay: {
    flex: 1,
    padding: 22,
    justifyContent: "space-between",
  },

  heroTop: {
    flexDirection: "row",
  },

  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: "rgba(65,16,25,0.55)",
  },

  heroPillText: {
    color: "#FFF2CD",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  heroCopy: {
    width: "88%",
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "700",
  },

  heroBody: {
    marginTop: 11,
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 21,
  },

  heroButton: {
    marginTop: 17,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8DFA6",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },

  heroButtonText: {
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 13,
    fontWeight: "800",
  },

  searchBar: {
    marginTop: -20,
    marginHorizontal: 14,
    minHeight: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
    ...DivyaTheme.shadow.soft,
  },

  searchPlaceholder: {
    flex: 1,
    color: DivyaTheme.colors.muted,
    fontSize: 13,
  },

  searchFilter: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: DivyaTheme.colors.goldWash,
    alignItems: "center",
    justifyContent: "center",
  },

  quickGrid: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  quickItem: {
    width: "23%",
    alignItems: "center",
  },

  quickIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1D9AC",
  },

  quickText: {
    marginTop: 8,
    textAlign: "center",
    color: DivyaTheme.colors.text,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
  },

  sectionHeader: {
    marginTop: 32,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionEyebrow: {
    color: DivyaTheme.colors.goldDeep,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  sectionTitle: {
    marginTop: 4,
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 22,
    fontWeight: "800",
  },

  sectionAction: {
    color: DivyaTheme.colors.burgundy,
    fontSize: 12,
    fontWeight: "700",
  },

  horizontalRow: {
    gap: 12,
    paddingRight: 18,
  },

  templeCard: {
    width: 180,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
    ...DivyaTheme.shadow.soft,
  },

  templeImage: {
    width: "100%",
    height: 128,
    backgroundColor: DivyaTheme.colors.backgroundDeep,
  },

  templeBody: {
    padding: 12,
  },

  templeName: {
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 14,
    fontWeight: "800",
  },

  templePlaceRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  templePlace: {
    color: DivyaTheme.colors.muted,
    fontSize: 11,
  },

  festivalCard: {
    marginTop: 30,
    borderRadius: 25,
    overflow: "hidden",
  },

  festivalGradient: {
    minHeight: 210,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
  },

  festivalCopy: {
    flex: 1,
  },

  festivalEyebrow: {
    color: "#F7DAA0",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  festivalTitle: {
    marginTop: 7,
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "800",
  },

  festivalBody: {
    marginTop: 8,
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    lineHeight: 18,
  },

  festivalButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#FFE7B0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 999,
  },

  festivalButtonText: {
    color: DivyaTheme.colors.burgundy,
    fontSize: 12,
    fontWeight: "800",
  },

  festivalSymbol: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,228,171,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  om: {
    color: "#F7DAA0",
    fontSize: 42,
    fontWeight: "700",
  },

  poojaList: {
    gap: 10,
  },

  poojaItem: {
    minHeight: 74,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },

  poojaIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: DivyaTheme.colors.goldWash,
    alignItems: "center",
    justifyContent: "center",
  },

  poojaText: {
    flex: 1,
    marginLeft: 12,
  },

  poojaTitle: {
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 14,
    fontWeight: "800",
  },

  poojaSubtitle: {
    marginTop: 3,
    color: DivyaTheme.colors.muted,
    fontSize: 11,
  },

  trustRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 22,
    borderTopWidth: 1,
    borderTopColor: DivyaTheme.colors.divider,
  },

  trustItem: {
    width: "31%",
    alignItems: "center",
    gap: 6,
  },

  trustText: {
    color: DivyaTheme.colors.muted,
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
  },
});
