import { useState } from "react";
import { DebateResult, Source } from "../types";
import DebatePointCard from "./DebatePointCard";
import ShareDebate from "./ShareDebate";
import {
  Scale, FileText, ExternalLink, TrendingUp, ChevronRight, Globe,
  Zap, BookOpen, ArrowLeft, Printer, AlertTriangle, Handshake, MessageSquare,
} from "lucide-react";

interface Props {
  debate: DebateResult;
  debateId: string | null;
  sources: Source[];
  fallbackMessage?: string | null;
  onReset: () => void;
  onExploreTopic: (topic: string) => void;
}

type TabId = "overview" | "arguments" | "transcript" | "consensus";
const TABS: { id: TabId; label: string; icon: typeof Globe }[] = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "arguments", label: "Arguments", icon: Scale },
  { id: "transcript", label: "Transcript", icon: MessageSquare },
  { id: "consensus", label: "Common Ground", icon: Handshake },
];

export default function DebateExplorer({ debate, debateId, sources, fallbackMessage, onReset, onExploreTopic }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedRound, setSelectedRound] = useState(1);
  const [expandAllArgs, setExpandAllArgs] = useState(false);

  const safeHost = (url: string) => { try { return new URL(url).hostname; } catch { return url; } };

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in" id="debate-explorer">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button onClick={onReset} className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors self-start cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" /><span>New Debate</span>
        </button>
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-md border ${fallbackMessage ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40" : "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40"}`}>
            {fallbackMessage ? "AI Synthesis" : "✓ Web-Grounded"}
          </span>
          {debateId && <ShareDebate debateId={debateId} topic={debate.topic} />}
          <button onClick={() => window.print()} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer" title="Print / PDF">
            <Printer className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {fallbackMessage && (
        <div className="bg-amber-50 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">{fallbackMessage}</p>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-colors print:shadow-none">
        <div className="p-5 sm:p-7 pb-0">
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 mb-2 leading-tight">{debate.topic}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl mb-4">{debate.summary}</p>
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 mb-5">
            <TrendingUp className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <div><span className="font-semibold text-slate-800 dark:text-slate-200">Current Context: </span>{debate.realWorldStatus}</div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-0 -mb-px">
            {TABS.map((tab) => { const Icon = tab.icon; return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? "border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-50" : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
                <Icon className="h-3.5 w-3.5" />{tab.label}
              </button>
            ); })}
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800" />
        <div className="p-5 sm:p-7">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-serif font-bold text-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-mono">A</span>
                      <h3>{debate.proSideName}</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{debate.proPoints.length} supporting arguments with evidence.</p>
                  </div>
                  <div className="bg-rose-50/40 dark:bg-rose-950/10 border border-rose-200/60 dark:border-rose-800/30 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-serif font-bold text-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-mono">B</span>
                      <h3>{debate.conSideName}</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{debate.conPoints.length} counter-arguments with evidence.</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5"><FileText className="h-4 w-4 text-slate-500" />Synthesis</h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4">"{debate.synthesis}"</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 space-y-3 h-fit">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-serif font-bold text-sm"><Globe className="h-4 w-4 text-slate-500" /><h3>Sources</h3></div>
                {sources.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {sources.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 transition-all group">
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-2 font-serif">{i+1}. {s.title}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 mt-0.5 flex-shrink-0" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block mt-1 line-clamp-1">{safeHost(s.url)}</span>
                      </a>
                    ))}
                  </div>
                ) : (<p className="text-center py-4 text-xs text-slate-400 font-mono">No web sources. Using AI knowledge.</p>)}
              </div>
            </div>
          )}

          {activeTab === "arguments" && (
            <div className="space-y-5">
              <div className="flex justify-end">
                <button onClick={() => setExpandAllArgs(!expandAllArgs)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  {expandAllArgs ? <Zap className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                  {expandAllArgs ? "Collapse All" : "Expand All"}
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1"><span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold font-mono">A</span><h3 className="font-serif font-bold text-emerald-900 dark:text-emerald-300 text-sm">{debate.proSideName}</h3></div>
                  {debate.proPoints.map((p, i) => <DebatePointCard key={`pro-${i}`} point={p} type="pro" defaultExpanded={expandAllArgs} />)}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1"><span className="h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold font-mono">B</span><h3 className="font-serif font-bold text-rose-900 dark:text-rose-300 text-sm">{debate.conSideName}</h3></div>
                  {debate.conPoints.map((p, i) => <DebatePointCard key={`con-${i}`} point={p} type="con" defaultExpanded={expandAllArgs} />)}
                </div>
              </div>
            </div>
          )}

          {activeTab === "transcript" && (
            <div className="space-y-5">
              <div className="bg-slate-950 dark:bg-slate-800/60 border border-slate-800 dark:border-slate-700 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3"><div className="bg-white/10 p-2 rounded-lg"><Scale className="h-4 w-4" /></div><div><h4 className="font-serif font-bold text-sm">Debate Transcript</h4><p className="text-[10px] text-slate-400 font-mono">Round-by-round arguments</p></div></div>
                <div className="flex bg-white/10 rounded-lg p-1 text-xs self-start sm:self-center">
                  {debate.timelineRounds.map((r) => (
                    <button key={r.roundNumber} onClick={() => setSelectedRound(r.roundNumber)} className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${selectedRound === r.roundNumber ? "bg-white text-slate-900 shadow" : "text-slate-300 hover:text-white"}`}>Round {r.roundNumber}</button>
                  ))}
                </div>
              </div>
              {debate.timelineRounds.filter((r) => r.roundNumber === selectedRound).map((round) => (
                <div key={round.roundNumber} className="space-y-5 animate-fade-in">
                  <div className="text-center py-2"><span className="font-serif italic font-bold text-base text-slate-800 dark:text-slate-200">{round.roundName}</span></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-mono font-bold text-[10px]">PRO</div><span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">{debate.proSideName}</span></div>
                      <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-800/20 rounded-xl p-4 text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-serif italic">{round.proSpeech}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center font-mono font-bold text-[10px]">CON</div><span className="text-xs font-bold font-mono text-rose-700 dark:text-rose-400 uppercase tracking-wide">{debate.conSideName}</span></div>
                      <div className="bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/60 dark:border-rose-800/20 rounded-xl p-4 text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-serif italic">{round.conSpeech}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "consensus" && (
            <div className="space-y-6">
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-200/60 dark:border-indigo-800/30 rounded-xl p-5 space-y-2">
                <h3 className="font-serif font-bold text-sm text-indigo-900 dark:text-indigo-300 flex items-center gap-2"><Handshake className="h-4 w-4 text-indigo-500" />Shared Values & Common Ground</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{debate.commonGround}</p>
              </div>
              {debate.suggestedFurtherQuestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5"><Globe className="h-4 w-4 text-slate-400" />Explore Further</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {debate.suggestedFurtherQuestions.map((q, i) => (
                      <button key={i} onClick={() => onExploreTopic(q)} className="text-left bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 hover:border-slate-400 dark:hover:border-slate-500 transition-all cursor-pointer group flex items-start gap-2.5 hover:shadow-sm">
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 mt-0.5 flex-shrink-0" />
                        <div><p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{q}</p><span className="text-[10px] font-mono text-slate-400 block mt-1">Generate debate →</span></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
