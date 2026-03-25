import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Reset every user's daily note count at midnight UTC
crons.daily(
  "reset daily note count",
  { hourUTC: 0, minuteUTC: 0 },
  internal.users.resetDailyNoteCount,
  {}
);

export default crons;
