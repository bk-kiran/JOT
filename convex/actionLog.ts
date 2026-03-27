import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Write the action log entry and schedule the undo window to close.
// Called from the AI pipeline (Week 3). For Week 2 we call it directly
// as a stub to simulate a processed note.
export const write = internalMutation({
  args: {
    userId: v.id("users"),
    noteId: v.id("notes"),
    rawText: v.string(),
    actionType: v.union(
      v.literal("reminder"),
      v.literal("list_item"),
      v.literal("list_create"),
      v.literal("event"),
      v.literal("idea")
    ),
    targetReminderId: v.optional(v.id("reminders")),
    targetListId: v.optional(v.id("lists")),
    targetEventId: v.optional(v.id("events")),
    targetIdeaId: v.optional(v.id("ideas")),
    aiConfidence: v.number(),
    showToast: v.boolean(),
  },
  handler: async (ctx, args) => {
    const actionLogId = await ctx.db.insert("actionLog", {
      userId: args.userId,
      noteId: args.noteId,
      rawText: args.rawText,
      actionType: args.actionType,
      targetReminderId: args.targetReminderId,
      targetListId: args.targetListId,
      targetEventId: args.targetEventId,
      targetIdeaId: args.targetIdeaId,
      aiConfidence: args.aiConfidence,
      showToast: args.showToast,
      canUndo: true,
      createdAt: Date.now(),
    });

    // Close the undo window after 4 seconds
    await ctx.scheduler.runAfter(
      4000,
      internal.actionLog.closeUndoWindow,
      { actionLogId }
    );

    return actionLogId;
  },
});

// Flips canUndo to false — runs 4 seconds after action execution
export const closeUndoWindow = internalMutation({
  args: { actionLogId: v.id("actionLog") },
  handler: async (ctx, { actionLogId }) => {
    const entry = await ctx.db.get(actionLogId);
    if (!entry || !entry.canUndo) return;
    await ctx.db.patch(actionLogId, { canUndo: false });
  },
});

// Called when user taps "Undo" on the toast
export const undo = mutation({
  args: { actionLogId: v.id("actionLog") },
  handler: async (ctx, { actionLogId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const entry = await ctx.db.get(actionLogId);
    if (!entry) throw new Error("Action not found");
    if (!entry.canUndo) throw new Error("Undo window has closed");

    // Delete the created entity
    if (entry.targetReminderId) await ctx.db.delete(entry.targetReminderId);
    if (entry.targetListId) await ctx.db.delete(entry.targetListId);
    if (entry.targetEventId) await ctx.db.delete(entry.targetEventId);
    if (entry.targetIdeaId) await ctx.db.delete(entry.targetIdeaId);

    await ctx.db.patch(actionLogId, {
      canUndo: false,
      undoneAt: Date.now(),
    });
  },
});

// Real-time subscription: returns the latest undoable action for the current user.
// The home screen subscribes to this to show/hide the undo toast.
export const getLatestUndoable = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;

    // Get most recent action log entry
    const entries = await ctx.db
      .query("actionLog")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(1);

    const entry = entries[0];
    if (!entry || !entry.canUndo) return null;
    return entry;
  },
});

// Week 2 stub: simulate full pipeline without Claude.
// Creates an "idea" record and writes the action log.
// Week 3 replaces this with the real AI action.
export const processNoteStub = mutation({
  args: {
    noteId: v.id("notes"),
    rawText: v.string(),
  },
  handler: async (ctx, { noteId, rawText }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Create a stub idea entry
    const ideaId = await ctx.db.insert("ideas", {
      userId: user._id,
      rawText,
      cleanedText: rawText,
      tags: [],
      collectionName: "Captured Thoughts",
      createdAt: Date.now(),
    });

    // Write action log
    const actionLogId = await ctx.db.insert("actionLog", {
      userId: user._id,
      noteId,
      rawText,
      actionType: "idea",
      targetIdeaId: ideaId,
      aiConfidence: 1.0,
      showToast: true,
      canUndo: true,
      createdAt: Date.now(),
    });

    // Close undo window after 4s
    await ctx.scheduler.runAfter(
      4000,
      internal.actionLog.closeUndoWindow,
      { actionLogId }
    );

    // Hard delete the note
    await ctx.db.delete(noteId);

    return actionLogId;
  },
});
