import { Tabs } from "expo-router";
import { Colors } from "@/lib/constants";
import { useEffect } from "react";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "@convex/_generated/api";
import { getLocales } from "expo-localization";

// Creates user record if it doesn't exist, then sets timezone.
// Waits for Convex to confirm the JWT is valid before calling mutations.
function AppInitializer() {
  const ensureUser = useMutation(api.users.ensureUser);
  const setTimezone = useMutation(api.users.setTimezone);
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const tz = getLocales()[0]?.timezone ?? "UTC";
    ensureUser()
      .then(() => setTimezone({ timezone: tz }))
      .catch((err) => console.error("AppInitializer error:", err));
  }, [isAuthenticated]);

  return null;
}

export default function AppLayout() {
  return (
    <>
      <AppInitializer />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.card,
            borderTopColor: Colors.border,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.muted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: "Capture", tabBarLabel: "Capture" }}
        />
        <Tabs.Screen
          name="reminders"
          options={{ title: "Reminders", tabBarLabel: "Reminders" }}
        />
        <Tabs.Screen
          name="lists/index"
          options={{ title: "Lists", tabBarLabel: "Lists" }}
        />
        <Tabs.Screen
          name="ideas"
          options={{ title: "Ideas", tabBarLabel: "Ideas" }}
        />
        <Tabs.Screen
          name="settings"
          options={{ title: "Settings", tabBarLabel: "Settings" }}
        />
        {/* Hide nested list screen from tab bar */}
        <Tabs.Screen
          name="lists/[listId]"
          options={{ href: null }}
        />
      </Tabs>
    </>
  );
}
