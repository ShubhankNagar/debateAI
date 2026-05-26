/**
 * In-memory LRU cache for generated debates.
 * Each debate gets a unique short ID for shareable URLs.
 * TTL: 24 hours. Max entries: 500.
 */
import { randomBytes } from "crypto";

interface CachedDebate {
  id: string;
  topic: string;
  debate: any;
  sources: Array<{ title: string; url: string }>;
  isFallback: boolean;
  fallbackMessage?: string | null;
  createdAt: number;
}

const MAX_CACHE_SIZE = 500;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class DebateCache {
  private cache: Map<string, CachedDebate> = new Map();
  private topicIndex: Map<string, string> = new Map(); // normalized topic -> debate ID

  private normalizeKey(topic: string): string {
    return topic.trim().toLowerCase().replace(/\s+/g, " ");
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [id, entry] of this.cache) {
      if (now - entry.createdAt > CACHE_TTL_MS) {
        this.cache.delete(id);
        // Clean topic index
        for (const [topic, cachedId] of this.topicIndex) {
          if (cachedId === id) {
            this.topicIndex.delete(topic);
          }
        }
      }
    }
  }

  private evictOldest(): void {
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        const entry = this.cache.get(oldestKey);
        this.cache.delete(oldestKey);
        if (entry) {
          const normKey = this.normalizeKey(entry.topic);
          if (this.topicIndex.get(normKey) === oldestKey) {
            this.topicIndex.delete(normKey);
          }
        }
      }
    }
  }

  /**
   * Store a debate and return its unique short ID.
   */
  set(
    topic: string,
    debate: any,
    sources: Array<{ title: string; url: string }>,
    isFallback: boolean,
    fallbackMessage?: string | null
  ): string {
    this.evictExpired();
    this.evictOldest();

    const id = randomBytes(5).toString("hex");
    const entry: CachedDebate = {
      id,
      topic,
      debate,
      sources,
      isFallback,
      fallbackMessage,
      createdAt: Date.now(),
    };

    this.cache.set(id, entry);
    this.topicIndex.set(this.normalizeKey(topic), id);

    return id;
  }

  /**
   * Get a debate by its unique short ID.
   */
  getById(id: string): CachedDebate | null {
    const entry = this.cache.get(id);
    if (!entry) return null;
    if (Date.now() - entry.createdAt > CACHE_TTL_MS) {
      this.cache.delete(id);
      return null;
    }
    return entry;
  }

  /**
   * Check if a topic has already been generated (returns cached debate ID or null).
   */
  getByTopic(topic: string): CachedDebate | null {
    const normKey = this.normalizeKey(topic);
    const id = this.topicIndex.get(normKey);
    if (!id) return null;
    return this.getById(id);
  }

  get size(): number {
    return this.cache.size;
  }
}

export const debateCache = new DebateCache();
