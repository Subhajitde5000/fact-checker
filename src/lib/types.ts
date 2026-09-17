export type Verdict = "true" | "false" | "misleading" | "unverified";

export interface SourceRef {
  title: string;
  url: string;
  domain: string;
}

export interface Claim {
  id: string;
  text: string;
  verdict: Verdict;
  confidence: number; // 0-100
  explanation: string;
  sources: SourceRef[];
}

export interface AnalysisResult {
  videoId: string;
  originalUrl: string;
  checkedAt: string; // ISO timestamp
  title: string;
  channel: string;
  category: string;
  transcriptSnippet: string;
  overallVerdict: Verdict;
  overallConfidence: number;
  summary: string;
  claims: Claim[];
}
