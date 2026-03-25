import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing } from "@/lib/constants";

// Full implementation: Week 5–6
export default function RemindersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reminders</Text>
      <Text style={styles.empty}>Your reminders will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: Spacing.md,
  },
  heading: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  empty: {
    color: Colors.muted,
    fontSize: 15,
  },
});
