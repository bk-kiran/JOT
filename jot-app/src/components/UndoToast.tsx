import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors, Spacing, UNDO_WINDOW_MS } from "@/lib/constants";
import { UndoEntry } from "@/hooks/useUndoToast";

const ACTION_LABELS: Record<string, string> = {
  reminder: "Reminder set",
  list_item: "Added to list",
  list_create: "List created",
  event: "Event saved",
  idea: "Idea captured",
};

interface Props {
  entry: UndoEntry;
  onUndo: () => void;
}

export function UndoToast({ entry, onUndo }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
    progress.setValue(1);

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Progress bar drains over 4 seconds
    Animated.timing(progress, {
      toValue: 0,
      duration: UNDO_WINDOW_MS,
      useNativeDriver: false,
    }).start();

    // Fade out at the end
    const fadeOut = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDismissed(true));
    }, UNDO_WINDOW_MS - 300);

    return () => clearTimeout(fadeOut);
  }, [entry._id]);

  if (dismissed) return null;

  const label = ACTION_LABELS[entry.actionType] ?? "Action taken";

  const handleUndo = () => {
    setDismissed(true);
    onUndo();
  };

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Progress bar */}
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />

      <View style={styles.content}>
        <View style={styles.labelRow}>
          <Text style={styles.icon}>✦</Text>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.rawText} numberOfLines={1}>
            · {entry.rawText}
          </Text>
        </View>

        <Pressable onPress={handleUndo} hitSlop={12}>
          <Text style={styles.undoButton}>UNDO</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: 12,
    backgroundColor: "rgba(13, 184, 245, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(13, 184, 245, 0.2)",
    overflow: "hidden",
  },
  progressBar: {
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: Spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  icon: {
    color: Colors.primary,
    fontSize: 10,
  },
  label: {
    fontFamily: "monospace",
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  rawText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    flex: 1,
  },
  undoButton: {
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 2,
    opacity: 0.9,
  },
});
