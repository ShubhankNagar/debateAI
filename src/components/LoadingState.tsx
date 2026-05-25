/**
 * Progress indicator during debate generation.
 */
import { useState, useEffect } from "react";
import { Scale, Globe, Search, BrainCircuit, FileSearch2, Loader2 } from "lucide-react";

const STAGES = [
  { icon: Globe, text: "Configuring Gemini Google Search Grounding...", duration: 2500 },
  { icon: Search, text: "Scanning the public internet for active controversies...", duration: 3500 },
  { icon: FileSearch2, text: "Reading debate forums, legal briefs, and editorials...", duration: 4500 },
  { icon: BrainCircuit, text: "Evaluating evidence strengths and parsing viewpoints...", duration: 5500 },
  { icon: Scale, text: "Drafting an objective 3-round speaker transcript...", duration: 5000 }, // Stays here until done
];

export default function LoadingState({ topic }: { topic: string }) {
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Animate progress bar smoothly
  useEffect(() => {
    const totalDuration = STAGES.reduce((acc, s) => acc + s.duration, 0) - STAGES[STAGES.length-1].duration; // Approx 16s
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min(95, (elapsed / totalDuration) * 100); // cap at 95% until actually done
      setProgress(percent);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Advance stages
  useEffect(() => {
    if (stageIdx >= STAGES.length - 1) return;
    
    const timer = setTimeout(() => {
      setStageIdx(prev => Math.min(STAGES.length - 1, prev + 1));
    }, STAGES[stageIdx].duration);

    return () => clearTimeout(timer);
  }, [stageIdx]);

  const CurrentIcon = STAGES[stageIdx].icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-8 animate-fade-in w-full">
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 dark:border-emerald-500/30 animate-ping" />
        <div className="relative bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 p-4 rounded-full shadow-lg">
          <CurrentIcon className="h-6 w-6 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2 w-full">
        <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-100">
          Synthesizing Debate
        </h3>
        <p className="text-sm font-mono text-slate-500 dark:text-slate-400 line-clamp-1 italic max-w-md mx-auto">
          "{topic}"
        </p>

        {/* Real progress bar */}
        <div className="w-full max-w-md mx-auto mt-6">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-900 dark:bg-slate-100 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        {STAGES.map((stage, i) => {
          const isDone = i < stageIdx;
          const isActive = i === stageIdx;
          const isPending = i > stageIdx;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isActive ? "opacity-100 translate-x-0" : 
                isDone ? "opacity-40 translate-x-0" : 
                "opacity-0 translate-x-4 h-0 overflow-hidden" // Hide future stages
              }`}
            >
              <div className={`h-2 w-2 rounded-full flex-shrink-0 transition-colors ${
                isDone ? "bg-emerald-500" : isActive ? "bg-slate-900 dark:bg-slate-100 animate-pulse" : ""
              }`} />
              <span className={`text-xs ${isActive ? "text-slate-800 dark:text-slate-200 font-medium" : "text-slate-500 dark:text-slate-500"} line-clamp-1`}>
                {stage.text}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>This usually takes 10-15 seconds...</span>
      </div>
    </div>
  );
}
