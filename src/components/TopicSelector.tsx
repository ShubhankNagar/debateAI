/**
 * TopicSelector — Curated debates with clean UI and categories.
 */
import { useState } from "react";
import { PresetTopic } from "../types";
import { BookOpen, Sparkles, ChevronRight } from "lucide-react";

interface Props {
  topics: PresetTopic[];
  onSelectTopic: (topicTitle: string) => void;
  isLoading: boolean;
}

export default function TopicSelector({ topics, onSelectTopic, isLoading }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(topics.map((t) => t.category)))];
  const filtered = activeCategory === "All" ? topics : topics.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-serif font-semibold text-lg">
          <BookOpen className="h-4.5 w-4.5 text-slate-500" />
          <h2>Curated Debates of Public Impact</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select a sample dilemma to witness how Gemini synthesizes actual arguments and web-grounded sources.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const count = cat === "All" ? topics.length : topics.filter((t) => t.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white dark:bg-black/10 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((topic) => (
          <button
            key={topic.id}
            disabled={isLoading}
            onClick={() => onSelectTopic(topic.title)}
            className="text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md transition-all group relative flex flex-col justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div>
              <div className="flex justify-between items-start mb-2.5">
                <span className="text-[9px] font-bold font-mono tracking-wider text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 px-2 py-0.5 rounded">
                  {topic.category}
                </span>
                <span className="text-[10px] font-semibold font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-full">
                  {topic.difficulty}
                </span>
              </div>
              <h3 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-base mb-2 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                {topic.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
                {topic.description}
              </p>
            </div>
            
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-slate-400 group-hover:text-amber-500 transition-colors" />
                <span>Synthesize with AI</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
