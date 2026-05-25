/**
 * DebatePointCard — Simplified, clean argument card.
 * 
 * Redesigned from 282 lines with 3 levels of nested expand/collapse
 * to a clean card with:
 * - Always visible: title, strength badge, quick takeaway
 * - Single expand toggle: detailed explanation + evidence
 * - CSS transitions instead of Framer Motion (~60KB saved)
 */
import { useState } from "react";
import { DebatePoint } from "../types";
import { ShieldCheck, Award, AlertCircle, ChevronDown, Quote } from "lucide-react";

interface DebatePointCardProps {
  key?: string | number;
  point: DebatePoint;
  type: "pro" | "con";
  defaultExpanded?: boolean;
}

const strengthConfig = {
  high: {
    icon: ShieldCheck,
    label: "Strong Evidence",
    classes: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40",
  },
  medium: {
    icon: Award,
    label: "Moderate Evidence",
    classes: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40",
  },
  low: {
    icon: AlertCircle,
    label: "Qualitative",
    classes: "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
  },
};

export default function DebatePointCard({ point, type, defaultExpanded = false }: DebatePointCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const borderColor = type === "pro" ? "border-l-emerald-500" : "border-l-rose-500";
  const strength = strengthConfig[point.evidenceStrength];
  const StrengthIcon = strength.icon;

  return (
    <div
      className={`bg-white dark:bg-slate-900/60 border-l-4 ${borderColor} border border-slate-200 dark:border-slate-800 rounded-r-xl overflow-hidden transition-shadow hover:shadow-md`}
    >
      {/* Header — always visible */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 sm:p-5 cursor-pointer select-none group"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
            {point.title}
          </h4>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${strength.classes}`}>
              <StrengthIcon className="h-3 w-3" />
              <span className="hidden sm:inline">{strength.label}</span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {/* Quick takeaway — always visible */}
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          {point.quickTakeaway}
        </p>
      </div>

      {/* Expandable detail section — CSS transition */}
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            {/* Detailed explanation */}
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {point.description}
            </p>

            {/* Evidence */}
            <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-3 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
              <Quote className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-[9px] uppercase tracking-wider block mb-1">
                  Supporting Evidence
                </span>
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-serif italic leading-relaxed">
                  {point.evidence}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
