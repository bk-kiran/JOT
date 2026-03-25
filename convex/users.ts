import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Called from the Clerk webhook (http.ts) — internal only
export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { clerkId, email, name }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (existing) {
      // Update mutable fields only
      await ctx.db.patch(existing._id, { email, name });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId,
      email,
      name,
      timezone: "UTC",              // updated by client on first launch
      plan: "free",
      noteCountToday: 0,
      noteDateResetAt: Date.now(),
      createdAt: Date.now(),
    });
  },
});

// Called from the app immediately after sign-in to ensure user record exists.
// This is the client-side fallback — the Clerk webhook does the same thing
// but requires webhook setup. This works without it.
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email ?? "",
      name: identity.name ?? undefined,
      timezone: "UTC",
      plan: "free",
      noteCountToday: 0,
      noteDateResetAt: Date.now(),
      createdAt: Date.now(),
    });
  },
});

// Called from the app on first launch to set the user's actual timezone
export const setTimezone = mutation({
  args: { timezone: v.string() },
  handler: async (ctx, { timezone }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { timezone });
  },
});

// Called on app foreground after getting the Expo push token
export const updatePushToken = mutation({
  args: { expoPushToken: v.string() },
  handler: async (ctx, { expoPushToken }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { expoPushToken });
  },
});

// The primary "who am I" query — subscribed to by the root layout
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

// Internal: called by the daily cron to reset noteCountToday for all users
export const resetDailyNoteCount = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const users = await ctx.db.query("users").collect();
    await Promise.all(
      users.map((u) =>
        ctx.db.patch(u._id, { noteCountToday: 0, noteDateResetAt: now })
      )
    );
  },
});
