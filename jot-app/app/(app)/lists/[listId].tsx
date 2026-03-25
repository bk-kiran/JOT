import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing } from "@/lib/constants";

// Full implementation: Week 4
export default function ListDetailScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>List</Text>
      <Text style={styles.sub}>{listId}</Text>
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
  },
  sub: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: Spacing.xs,
  },
});
