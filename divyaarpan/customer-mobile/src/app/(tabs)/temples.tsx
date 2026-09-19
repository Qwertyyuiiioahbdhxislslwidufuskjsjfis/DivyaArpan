import { useState } from "react";
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

const kashi = require("../../../assets/signature/temples/kashi-vishwanath.jpg");
const siddhivinayak = require("../../../assets/signature/temples/siddhivinayak.jpg");
const tirupati = require("../../../assets/signature/temples/tirupati-balaji.jpg");

const filters = ["All", "Jyotirlinga", "Shaktipeeth", "Popular"];

const temples = [
  {
    name: "Kashi Vishwanath",
    city: "Varanasi",
    state: "Uttar Pradesh",
    category: "Jyotirlinga",
    offering: "Temple Pooja",
    image: kashi,
    route: "/temple/kashi-vishwanath",
  },
  {
    name: "Siddhivinayak",
    city: "Mumbai",
    state: "Maharashtra",
    category: "Popular",
    offering: "Ganesh Pooja",
    image: siddhivinayak,
    route: null,
  },
  {
    name: "Tirupati Balaji",
    city: "Tirupati",
    state: "Andhra Pradesh",
    category: "Popular",
    offering: "Temple Seva",
    image: tirupati,
    route: null,
  },
] as const;

export default function TemplesScreen() {
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleTemples =
    activeFilter === "All"
      ? temples
      : temples.filter((temple) => temple.category === activeFilter);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>SACRED INDIA</Text>
            <Text style={styles.title}>Mandirs</Text>
            <Text style={styles.subtitle}>
              Discover sacred Mandirs and choose how you wish to offer Pooja
            </Text>
          </View>

          <Pressable style={styles.headerButton}>
            <Ionicons
              name="heart-outline"
              size={21}
              color={DivyaTheme.colors.burgundy}
            />
          </Pressable>
        </View>

        <View style={styles.search}>
          <Ionicons
            name="search-outline"
            size={19}
            color={DivyaTheme.colors.muted}
          />

          <Text style={styles.searchText}>
            Search Mandir, city or deity...
          </Text>

          <Pressable style={styles.filterButton}>
            <Ionicons
              name="options-outline"
              size={18}
              color={DivyaTheme.colors.burgundy}
            />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip,
                  active && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable onPress={() => router.push("/temple/kashi-vishwanath")}>
        <ImageBackground
          source={temples[0].image}
          style={styles.featured}
          imageStyle={styles.featuredImage}
        >
          <LinearGradient
            colors={[
              "rgba(42,15,20,0.05)",
              "rgba(42,15,20,0.18)",
              "rgba(42,15,20,0.88)",
            ]}
            style={styles.featuredOverlay}
          >
            <View style={styles.featuredTop}>
              <View style={styles.featuredBadge}>
                <Ionicons
                  name="sparkles"
                  size={13}
                  color="#6C3A13"
                />
                <Text style={styles.featuredBadgeText}>FEATURED TEMPLE</Text>
              </View>

              <Pressable style={styles.featuredHeart}>
                <Ionicons name="heart-outline" size={21} color="#FFFFFF" />
              </Pressable>
            </View>

            <View>
              <Text style={styles.featuredName}>Kashi Vishwanath</Text>

              <View style={styles.featuredLocation}>
                <Ionicons
                  name="location-outline"
                  size={15}
                  color="#FBE5B8"
                />
                <Text style={styles.featuredLocationText}>
                  Varanasi, Uttar Pradesh
                </Text>
              </View>

              <View style={styles.featuredMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={14} color="#F5C96B" />
                  <Text style={styles.metaText}>4.9</Text>
                </View>

                <View style={styles.metaDivider} />

                <Text style={styles.metaText}>Jyotirlinga</Text>

                <View style={styles.metaDivider} />

                <Text style={styles.metaText}>12 Poojas</Text>
              </View>

              <Pressable style={styles.discoverButton}>
                <Text style={styles.discoverText}>Discover Temple</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={DivyaTheme.colors.burgundyDeep}
                />
              </Pressable>
            </View>
          </LinearGradient>
        </ImageBackground>
        </Pressable>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>EXPLORE</Text>
            <Text style={styles.sectionTitle}>Sacred Mandirs</Text>
          </View>

          <Text style={styles.resultCount}>
            {visibleTemples.length} Mandirs
          </Text>
        </View>

        <View style={styles.list}>
          {visibleTemples.map((temple) => (
            <Pressable
              key={temple.name}
              style={styles.templeCard}
              onPress={() => {
                if (temple.route) {
                  router.push(temple.route);
                }
              }}
            >
              <Image
                source={temple.image}
                style={styles.templeImage}
              />

              <View style={styles.templeContent}>
                <View style={styles.templeTop}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                      {temple.category}
                    </Text>
                  </View>

                  <Pressable style={styles.heart}>
                    <Ionicons
                      name="heart-outline"
                      size={18}
                      color={DivyaTheme.colors.burgundy}
                    />
                  </Pressable>
                </View>

                <Text style={styles.templeName}>{temple.name}</Text>

                <View style={styles.placeRow}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={DivyaTheme.colors.goldDeep}
                  />
                  <Text style={styles.placeText}>
                    {temple.city}, {temple.state}
                  </Text>
                </View>

                <View style={styles.templeBottom}>
                  <View style={styles.ratingRow}>
                    <Ionicons
                      name="flower-outline"
                      size={14}
                      color={DivyaTheme.colors.goldDeep}
                    />

                    <Text style={styles.rating}>
                      {temple.offering}
                    </Text>
                  </View>

                  <View style={styles.arrowCircle}>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={DivyaTheme.colors.burgundy}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.discoveryCard}>
          <View style={styles.discoveryIcon}>
            <Ionicons
              name="map-outline"
              size={26}
              color={DivyaTheme.colors.goldDeep}
            />
          </View>

          <View style={styles.discoveryCopy}>
            <Text style={styles.discoveryTitle}>
              Your journey to sacred Mandirs
            </Text>

            <Text style={styles.discoveryBody}>
              Jyotirlingas, Shaktipeeths and sacred destinations—all in one
              spiritual journey.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={DivyaTheme.colors.goldDeep}
          />
        </View>
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
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  eyebrow: {
    color: DivyaTheme.colors.goldDeep,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "800",
  },

  title: {
    marginTop: 3,
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 4,
    color: DivyaTheme.colors.muted,
    fontSize: 12,
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
  },

  search: {
    marginTop: 22,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
  },

  searchText: {
    flex: 1,
    color: DivyaTheme.colors.muted,
    fontSize: 13,
  },

  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DivyaTheme.colors.goldWash,
  },

  filters: {
    gap: 9,
    paddingVertical: 16,
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
  },

  filterChipActive: {
    backgroundColor: DivyaTheme.colors.burgundy,
    borderColor: DivyaTheme.colors.burgundy,
  },

  filterChipText: {
    color: DivyaTheme.colors.text,
    fontSize: 11,
    fontWeight: "700",
  },

  filterChipTextActive: {
    color: "#FFFFFF",
  },

  featured: {
    height: 310,
    borderRadius: 28,
    overflow: "hidden",
  },

  featuredImage: {
    borderRadius: 28,
  },

  featuredOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 18,
  },

  featuredTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: "#FBE5B8",
  },

  featuredBadgeText: {
    color: "#643715",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  featuredHeart: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },

  featuredName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  featuredLocation: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  featuredLocationText: {
    color: "#FCEFD4",
    fontSize: 12,
  },

  featuredMeta: {
    marginTop: 11,
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

  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.55)",
  },

  discoverButton: {
    marginTop: 15,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 11,
    backgroundColor: "#F7DDA7",
    borderRadius: 999,
  },

  discoverText: {
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 12,
    fontWeight: "800",
  },

  sectionHeader: {
    marginTop: 28,
    marginBottom: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionEyebrow: {
    color: DivyaTheme.colors.goldDeep,
    fontSize: 9,
    letterSpacing: 1.3,
    fontWeight: "800",
  },

  sectionTitle: {
    marginTop: 3,
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 21,
    fontWeight: "800",
  },

  resultCount: {
    color: DivyaTheme.colors.muted,
    fontSize: 11,
  },

  list: {
    gap: 12,
  },

  templeCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
    ...DivyaTheme.shadow.soft,
  },

  templeImage: {
    width: 108,
    minHeight: 140,
    borderRadius: 15,
    backgroundColor: DivyaTheme.colors.backgroundDeep,
  },

  templeContent: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 2,
  },

  templeTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryBadge: {
    backgroundColor: DivyaTheme.colors.goldWash,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 99,
  },

  categoryText: {
    color: DivyaTheme.colors.goldDeep,
    fontSize: 8,
    fontWeight: "800",
  },

  heart: {
    padding: 4,
  },

  templeName: {
    marginTop: 8,
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 16,
    fontWeight: "800",
  },

  placeRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  placeText: {
    flex: 1,
    color: DivyaTheme.colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },

  templeBottom: {
    marginTop: "auto",
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  rating: {
    color: DivyaTheme.colors.text,
    fontSize: 11,
    fontWeight: "800",
  },

  poojaCount: {
    color: DivyaTheme.colors.muted,
    fontSize: 10,
  },

  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: DivyaTheme.colors.goldWash,
    alignItems: "center",
    justifyContent: "center",
  },

  discoveryCard: {
    marginTop: 25,
    backgroundColor: DivyaTheme.colors.surfaceWarm,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: DivyaTheme.colors.border,
  },

  discoveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  discoveryCopy: {
    flex: 1,
  },

  discoveryTitle: {
    color: DivyaTheme.colors.burgundyDeep,
    fontSize: 13,
    fontWeight: "800",
  },

  discoveryBody: {
    marginTop: 4,
    color: DivyaTheme.colors.muted,
    fontSize: 10,
    lineHeight: 15,
  },
});
