import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { rawText: v.string() },
  handler: async (ctx, { rawText }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Free tier rate limit
    if (user.plan === "free" && user.noteCountToday >= 10) {
      throw new Error("RATE_LIMIT");
    }

    // Increment daily count
    await ctx.db.patch(user._id, {
      noteCountToday: user.noteCountToday + 1,
    });

    const noteId = await ctx.db.insert("notes", {
      userId: user._id,
      rawText: rawText.trim(),
      status: "pending",
      createdAt: Date.now(),
    });

    return { noteId, userId: user._id };
  },
});

// Mark note as processing (called at start of AI pipeline)
export const setProcessing = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, { noteId }) => {
    await ctx.db.patch(noteId, { status: "processing" });
  },
});

// Mark note as awaiting user confirmation (low confidence)
export const setAwaitingConfirm = mutation({
  args: {
    noteId: v.id("notes"),
    aiResult: v.any(),
  },
  handler: async (ctx, { noteId, aiResult }) => {
    await ctx.db.patch(noteId, {
      status: "awaiting_confirm",
    });
  },
});

// Hard delete the note — called after action is executed
export const hardDelete = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, { noteId }) => {
    await ctx.db.delete(noteId);
  },
});

// Get pending notes for the current user (for processing state UI)
export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("notes")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", user._id).eq("status", "pending")
      )
      .order("desc")
      .take(1);
  },
});
