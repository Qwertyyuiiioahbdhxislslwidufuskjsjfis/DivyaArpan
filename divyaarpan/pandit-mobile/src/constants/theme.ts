import { Platform } from "react-native";

export const Colors = {
  background: "#fffaf5",
  surface: "#ffffff",
  surfaceSoft: "#fff7ed",
  primary: "#a16207",
  primaryDark: "#7c2d12",
  primarySoft: "#fff1d6",
  text: "#171717",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  border: "#e5e7eb",
  borderStrong: "#d1d5db",
  success: "#15803d",
  successSoft: "#f0fdf4",
  warning: "#b45309",
  warningSoft: "#fffbeb",
  error: "#b91c1c",
  errorSoft: "#fef2f2",
  white: "#ffffff",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    sans: "sans-serif",
    serif: "serif",
    rounded: "sans-serif-medium",
    mono: "monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Arial, Helvetica, sans-serif",
    serif: "Georgia, serif",
    rounded: "Arial, Helvetica, sans-serif",
    mono: "monospace",
  },
});

export const MaxContentWidth = 520;
