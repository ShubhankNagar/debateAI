/**
 * App footer component.
 */
import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-6 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          <span>Agora Debate — AI-Powered Debate Synthesizer</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Powered by Gemini & Google Search</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
