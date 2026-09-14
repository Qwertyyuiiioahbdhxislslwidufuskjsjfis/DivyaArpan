import { StyleSheet, Text, View } from "react-native";
import { DivyaTheme } from "@/constants/divya-theme";

export default function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temples</Text>
      <Text style={styles.subtitle}>
        DivyaArpan experience coming in the next build sprint.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DivyaTheme.colors.background,
    padding: 24,
    paddingTop: 80,
  },
  title: {
    color: DivyaTheme.colors.deep,
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: DivyaTheme.colors.muted,
    fontSize: 14,
    marginTop: 10,
  },
});
