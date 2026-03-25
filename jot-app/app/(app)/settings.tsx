import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Colors, Spacing } from "@/lib/constants";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const me = useQuery(api.users.getMe);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      {me && (
        <View style={styles.card}>
          <Text style={styles.label}>Account</Text>
          <Text style={styles.value}>{me.email}</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planText}>{me.plan === "pro" ? "PRO" : "FREE"}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => signOut()}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Powered by AI · JOT v1.0</Text>
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
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  label: {
    color: Colors.muted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  value: {
    color: Colors.white,
    fontSize: 15,
  },
  planBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary + "20",
    borderRadius: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginTop: Spacing.xs,
  },
  planText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  signOutButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  signOutText: {
    color: Colors.error,
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    color: Colors.muted,
    fontSize: 12,
    textAlign: "center",
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
});
