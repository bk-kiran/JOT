import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@convex/_generated/api";
import { Colors, Spacing } from "@/lib/constants";
import { UndoToast } from "@/components/UndoToast";
import { useUndoToast } from "@/hooks/useUndoToast";

export default function HomeScreen() {
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();
  const [text, setText] = useState("");
  const [processingText, setProcessingText] = useState<string | null>(null);
  const processingOpacity = useRef(new Animated.Value(0)).current;
  const analyzingProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (processingText !== null) {
      processingOpacity.setValue(1);
      // Progress bar: fill to 80% over 1.3s, leaving room to complete on done
      analyzingProgress.setValue(0);
      Animated.timing(analyzingProgress, {
        toValue: 0.8,
        duration: 1300,
        useNativeDriver: false,
      }).start();
    }
  }, [processingText]);

  const clearProcessing = useCallback(() => {
    // Snap progress to 100% then fade the whole container out
    Animated.timing(analyzingProgress, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(processingOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setProcessingText(null);
        analyzingProgress.setValue(0);
        setTimeout(() => inputRef.current?.focus(), 50);
      });
    });
  }, []);

  const createNote = useMutation(api.notes.create);
  const processStub = useMutation(api.actionLog.processNoteStub);

  const remindersRaw = useQuery(api.reminders.listUpcoming);
  const listsRaw = useQuery(api.lists.listAll);
  const ideasRaw = useQuery(api.ideas.listRecent);

  // Stable display data — only updates when real values arrive, never flickers on reconnect
  const [reminders, setReminders] = useState<NonNullable<typeof remindersRaw>>([]);
  const [lists, setLists] = useState<NonNullable<typeof listsRaw>>([]);
  const [ideas, setIdeas] = useState<NonNullable<typeof ideasRaw>>([]);

  useEffect(() => { if (remindersRaw != null) setReminders(remindersRaw); }, [remindersRaw]);
  useEffect(() => { if (listsRaw != null) setLists(listsRaw); }, [listsRaw]);
  useEffect(() => { if (ideasRaw != null) setIdeas(ideasRaw); }, [ideasRaw]);
  const { undoEntry, handleUndo } = useUndoToast();

  // ── Instant keyboard focus on every app open ──────────────────────────
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }, [])
  );

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || processingText !== null) return;

    setText("");
    setProcessingText(trimmed);

    // Safety net: force-clear after 15s in case mutations hang
    const safetyTimer = setTimeout(() => {
      clearProcessing();
    }, 15000);

    const startTime = Date.now();

    try {
      const { noteId } = await createNote({ rawText: trimmed });
      await processStub({ noteId, rawText: trimmed });
      // Minimum 1.5s so the analyzing state feels deliberate
      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) {
        await new Promise((r) => setTimeout(r, 1500 - elapsed));
      }
    } catch (err: any) {
      console.error("Submit error:", err?.message ?? err);
      if (err?.message === "RATE_LIMIT") {
        alert("You've hit the daily limit. Upgrade to Pro for unlimited notes.");
      } else {
        alert("Error: " + (err?.message ?? JSON.stringify(err)));
      }
    } finally {
      clearTimeout(safetyTimer);
      clearProcessing();
    }
  };

  const isProcessing = processingText !== null;

  return (
    <View style={styles.root}>
      {/* Teal glow orb */}
      <View style={styles.glowOrb} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.logo}>jot</Text>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => router.push("/(app)/settings")}
          >
            <Text style={styles.avatarIcon}>⊹</Text>
          </TouchableOpacity>
        </View>

        {/* ── Undo toast — only after analyzing is done ── */}
        {undoEntry && !isProcessing && (
          <UndoToast entry={undoEntry} onUndo={handleUndo} />
        )}
      </SafeAreaView>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Main input area ── */}
        <Pressable
          style={styles.inputArea}
          onPress={() => inputRef.current?.focus()}
        >
          {isProcessing ? (
            // Processing state — show struck-through text + analyzing indicator
            <Animated.View style={[styles.processingContainer, { opacity: processingOpacity }]}>
              <Text style={styles.processingText}>{processingText}</Text>
              <View style={styles.analyzeRow}>
                <View style={styles.analyzingTrack}>
                  <Animated.View style={[
                    styles.analyzingLine,
                    { width: analyzingProgress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }
                  ]} />
                </View>
                <View style={styles.analyzingLabelRow}>
                  <Text style={styles.analyzingIcon}>✦</Text>
                  <Text style={styles.analyzingLabel}>ANALYZING...</Text>
                </View>
              </View>
            </Animated.View>
          ) : (
            <>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="just type..."
                placeholderTextColor="rgba(255,255,255,0.12)"
                multiline
                blurOnSubmit
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                autoCorrect
                autoCapitalize="sentences"
              />
              {text.trim().length > 0 && (
                <Pressable style={styles.sendButton} onPress={handleSubmit}>
                  <Text style={styles.sendButtonText}>→</Text>
                </Pressable>
              )}
            </>
          )}
        </Pressable>

        {/* ── Collections label ── */}
        {!isProcessing && (
          <View style={styles.collectionsSection}>
            <Text style={styles.collectionsLabel}>
              TECHNICAL VOID  /  CAPTURED THOUGHTS
            </Text>

            {/* ── Collections grid ── */}
            <ScrollView
              horizontal={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.grid}
            >
              {/* Reminders tile */}
              {reminders.length > 0 && (
                <CollectionTile
                  label="Reminders"
                  count={reminders.length}
                  onPress={() => router.push("/(app)/reminders")}
                />
              )}

              {/* List tiles */}
              {lists.map((list) => (
                <CollectionTile
                  key={list._id}
                  label={list.name}
                  count={list.itemCount}
                  onPress={() => router.push(`/(app)/lists/${list._id}`)}
                />
              ))}

              {/* Ideas tile */}
              {ideas.length > 0 && (
                <CollectionTile
                  label="Ideas"
                  count={ideas.length}
                  onPress={() => router.push("/(app)/ideas")}
                />
              )}

              {/* Empty state */}
              {reminders.length === 0 && lists.length === 0 && ideas.length === 0 && (
                <Text style={styles.emptyHint}>
                  Your captured thoughts will appear here.
                </Text>
              )}
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

function CollectionTile({
  label,
  count,
  onPress,
}: {
  label: string;
  count: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.tileCount}>{count}</Text>
      <Text style={styles.tileLabel} numberOfLines={2}>{label}</Text>
    </TouchableOpacity>
  );
}

const TILE_SIZE = 80;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: { flex: 1 },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  // Teal glow background orb
  glowOrb: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(0, 180, 150, 0.07)",
    top: "30%",
    alignSelf: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  logo: {
    fontFamily: "monospace",
    fontSize: 18,
    fontWeight: "400",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 2,
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 18,
  },

  // Input area — takes up most of the screen
  inputArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 100, // clears the absolute header
    justifyContent: "center",
  },
  input: {
    fontFamily: "monospace",
    fontSize: 28,
    fontWeight: "300",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 40,
    maxHeight: 240,
  },

  // Processing state
  processingContainer: {
    gap: Spacing.lg,
  },
  processingText: {
    fontFamily: "monospace",
    fontSize: 28,
    fontWeight: "300",
    color: "rgba(255,255,255,0.35)",
    lineHeight: 40,
    textDecorationLine: "line-through",
    textDecorationColor: "rgba(255,255,255,0.2)",
  },
  analyzeRow: {
    gap: Spacing.sm,
  },
  analyzingTrack: {
    width: "65%",
    height: 1,
    backgroundColor: "rgba(13, 184, 245, 0.15)",
  },
  analyzingLine: {
    height: 1,
    backgroundColor: Colors.primary,
    opacity: 0.8,
  },
  analyzingLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  analyzingIcon: {
    color: Colors.primary,
    fontSize: 12,
  },
  analyzingLabel: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 3,
    color: Colors.primary,
    opacity: 0.85,
  },

  // Collections section
  collectionsSection: {
    paddingBottom: Spacing.xl,
  },
  collectionsLabel: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 2.5,
    color: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    padding: Spacing.sm,
    justifyContent: "space-between",
  },
  tileCount: {
    fontFamily: "monospace",
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.55)",
  },
  tileLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  emptyHint: {
    color: "rgba(255,255,255,0.15)",
    fontSize: 12,
    fontFamily: "monospace",
    paddingVertical: Spacing.md,
  },
  sendButton: {
    alignSelf: "flex-end",
    marginTop: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: Colors.background,
    fontSize: 20,
    fontWeight: "700",
  },
});
