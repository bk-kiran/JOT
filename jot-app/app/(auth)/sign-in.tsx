import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import { Colors, Spacing } from "@/lib/constants";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: "oauth_apple" });
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onOAuth = useCallback(async (flow: typeof startGoogleFlow) => {
    try {
      const { createdSessionId, setActive: setActiveOAuth } = await flow();
      if (createdSessionId) {
        await setActiveOAuth!({ session: createdSessionId });
        router.replace("/(app)");
      }
    } catch (err) {
      console.error("OAuth error:", err);
      setError("OAuth sign in failed");
    }
  }, []);

  const onSignIn = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signIn.create({ identifier: email, password });
      console.log("Sign in status:", result.status, "session:", result.createdSessionId);
      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)");
      } else {
        setError("Sign in incomplete — status: " + result.status);
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>JOT</Text>
        <Text style={styles.tagline}>Just type it. We'll handle the rest.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={[styles.primaryButton, (!email || !password || loading) && styles.disabled]}
          onPress={onSignIn}
          disabled={!email || !password || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.primaryButtonText}>Sign in</Text>
          )}
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.socialButton} onPress={() => onOAuth(startAppleFlow)}>
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </Pressable>

        <Pressable style={styles.socialButton} onPress={() => onOAuth(startGoogleFlow)}>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/sign-up")}>
          <Text style={styles.linkText}>No account? Sign up</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  logo: {
    fontSize: 48, fontWeight: "800", color: Colors.primary,
    textAlign: "center", letterSpacing: 4, marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 15, color: Colors.muted,
    textAlign: "center", marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: Spacing.md, paddingVertical: 14,
    color: Colors.white, fontSize: 16,
  },
  errorText: { color: Colors.error, fontSize: 13, textAlign: "center" },
  primaryButton: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: "center", marginTop: Spacing.xs,
  },
  primaryButtonText: { color: Colors.background, fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.5 },
  divider: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.muted, fontSize: 13 },
  socialButton: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingVertical: 14, alignItems: "center",
  },
  socialButtonText: { color: Colors.white, fontSize: 15, fontWeight: "600" },
  linkText: { color: Colors.primary, fontSize: 14, textAlign: "center", marginTop: Spacing.sm },
});
