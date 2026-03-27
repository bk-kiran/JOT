import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";

export function useUndoToast() {
  const rawEntry = useQuery(api.actionLog.getLatestUndoable);
  const undoMutation = useMutation(api.actionLog.undo);

  // Stable entry — only updates when a real entry arrives.
  // Never clears on null/undefined so reconnects don't flash the toast away.
  // The UndoToast component handles its own 4s dismissal internally.
  const [undoEntry, setUndoEntry] = useState<Doc<"actionLog"> | null>(null);

  useEffect(() => {
    if (rawEntry != null) setUndoEntry(rawEntry);
  }, [rawEntry]);

  const handleUndo = async () => {
    if (!undoEntry) return;
    try {
      await undoMutation({ actionLogId: undoEntry._id });
    } catch (err) {
      console.error("Undo failed:", err);
    }
  };

  return { undoEntry, handleUndo };
}

export type UndoEntry = Doc<"actionLog">;
