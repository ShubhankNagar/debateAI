/**
 * Debate generation and retrieval routes.
 */
import { Router, Request, Response } from "express";
import { debateRateLimit, readRateLimit } from "../middleware/rateLimit";
import { validateDebateTopic } from "../middleware/validation";
import { generateDebate, isApiKeyConfigured } from "../services/gemini.service";
import { generateFallbackDebate } from "../services/fallback.service";
import { debateCache } from "../services/cache.service";

const router = Router();

// POST /api/generate-debate
router.post("/generate-debate", debateRateLimit, validateDebateTopic, async (req: Request, res: Response) => {
  const { topic, groundingEnabled } = req.body;
  const useGrounding = groundingEnabled !== false;

  // If no API key, serve fallback immediately
  if (!isApiKeyConfigured()) {
    console.warn("[Debate] No API key — serving fallback.");
    const debate = generateFallbackDebate(topic);
    const id = debateCache.set(topic, debate, [], true, "API key not configured. Showing preview content.");

    return res.json({
      success: true,
      id,
      debate,
      sources: [],
      isFallback: true,
      fallbackMessage: "API key not configured. Showing high-quality preview content.",
    });
  }

  // Check cache first (only for grounded mode to avoid stale direct results)
  const cached = debateCache.getByTopic(topic);
  if (cached && !cached.isFallback) {
    console.log(`[Debate] Cache hit for "${topic}" → ${cached.id}`);
    return res.json({
      success: true,
      id: cached.id,
      debate: cached.debate,
      sources: cached.sources,
      isFallback: cached.isFallback,
      fallbackMessage: cached.fallbackMessage,
      fromCache: true,
    });
  }

  try {
    const result = await generateDebate(topic, useGrounding);
    const id = debateCache.set(topic, result.debate, result.sources, result.isFallback, result.fallbackMessage);

    return res.json({
      success: true,
      id,
      debate: result.debate,
      sources: result.sources,
      isFallback: result.isFallback,
      fallbackMessage: result.fallbackMessage,
    });
  } catch (err: any) {
    console.error(`[Debate] All tiers failed for "${topic}": ${err.message}`);

    // Tier 3: Local fallback
    const debate = generateFallbackDebate(topic);
    const id = debateCache.set(topic, debate, [], true, "All AI services temporarily unavailable. Showing offline debate.");

    return res.json({
      success: true,
      id,
      debate,
      sources: [],
      isFallback: true,
      fallbackMessage: "AI services temporarily unavailable. Showing high-quality offline debate analysis.",
    });
  }
});

// GET /api/debate/:id — retrieve a cached debate by its share ID
router.get("/debate/:id", readRateLimit, (req: Request, res: Response) => {
  const { id } = req.params;
  const cached = debateCache.getById(id);

  if (!cached) {
    return res.status(404).json({
      success: false,
      error: "Debate not found or has expired. Generate a new one!",
    });
  }

  return res.json({
    success: true,
    id: cached.id,
    debate: cached.debate,
    sources: cached.sources,
    isFallback: cached.isFallback,
    fallbackMessage: cached.fallbackMessage,
  });
});

export default router;
