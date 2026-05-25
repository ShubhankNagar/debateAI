/**
 * Input validation middleware for debate generation.
 */
import { Request, Response, NextFunction } from "express";

const MAX_TOPIC_LENGTH = 500;
const MIN_TOPIC_LENGTH = 3;

/**
 * Strip HTML tags and dangerous characters from input.
 */
function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>]/g, "") // Strip remaining angle brackets
    .trim();
}

/**
 * Validate and sanitize the debate topic from request body.
 */
export function validateDebateTopic(req: Request, res: Response, next: NextFunction): void {
  const { topic } = req.body;

  if (!topic || typeof topic !== "string") {
    res.status(400).json({ error: "A valid debate topic is required." });
    return;
  }

  const cleaned = sanitize(topic);

  if (cleaned.length < MIN_TOPIC_LENGTH) {
    res.status(400).json({ error: `Topic must be at least ${MIN_TOPIC_LENGTH} characters.` });
    return;
  }

  if (cleaned.length > MAX_TOPIC_LENGTH) {
    res.status(400).json({ error: `Topic must be under ${MAX_TOPIC_LENGTH} characters.` });
    return;
  }

  // Replace original topic with sanitized version
  req.body.topic = cleaned;
  next();
}
