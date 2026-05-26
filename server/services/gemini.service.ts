/**
 * Gemini AI service — encapsulates all Gemini API interactions.
 * Handles client initialization, retry logic, and response parsing.
 */
import { GoogleGenAI } from "@google/genai";
import { DEBATE_SYSTEM_PROMPT } from "../prompts/debate.prompt";

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Set it in your .env.local file.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * Clean and parse Gemini response text to extract valid JSON.
 */
function parseGeminiJSON(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.substring(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.substring(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.substring(0, cleaned.length - 3);
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

export interface GeminiDebateResult {
  debate: any;
  sources: Array<{ title: string; url: string }>;
  isFallback: boolean;
  fallbackMessage: string | null;
}

/**
 * Generate a debate using Gemini with Google Search grounding (Tier 1).
 */
async function generateGrounded(topic: string): Promise<GeminiDebateResult> {
  const ai = getClient();
  console.log(`[Gemini] Tier 1: Grounded synthesis for "${topic}"`);

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Search the web and synthesize an objective, high-quality debate on the topic: "${topic}"`,
    config: {
      systemInstruction: DEBATE_SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini grounded synthesis.");

  const debate = parseGeminiJSON(text);
  const sources: Array<{ title: string; url: string }> = [];

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks && Array.isArray(chunks)) {
    for (const chunk of chunks) {
      if (chunk.web?.uri) {
        const title = chunk.web.title || safeHostname(chunk.web.uri);
        if (!sources.some((s) => s.url === chunk.web!.uri)) {
          sources.push({ title, url: chunk.web.uri });
        }
      }
    }
  }

  return { debate, sources, isFallback: false, fallbackMessage: null };
}

/**
 * Generate a debate using standard Gemini (no search grounding) — Tier 2.
 */
async function generateStandard(topic: string, originalError?: string): Promise<GeminiDebateResult> {
  const ai = getClient();
  console.log(`[Gemini] Tier 2: Standard synthesis for "${topic}"`);

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Synthesize a highly objective, balanced debate on the topic: "${topic}"`,
    config: {
      systemInstruction: DEBATE_SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini standard synthesis.");

  const debate = parseGeminiJSON(text);

  let fallbackMessage: string | null = null;
  if (originalError) {
    if (originalError.includes("429") || originalError.toLowerCase().includes("quota")) {
      fallbackMessage = "Google Search grounding quota temporarily exhausted. Using direct AI synthesis — arguments are still high-quality but not web-verified.";
    } else {
      fallbackMessage = `Web search grounding unavailable. Using direct AI synthesis for this debate.`;
    }
  }

  return {
    debate,
    sources: [
      { title: "Google Scholar", url: "https://scholar.google.com" },
      { title: "Wikipedia", url: "https://www.wikipedia.org" },
    ],
    isFallback: !!fallbackMessage,
    fallbackMessage,
  };
}

/**
 * Safely extract hostname from a URL string.
 */
function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Check if Gemini API key is configured.
 */
export function isApiKeyConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * Main entry point: generate a debate with tiered fallback.
 * Tier 1: Grounded (Google Search) → Tier 2: Standard → throws (caller handles Tier 3)
 */
export async function generateDebate(topic: string, useGrounding: boolean): Promise<GeminiDebateResult> {
  if (!useGrounding) {
    return generateStandard(topic);
  }

  try {
    return await generateGrounded(topic);
  } catch (err: any) {
    const errorMsg = err.message || String(err);
    console.error(`[Gemini] Tier 1 failed: ${errorMsg}. Falling back to Tier 2.`);

    try {
      return await generateStandard(topic, errorMsg);
    } catch (err2: any) {
      console.error(`[Gemini] Tier 2 also failed: ${err2.message || err2}`);
      throw err2; // Caller will handle Tier 3 (local fallback)
    }
  }
}
