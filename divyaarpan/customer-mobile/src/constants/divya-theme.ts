export const DivyaTheme = {
  colors: {
    // Signature canvas
    background: "#FBF7F0",
    backgroundDeep: "#F4ECE1",
    canvas: "#F8F2E9",

    // Elevated surfaces
    surface: "#FFFEFB",
    surfaceWarm: "#F8EFE2",
    surfaceMuted: "#EFE3D5",
    glass: "rgba(255, 253, 248, 0.86)",
    glassDark: "rgba(40, 18, 18, 0.58)",

    // Vermilion / sacred red
    vermilion: "#A33A2B",
    vermilionDeep: "#72251F",
    vermilionSoft: "#C96A57",

    // Compatibility
    burgundy: "#6E2430",
    burgundySoft: "#944250",
    burgundyDeep: "#45151D",
    maroon: "#6E2430",

    // Champagne metallic family
    champagne: "#C7A260",
    champagneDeep: "#94713A",
    champagneLight: "#E9D4A5",

    // Compatibility gold
    gold: "#C7A260",
    goldDeep: "#94713A",
    goldLight: "#E9D4A5",
    goldWash: "#F7ECD2",

    // Saffron used only as an accent
    saffron: "#D9782E",
    saffronDark: "#B85A20",
    saffronLight: "#F0A35C",

    // Secondary warmth
    sunrise: "#E79451",
    sunriseLight: "#F6CAA3",
    peach: "#F1D6C1",
    lotus: "#BC6B73",
    lotusLight: "#F3DFDF",

    // Typography
    ink: "#251A18",
    deep: "#251A18",
    text: "#443532",
    muted: "#7B6A64",
    subtle: "#AA9991",

    // Utility
    success: "#3E7957",
    white: "#FFFFFF",
    border: "#E8DDD0",
    divider: "#EBE1D6",

    // Dark cinematic surfaces
    night: "#211615",
    nightSoft: "#382321",
  },

  fonts: {
    display: "CormorantGaramond_600SemiBold",
    displayMedium: "CormorantGaramond_500Medium",
    displayBold: "CormorantGaramond_700Bold",

    body: "Manrope_400Regular",
    bodyMedium: "Manrope_500Medium",
    bodySemiBold: "Manrope_600SemiBold",
    bodyBold: "Manrope_700Bold",
    bodyExtraBold: "Manrope_800ExtraBold",
  },

  type: {
    displayXL: {
      fontFamily: "CormorantGaramond_600SemiBold",
      fontSize: 46,
      lineHeight: 46,
      letterSpacing: -1.1,
    },
    displayLG: {
      fontFamily: "CormorantGaramond_600SemiBold",
      fontSize: 36,
      lineHeight: 38,
      letterSpacing: -0.7,
    },
    displayMD: {
      fontFamily: "CormorantGaramond_600SemiBold",
      fontSize: 29,
      lineHeight: 32,
      letterSpacing: -0.35,
    },
    heading: {
      fontFamily: "Manrope_700Bold",
      fontSize: 18,
      lineHeight: 24,
    },
    body: {
      fontFamily: "Manrope_400Regular",
      fontSize: 14,
      lineHeight: 22,
    },
    caption: {
      fontFamily: "Manrope_500Medium",
      fontSize: 11,
      lineHeight: 16,
    },
    eyebrow: {
      fontFamily: "Manrope_700Bold",
      fontSize: 9,
      lineHeight: 13,
      letterSpacing: 1.8,
    },
  },

  radius: {
    xs: 8,
    sm: 12,
    md: 18,
    lg: 24,
    xl: 30,
    hero: 36,
    floating: 28,
    pill: 999,
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
    xxl: 40,
    xxxl: 56,
  },

  layout: {
    maxAppWidth: 480,
    pagePadding: 18,
    sectionGap: 36,
  },

  shadow: {
    whisper: {
      shadowColor: "#3F281E",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 2,
    },
    soft: {
      shadowColor: "#3F281E",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 22,
      elevation: 4,
    },
    card: {
      shadowColor: "#3F281E",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.1,
      shadowRadius: 30,
      elevation: 6,
    },
    floating: {
      shadowColor: "#2A1815",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.16,
      shadowRadius: 34,
      elevation: 12,
    },
  },
} as const;
