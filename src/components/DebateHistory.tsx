/**
 * Debate history panel — shows recent debates from localStorage.
 */
import { HistoryEntry } from "../hooks/useDebateHistory";
import { Clock, Trash2, ArrowRight, History } from "lucide-react";

interface DebateHistoryProps {
  history: HistoryEntry[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DebateHistory({ history, onSelect, onRemove, onClear }: DebateHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <History className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <h2 className="font-serif font-semibold text-base">Recent Debates</h2>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-[11px] font-medium text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.slice(0, 6).map((entry) => (
          <div
            key={entry.id}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer relative"
            onClick={() => onSelect(entry.id)}
          >
            <h3 className="font-serif font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 pr-6 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
              {entry.topic}
            </h3>
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(entry.timestamp)}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
                <span>{entry.proCount + entry.conCount} points</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(entry.id);
              }}
              className="absolute top-3 right-3 p-1 rounded-md text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              title="Remove from history"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
