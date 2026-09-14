import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { DivyaTheme } from "@/constants/divya-theme";

type Props = {
  enabled: boolean;
  onPress: () => void;
};

export function DivyaDhwaniButton({ enabled, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Ionicons
        name={enabled ? "musical-notes" : "volume-mute-outline"}
        size={17}
        color={DivyaTheme.colors.maroon}
      />
      <Text style={styles.text}>{enabled ? "Divya Dhwani" : "Sound Off"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.84)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },
  text: {
    color: DivyaTheme.colors.maroon,
    fontSize: 12,
    fontWeight: "700",
  },
});
