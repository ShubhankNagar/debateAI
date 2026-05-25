/**
 * Main application header.
 */
import { Scale, GraduationCap, Sun, Moon } from "lucide-react";

interface Props {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Header({ theme, toggleTheme }: Props) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="#" className="flex items-center gap-3 group">
            <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 p-2 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Agora Debate
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest uppercase bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full ml-2">
                Grounder
              </span>
            </div>
          </a>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono font-medium bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-700/50">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Academic Standard Analysis</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
