/**
 * Preset/trending topics data and routes.
 */
import { Router } from "express";
import { readRateLimit } from "../middleware/rateLimit";

const router = Router();

export interface PresetTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: string;
}

const PRESET_TOPICS: PresetTopic[] = [
  {
    id: "ai-art",
    title: "AI Image Generators vs. Professional Artists",
    category: "Technology & Ethics",
    description: "Are generative models a tool for democratization or systematic intellectual property theft?",
    difficulty: "In-Depth",
  },
  {
    id: "remote-work",
    title: "Remote Work vs. Return-to-Office Mandates",
    category: "Society & Workplace",
    description: "Do office collaboration benefits outweigh the personal flexibility, productivity, and green aspects of WFH?",
    difficulty: "Practical",
  },
  {
    id: "nuclear-energy",
    title: "Nuclear Energy as a Primary Weapon Against Climate Change",
    category: "Environment & Science",
    description: "Is nuclear power essential for zero-carbon grids, or are safety risks and waste toxic showstoppers?",
    difficulty: "Scientific",
  },
  {
    id: "universal-basic-income",
    title: "Universal Basic Income (UBI) Implementation",
    category: "Economics",
    description: "Would a monthly cash payment eradicate poverty or fuel inflation and disincentivize labor?",
    difficulty: "Theoretical",
  },
  {
    id: "social-media-minors",
    title: "Should Social Media Ban Users Under 16?",
    category: "Society & Technology",
    description: "Does protecting minors justify restricting their digital access, or does it infringe on rights and push kids to unregulated spaces?",
    difficulty: "Practical",
  },
  {
    id: "space-colonization",
    title: "Colonizing Mars vs. Fixing Earth First",
    category: "Science & Philosophy",
    description: "Should humanity invest trillions in becoming multiplanetary, or redirect resources to solve problems on Earth?",
    difficulty: "Philosophical",
  },
];

// GET /api/preset-topics
router.get("/preset-topics", readRateLimit, (_req, res) => {
  res.json({ topics: PRESET_TOPICS });
});

export default router;
