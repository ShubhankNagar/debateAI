/**
 * Home page — Search hero, trending topics, and recent history.
 */
import React, { useState, useEffect, useRef } from "react";
import { Search, Globe2, AlertCircle } from "lucide-react";
import TopicSelector from "../components/TopicSelector";
import DebateHistory from "../components/DebateHistory";
import { PresetTopic } from "../types";
import { fetchPresetTopics } from "../lib/api";
import { useDebateHistory } from "../hooks/useDebateHistory";

interface Props {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
}

export default function HomePage({ onGenerate, isLoading }: Props) {
  const [topicInput, setTopicInput] = useState("");
  const [presetTopics, setPresetTopics] = useState<PresetTopic[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { history, removeEntry, clearHistory } = useDebateHistory();

  // Load presets
  useEffect(() => {
    const controller = new AbortController();
    fetchPresetTopics(controller.signal)
      .then(setPresetTopics)
      .catch((err) => {
        if (err.name !== "AbortError") setFetchError("Failed to load curated topics.");
      });
    return () => controller.abort();
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim()) {
      onGenerate(topicInput);
    }
  };

  return (
    <div className="space-y-16 pb-8 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-8 sm:pt-12">
        <div className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold font-mono tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
          <Globe2 className="h-3 w-3 animate-pulse text-emerald-400 dark:text-emerald-600" />
          <span>Search-Grounded Synthesis Engine</span>
        </div>
        
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
          Inspect Any Controversy. <br />
          <span className="text-slate-500 dark:text-slate-400 font-normal italic">Learn Both Spectrums.</span>
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Provide any complex scenario, public policy, or philosophical debate. Agora scans the live web, extracts empirical points, and crafts an objective round-by-round scholastic synthesis with authentic external sources.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto pt-4 relative">
          <div className="relative flex items-center bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus-within:border-slate-900 dark:focus-within:border-slate-100 focus-within:shadow-md transition-all p-1.5 pr-2 pl-4">
            <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="E.g., Should social media be banned for minors?"
              className="w-full bg-transparent border-0 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:ring-0 outline-none px-3 font-sans text-sm"
              disabled={isLoading}
            />
            <div className="hidden sm:flex items-center gap-1 mr-3 text-[10px] font-mono text-slate-400">
              <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
            <button
              type="submit"
              disabled={!topicInput.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all flex-shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white/90"
            >
              Synthesize
            </button>
          </div>
        </form>
      </section>

      {/* History Section */}
      {history.length > 0 && (
        <section className="max-w-5xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-12">
          <DebateHistory
            history={history}
            onSelect={onGenerate}
            onRemove={removeEntry}
            onClear={clearHistory}
          />
        </section>
      )}

      {/* Curated Presets Section */}
      <section className="max-w-5xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-12">
        {fetchError ? (
          <div className="flex items-center justify-center gap-2 text-rose-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{fetchError}</span>
          </div>
        ) : (
          <TopicSelector
            topics={presetTopics}
            onSelectTopic={onGenerate}
            isLoading={isLoading}
          />
        )}
      </section>
    </div>
  );
}
