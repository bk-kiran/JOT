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
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Colors, Spacing } from "@/lib/constants";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignUp = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      console.log("Verify result:", JSON.stringify({
        status: result.status,
        sessionId: result.createdSessionId,
        missingFields: result.missingFields,
        unverifiedFields: result.unverifiedFields,
      }));
      if (result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)");
      } else if (result.status === "complete") {
        // Session created but ID not on result — use signUp object directly
        router.replace("/(app)");
      } else {
        setError("Status: " + result.status + " | Missing: " + JSON.stringify(result.missingFields));
      }
    } catch (err: any) {
      console.error("Verify error:", err);
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>We sent a code to {email}</Text>

          <TextInput
            style={styles.input}
            placeholder="Verification code"
            placeholderTextColor={Colors.muted}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            autoFocus
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.primaryButton, loading && styles.disabled]}
            onPress={onVerify}
            disabled={loading || !code}
          >
            {loading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.primaryButtonText}>Verify</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>JOT</Text>
        <Text style={styles.tagline}>Create your account</Text>

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
          onPress={onSignUp}
          disabled={!email || !password || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.primaryButtonText}>Create account</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
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
  title: {
    fontSize: 28, fontWeight: "700", color: Colors.white,
    textAlign: "center", marginBottom: Spacing.xs,
  },
  subtitle: { fontSize: 14, color: Colors.muted, textAlign: "center", marginBottom: Spacing.lg },
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
  linkText: { color: Colors.primary, fontSize: 14, textAlign: "center", marginTop: Spacing.sm },
});
