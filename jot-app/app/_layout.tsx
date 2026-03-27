import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { Slot, useRouter, useSegments } from "expo-router";
import { useCallback, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

// Custom auth hook that bridges Clerk Expo → Convex
function useAuthFromClerk() {
  const { isSignedIn, getToken, isLoaded } = useAuth();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        const token = await getToken({
          template: "convex",
          skipCache: forceRefreshToken,
        });
        return token ?? null;
      } catch {
        return null;
      }
    },
    [getToken]
  );

  return {
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn ?? false,
    fetchAccessToken,
  };
}

// Guards: redirect based on auth state
function AuthGuard() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(app)");
    }
  }, [isSignedIn, isLoaded, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromClerk}>
        <StatusBar style="light" />
        <AuthGuard />
      </ConvexProviderWithAuth>
    </ClerkProvider>
  );
}
