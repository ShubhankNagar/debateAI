/**
 * Debate history persistence via localStorage.
 * Stores last 20 debates for quick re-access.
 */
import { useState, useCallback, useEffect } from "react";

export interface HistoryEntry {
  id: string;
  topic: string;
  timestamp: number;
  proSideName: string;
  conSideName: string;
  proCount: number;
  conCount: number;
}

const STORAGE_KEY = "agora_debate_history";
const MAX_HISTORY = 20;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function useDebateHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  // Sync when history changes
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addEntry = useCallback((entry: Omit<HistoryEntry, "timestamp">) => {
    setHistory((prev) => {
      // Remove duplicate if same ID exists
      const filtered = prev.filter((h) => h.id !== entry.id);
      return [{ ...entry, timestamp: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
