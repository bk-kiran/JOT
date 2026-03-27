import { query } from "./_generated/server";
import { v } from "convex/values";

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    const now = Date.now();
    return await ctx.db
      .query("reminders")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", user._id).eq("status", "pending")
      )
      .filter((q) => q.gt(q.field("scheduledFor"), now))
      .order("asc")
      .take(20);
  },
});
