/**
 * Centralized API client for the Agora Debate frontend.
 * Handles all server communication with error handling and typing.
 */
import { DebateResult, Source } from "../types";

export interface GenerateDebateResponse {
  success: boolean;
  id: string;
  debate: DebateResult;
  sources: Source[];
  isFallback: boolean;
  fallbackMessage?: string | null;
  fromCache?: boolean;
  error?: string;
}

export interface FetchDebateResponse extends GenerateDebateResponse {}

/**
 * Generate a new debate for a given topic.
 */
export async function generateDebate(
  topic: string,
  groundingEnabled: boolean,
  signal?: AbortSignal
): Promise<GenerateDebateResponse> {
  const response = await fetch("/api/generate-debate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: topic.trim(), groundingEnabled }),
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to generate debate. Please try again.");
  }

  return data;
}

/**
 * Fetch a previously generated debate by its share ID.
 */
export async function fetchDebateById(id: string, signal?: AbortSignal): Promise<FetchDebateResponse> {
  const response = await fetch(`/api/debate/${encodeURIComponent(id)}`, { signal });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Debate not found or has expired.");
  }

  return data;
}

/**
 * Fetch preset topics.
 */
export async function fetchPresetTopics(signal?: AbortSignal) {
  const response = await fetch("/api/preset-topics", { signal });
  if (!response.ok) throw new Error("Failed to load topics.");
  const data = await response.json();
  return data.topics || [];
}
