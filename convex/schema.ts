import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // ── Users ──────────────────────────────────────────────────────────────
  users: defineTable({
    clerkId: v.string(),              // Clerk's user.id
    email: v.string(),
    name: v.optional(v.string()),
    timezone: v.string(),             // IANA e.g. "America/New_York"
    expoPushToken: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro")),
    noteCountToday: v.number(),       // reset by daily cron
    noteDateResetAt: v.number(),      // Unix ms — when noteCountToday was last zeroed
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // ── Ephemeral Notes (alive only during AI processing) ──────────────────
  // Created → processed by Claude → hard DELETED. Never soft-deleted.
  // actionLog is written BEFORE deletion so undo has a source of truth.
  notes: defineTable({
    userId: v.id("users"),
    rawText: v.string(),
    status: v.union(
      v.literal("pending"),           // just created, AI not started
      v.literal("processing"),        // Claude API call in-flight
      v.literal("awaiting_confirm"),  // confidence < 0.60, waiting on user
      v.literal("done")              // action executed, about to be deleted
    ),
    aiJobId: v.optional(v.string()),  // Convex scheduled function ID
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"]),

  // ── Action Log (undo source of truth) ──────────────────────────────────
  // Written BEFORE the ephemeral note is deleted.
  actionLog: defineTable({
    userId: v.id("users"),
    noteId: v.id("notes"),
    rawText: v.string(),              // snapshot of original text
    actionType: v.union(
      v.literal("reminder"),
      v.literal("list_item"),
      v.literal("list_create"),
      v.literal("event"),
      v.literal("idea")
    ),
    // One of these is set depending on actionType:
    targetReminderId: v.optional(v.id("reminders")),
    targetListId: v.optional(v.id("lists")),
    targetEventId: v.optional(v.id("events")),
    targetIdeaId: v.optional(v.id("ideas")),
    aiConfidence: v.number(),
    showToast: v.boolean(),           // true for confidence 0.60–0.85 and below
    canUndo: v.boolean(),             // flipped to false after 4s window closes
    undoneAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_noteId", ["noteId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),

  // ── Reminders ──────────────────────────────────────────────────────────
  reminders: defineTable({
    userId: v.id("users"),
    title: v.string(),
    body: v.optional(v.string()),
    scheduledFor: v.number(),         // Unix ms
    timezone: v.string(),             // user's timezone at creation time
    status: v.union(
      v.literal("pending"),
      v.literal("delivered"),
      v.literal("done"),
      v.literal("snoozed"),
      v.literal("cancelled")
    ),
    scheduledJobId: v.optional(v.string()),
    snoozeHistory: v.array(v.object({
      snoozeType: v.union(
        v.literal("1h"),
        v.literal("tomorrow_morning"),
        v.literal("custom")
      ),
      originalTime: v.number(),
      newTime: v.number(),
      snoozedAt: v.number(),
    })),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_scheduledFor", ["userId", "scheduledFor"]),

  // ── Lists ───────────────────────────────────────────────────────────────
  lists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    emoji: v.optional(v.string()),
    itemCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_name", ["userId", "name"]),

  // ── List Items ──────────────────────────────────────────────────────────
  // position is a float for fractional indexing (insert without renumbering)
  listItems: defineTable({
    listId: v.id("lists"),
    userId: v.id("users"),
    text: v.string(),
    position: v.number(),             // fractional index float
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_listId", ["listId"])
    .index("by_listId_position", ["listId", "position"])
    .index("by_userId", ["userId"]),

  // ── Events ─────────────────────────────────────────────────────────────
  events: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    scheduledFor: v.number(),         // Unix ms
    timezone: v.string(),
    status: v.union(
      v.literal("upcoming"),
      v.literal("past"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_scheduledFor", ["userId", "scheduledFor"]),

  // ── Ideas ───────────────────────────────────────────────────────────────
  ideas: defineTable({
    userId: v.id("users"),
    rawText: v.string(),
    cleanedText: v.string(),          // AI-cleaned version
    tags: v.array(v.string()),
    collectionName: v.string(),       // AI-assigned bucket e.g. "Work Ideas"
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_userId_collection", ["userId", "collectionName"]),
});
