export const DivyaTheme = {
  colors: {
    // Bright devotional canvas
    background: "#FFF9F0",
    backgroundDeep: "#FFF2DF",
    surface: "#FFFFFF",
    surfaceWarm: "#FFF4E3",
    surfaceMuted: "#F9EAD8",

    // Primary spiritual colours
    saffron: "#F28A2E",
    saffronDark: "#D96A17",
    saffronLight: "#FFB45F",

    // Sunrise / celebration
    sunrise: "#FF9D45",
    sunriseLight: "#FFD09A",
    peach: "#FFE0C2",
    lotus: "#E98287",
    lotusLight: "#FCE4E1",

    // Premium gold
    gold: "#D6A64A",
    goldDeep: "#A97924",
    goldLight: "#F4D994",
    goldWash: "#FFF3D1",

    // Maroon only for premium contrast
    burgundy: "#741F32",
    burgundySoft: "#963B4C",
    burgundyDeep: "#4B1422",
    maroon: "#741F32",

    // Typography
    deep: "#321C19",
    text: "#422824",
    muted: "#806B62",
    subtle: "#A89489",

    // Utility
    success: "#398A5A",
    white: "#FFFFFF",
    border: "#F0DDC7",
    divider: "#F4E7D8",
  },

  radius: {
    sm: 12,
    md: 18,
    lg: 24,
    xl: 30,
    hero: 36,
    pill: 999,
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
    xxl: 40,
  },

  shadow: {
    soft: {
      shadowColor: "#8B5A32",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
      elevation: 4,
    },
    card: {
      shadowColor: "#8B5A32",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.10,
      shadowRadius: 22,
      elevation: 5,
    },
  },
} as const;
