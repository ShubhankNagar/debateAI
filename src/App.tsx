/**
 * App.tsx — Rewritten to use hash routing and global state hooks.
 * Removed all inline logic, clean architecture.
 */
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingState from "./components/LoadingState";
import DebateExplorer from "./components/DebateExplorer";
import HomePage from "./pages/HomePage";
import { useDebate } from "./hooks/useDebate";
import { useDebateHistory } from "./hooks/useDebateHistory";
import { ToastProvider, useToast } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";

function AppContent() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { debate, debateId, sources, fallbackMessage, isLoading, loadingTopic, error, generateDebate, loadDebateById, reset } = useDebate();
  const { addEntry } = useDebateHistory();
  const { showToast } = useToast();

  // Hash-based router state
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  // Sync theme
  useEffect(() => {
    const cached = localStorage.getItem("agora_theme") as "light" | "dark" | null;
    if (cached) setTheme(cached);
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("agora_theme", next);
  };

  // Handle errors via toast
  useEffect(() => {
    if (error) showToast("error", error);
  }, [error, showToast]);

  // Handle successful generation -> add to history & update URL
  useEffect(() => {
    if (debate && debateId) {
      addEntry({
        id: debateId,
        topic: debate.topic,
        proSideName: debate.proSideName,
        conSideName: debate.conSideName,
        proCount: debate.proPoints.length,
        conCount: debate.conPoints.length
      });
      window.location.hash = `/debate/${debateId}`;
    }
  }, [debate, debateId, addEntry]);

  // Router listener
  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Route matching
  useEffect(() => {
    const match = currentHash.match(/^#\/debate\/(.+)$/);
    if (match && match[1]) {
      const idInUrl = match[1];
      // Only load if we don't already have this exact debate loaded
      if (debateId !== idInUrl && !isLoading) {
        loadDebateById(idInUrl);
      }
    } else if (currentHash === "" || currentHash === "#/") {
      if (debate || isLoading) reset();
    }
  }, [currentHash, loadDebateById, reset, debateId, isLoading, debate]);

  const handleGenerate = async (topic: string) => {
    // Navigate home visually first so loading state shows there
    window.location.hash = "/";
    await generateDebate(topic, true); // Grounding always true for simplicity now
  };

  const handleReset = () => {
    window.location.hash = "/";
    reset();
  };

  // Render logic
  let content;
  if (isLoading) {
    content = <LoadingState topic={loadingTopic} />;
  } else if (debate) {
    content = (
      <DebateExplorer
        debate={debate}
        debateId={debateId}
        sources={sources}
        fallbackMessage={fallbackMessage}
        onReset={handleReset}
        onExploreTopic={handleGenerate}
      />
    );
  } else {
    content = <HomePage onGenerate={handleGenerate} isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-slate-900 dark:selection:bg-slate-100 selection:text-white dark:selection:text-slate-900 transition-colors">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {content}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}
