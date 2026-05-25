/**
 * Rate limiting middleware.
 * - Debate generation: 10 req/min per IP
 * - Read endpoints: 60 req/min per IP
 */
import rateLimit from "express-rate-limit";

export const debateRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many debate requests. Please wait a moment before trying again.",
    retryAfter: 60,
  },
});

export const readRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please slow down.",
    retryAfter: 60,
  },
});
