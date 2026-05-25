export interface DebatePoint {
  title: string;
  quickTakeaway: string;
  description: string;
  evidenceStrength: "high" | "medium" | "low";
  evidence: string;
}

export interface DebateRound {
  roundNumber: number;
  roundName: string;
  proSpeech: string;
  conSpeech: string;
}

export interface DebateResult {
  topic: string;
  summary: string;
  realWorldStatus: string;
  proSideName: string;
  conSideName: string;
  proPoints: DebatePoint[];
  conPoints: DebatePoint[];
  timelineRounds: DebateRound[];
  commonGround: string;
  synthesis: string;
  suggestedFurtherQuestions: string[];
}

export interface PresetTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: string;
}

export interface Source {
  title: string;
  url: string;
}
