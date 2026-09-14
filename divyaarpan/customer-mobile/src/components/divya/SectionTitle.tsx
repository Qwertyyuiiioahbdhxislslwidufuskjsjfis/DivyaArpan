import { StyleSheet, Text, View } from "react-native";
import { DivyaTheme } from "@/constants/divya-theme";

type Props = {
  eyebrow?: string;
  title: string;
  action?: string;
};

export function SectionTitle({ eyebrow, title, action }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>

      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  eyebrow: {
    color: DivyaTheme.colors.saffron,
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    color: DivyaTheme.colors.deep,
    fontSize: 22,
    fontWeight: "800",
  },
  action: {
    color: DivyaTheme.colors.saffronDark,
    fontWeight: "700",
    fontSize: 13,
    paddingBottom: 3,
  },
});
