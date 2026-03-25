import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useRef,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef as useReactRef, useState } from "react";
import { Colors, Spacing } from "@/lib/constants";

// Week 2 will wire this to Convex. For now: local state only.
export default function HomeScreen() {
  const inputRef = useReactRef<TextInput>(null);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Instant keyboard focus on every app open ─────────────────────────
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }, [])
  );

  const handleSubmit = () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    // TODO Week 2: call notes.create mutation
    console.log("Submit:", text.trim());
    setText("");
    setSubmitting(false);
  };

  return (
    <View style={styles.container}>
      {/* ── Compose input ── */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Just type it..."
          placeholderTextColor={Colors.muted}
          multiline
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={handleSubmit}
          autoCorrect
        />
        {text.trim().length > 0 && (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Smart collections (stubbed for Week 2+) ── */}
      <ScrollView
        style={styles.collections}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.collectionsContent}
      >
        <CollectionStub label="Upcoming Reminders" count={0} />
        <CollectionStub label="Your Lists" count={0} />
        <CollectionStub label="Recent Ideas" count={0} />
        <CollectionStub label="Upcoming Events" count={0} />
      </ScrollView>
    </View>
  );
}

function CollectionStub({ label, count }: { label: string; count: number }) {
  return (
    <View style={styles.collectionCard}>
      <Text style={styles.collectionLabel}>{label}</Text>
      <Text style={styles.collectionCount}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: Spacing.md,
    marginTop: 60, // safe area padding — will use SafeAreaView in Week 2
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 56,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 17,
    lineHeight: 24,
    maxHeight: 140,
  },
  submitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  submitButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: "700",
  },
  collections: {
    flex: 1,
  },
  collectionsContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  collectionCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  collectionLabel: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  collectionCount: {
    color: Colors.muted,
    fontSize: 14,
  },
});
