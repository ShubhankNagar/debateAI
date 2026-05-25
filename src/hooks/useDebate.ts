/**
 * Custom hook for debate generation with lifecycle management.
 */
import { useState, useCallback, useRef } from "react";
import { DebateResult, Source } from "../types";
import { generateDebate as apiGenerateDebate, fetchDebateById } from "../lib/api";

interface UseDebateState {
  debate: DebateResult | null;
  debateId: string | null;
  sources: Source[];
  fallbackMessage: string | null;
  isLoading: boolean;
  loadingTopic: string;
  error: string | null;
}

export function useDebate() {
  const [state, setState] = useState<UseDebateState>({
    debate: null,
    debateId: null,
    sources: [],
    fallbackMessage: null,
    isLoading: false,
    loadingTopic: "",
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const generateDebate = useCallback(async (topic: string, groundingEnabled: boolean) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({
      ...prev,
      debate: null,
      debateId: null,
      sources: [],
      fallbackMessage: null,
      isLoading: true,
      loadingTopic: topic,
      error: null,
    }));

    try {
      const data = await apiGenerateDebate(topic, groundingEnabled, controller.signal);
      setState({
        debate: data.debate,
        debateId: data.id,
        sources: data.sources || [],
        fallbackMessage: data.isFallback ? (data.fallbackMessage || "Rate limit mode enabled.") : null,
        isLoading: false,
        loadingTopic: "",
        error: null,
      });
      return data;
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "An unexpected error occurred.",
      }));
    }
  }, []);

  const loadDebateById = useCallback(async (id: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({
      ...prev,
      debate: null,
      debateId: null,
      sources: [],
      fallbackMessage: null,
      isLoading: true,
      loadingTopic: "Loading shared debate...",
      error: null,
    }));

    try {
      const data = await fetchDebateById(id, controller.signal);
      setState({
        debate: data.debate,
        debateId: data.id,
        sources: data.sources || [],
        fallbackMessage: data.isFallback ? (data.fallbackMessage || null) : null,
        isLoading: false,
        loadingTopic: "",
        error: null,
      });
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to load debate.",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({
      debate: null,
      debateId: null,
      sources: [],
      fallbackMessage: null,
      isLoading: false,
      loadingTopic: "",
      error: null,
    });
  }, []);

  return { ...state, generateDebate, loadDebateById, reset };
}
