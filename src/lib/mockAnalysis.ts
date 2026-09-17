import type { AnalysisResult, Claim, Verdict } from "./types";

/**
 * ---------------------------------------------------------------------------
 * DEMO / MOCK ENGINE
 * ---------------------------------------------------------------------------
 * This project is currently a FRONTEND-ONLY prototype. There is no server
 * that downloads the Short, transcribes the audio, or searches the web yet.
 *
 * Everything below deterministically fabricates a plausible-looking result
 * from the video id alone, purely so the UI/UX of the product can be built
 * and demoed end-to-end.
 *
 * When the real backend is built (this is meant to be an open-source
 * project), replace `runAnalysis()` with something like:
 *
 *   1. POST the url to `/api/analyze`
 *   2. Server downloads/transcribes the short (e.g. yt-dlp + Whisper, or the
 *      YouTube captions endpoint)
 *   3. Server extracts factual claims from the transcript (LLM)
 *   4. Server searches the web for each claim (Bing/Google/Serper/Tavily API)
 *   5. Server asks an LLM to weigh the evidence and return a verdict + cited
 *      sources
 *   6. Return JSON shaped like `AnalysisResult` (see src/lib/types.ts) so the
 *      UI here doesn't need to change at all.
 * ---------------------------------------------------------------------------
 */

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface Scenario {
  title: string;
  channel: string;
  category: string;
  transcriptSnippet: string;
  summary: string;
  claims: Omit<Claim, "id">[];
}

const SCENARIOS: Scenario[] = [
  {
    title: "\"NASA confirms the Earth will go dark for 6 days\"",
    channel: "@cosmic.facts.daily",
    category: "Science",
    transcriptSnippet:
      "\"...NASA just confirmed that a rare planetary alignment will block sunlight completely, plunging Earth into total darkness for six days straight starting next month...\"",
    summary:
      "This is a long-running hoax that resurfaces every few years. NASA has never issued such a statement, and no planetary alignment can block sunlight from reaching Earth.",
    claims: [
      {
        text: "NASA confirmed Earth will experience total darkness for 6 days.",
        verdict: "false",
        confidence: 97,
        explanation:
          "No such announcement exists on NASA's newsroom, social channels, or press releases. NASA has publicly debunked this exact claim multiple times since 2015.",
        sources: [
          { title: "NASA — Hoax debunk statement", url: "https://www.nasa.gov/", domain: "nasa.gov" },
          { title: "Snopes: 'Six Days of Darkness'", url: "https://www.snopes.com/", domain: "snopes.com" },
          { title: "Reuters Fact Check", url: "https://www.reuters.com/fact-check/", domain: "reuters.com" },
        ],
      },
      {
        text: "A planetary alignment can block sunlight from reaching Earth.",
        verdict: "false",
        confidence: 95,
        explanation:
          "Even a full alignment of all planets would not obstruct sunlight to Earth — the planets are far too small and distant relative to the Sun's size to cause any noticeable dimming.",
        sources: [
          { title: "EarthSky — Planetary alignments explained", url: "https://earthsky.org/", domain: "earthsky.org" },
        ],
      },
    ],
  },
  {
    title: "\"Drinking lemon water every morning burns fat instantly\"",
    channel: "@wellness.hacks",
    category: "Health",
    transcriptSnippet:
      "\"...doctors don't want you to know this, but lemon water first thing in the morning melts fat cells almost instantly and detoxes your whole liver...\"",
    summary:
      "Lemon water can be a healthy habit (hydration, vitamin C) but there is no clinical evidence it 'melts fat' or provides a special detox effect beyond normal liver/kidney function.",
    claims: [
      {
        text: "Lemon water burns fat 'instantly'.",
        verdict: "false",
        confidence: 92,
        explanation:
          "No peer-reviewed study supports rapid or 'instant' fat loss from lemon water. Fat loss requires a sustained calorie deficit; lemon water has negligible caloric or metabolic impact.",
        sources: [
          { title: "Harvard Health — Detox diets fact vs fiction", url: "https://www.health.harvard.edu/", domain: "health.harvard.edu" },
          { title: "Mayo Clinic — Weight loss myths", url: "https://www.mayoclinic.org/", domain: "mayoclinic.org" },
        ],
      },
      {
        text: "The liver needs external 'detox' help from foods like lemon.",
        verdict: "misleading",
        confidence: 88,
        explanation:
          "The liver and kidneys already detoxify the body continuously. There's no evidence any food 'boosts' this process meaningfully in healthy individuals.",
        sources: [
          { title: "NHS — Detox diets", url: "https://www.nhs.uk/", domain: "nhs.uk" },
        ],
      },
    ],
  },
  {
    title: "\"This new law bans cash payments nationwide starting next week\"",
    channel: "@breaking.now247",
    category: "News",
    transcriptSnippet:
      "\"...starting next week, a new law makes it illegal to pay with cash anywhere in the country, forcing everyone onto digital payments only...\"",
    summary:
      "No such nationwide law exists or is scheduled to take effect. This mirrors a pattern of recurring misinformation about 'cashless mandates' with no legislative source cited.",
    claims: [
      {
        text: "A nationwide law bans all cash payments starting next week.",
        verdict: "false",
        confidence: 94,
        explanation:
          "No government or legislative record of this law could be found. Official government portals list no cash-ban legislation with this effective date.",
        sources: [
          { title: "Reuters Fact Check", url: "https://www.reuters.com/fact-check/", domain: "reuters.com" },
          { title: "AP Fact Check", url: "https://apnews.com/hub/ap-fact-check", domain: "apnews.com" },
        ],
      },
      {
        text: "Digital payments would become the only legal payment method.",
        verdict: "unverified",
        confidence: 55,
        explanation:
          "While some countries are exploring reduced cash usage, no jurisdiction currently mandates digital-only payments outright. Claims like this need a specific country/region to verify further.",
        sources: [
          { title: "World Bank — Cash & digital payments trends", url: "https://www.worldbank.org/", domain: "worldbank.org" },
        ],
      },
    ],
  },
  {
    title: "\"Octopuses have three hearts and blue blood\"",
    channel: "@wild.animal.facts",
    category: "Science",
    transcriptSnippet:
      "\"...did you know octopuses have three hearts and their blood is actually blue because of copper instead of iron?...\"",
    summary:
      "This is a well-documented, accurate biological fact confirmed by marine biology research and major science institutions.",
    claims: [
      {
        text: "Octopuses have three hearts.",
        verdict: "true",
        confidence: 98,
        explanation:
          "Two hearts pump blood to the gills, and one pumps it to the rest of the body. This is well-established cephalopod anatomy.",
        sources: [
          { title: "National Geographic — Octopus anatomy", url: "https://www.nationalgeographic.com/", domain: "nationalgeographic.com" },
          { title: "Smithsonian Ocean", url: "https://ocean.si.edu/", domain: "ocean.si.edu" },
        ],
      },
      {
        text: "Octopus blood is blue due to copper-based hemocyanin.",
        verdict: "true",
        confidence: 97,
        explanation:
          "Octopuses use hemocyanin (copper-based) instead of hemoglobin (iron-based) to transport oxygen, which gives their blood a blue color.",
        sources: [
          { title: "Britannica — Hemocyanin", url: "https://www.britannica.com/", domain: "britannica.com" },
        ],
      },
    ],
  },
  {
    title: "\"You only use 10% of your brain\"",
    channel: "@mindblown.shorts",
    category: "Science",
    transcriptSnippet:
      "\"...scientists say the average person only uses about 10% of their brain, imagine what you could do if you unlocked the rest...\"",
    summary:
      "This is a widely debunked neuroscience myth. Brain imaging shows virtually all regions of the brain have identifiable functions and are active over a given day.",
    claims: [
      {
        text: "Humans only use 10% of their brain.",
        verdict: "false",
        confidence: 96,
        explanation:
          "fMRI and PET scans show activity throughout the entire brain, even during sleep. Damage to almost any brain area produces noticeable effects, contradicting the idea that 90% is unused.",
        sources: [
          { title: "Scientific American — The 10% myth", url: "https://www.scientificamerican.com/", domain: "scientificamerican.com" },
          { title: "BBC Science Focus", url: "https://www.sciencefocus.com/", domain: "sciencefocus.com" },
        ],
      },
    ],
  },
  {
    title: "\"This stock will 100x in a month, insiders are buying\"",
    channel: "@crypto.money.tips",
    category: "Finance",
    transcriptSnippet:
      "\"...insiders are quietly loading up on this stock before it 100x's next month, get in now before it's too late...\"",
    summary:
      "This follows a classic 'pump and hype' pattern common in low-quality finance content. No verifiable filings or credible reporting support the claim.",
    claims: [
      {
        text: "Company insiders are 'quietly' buying large amounts of the stock.",
        verdict: "unverified",
        confidence: 40,
        explanation:
          "No matching insider-trading disclosure (e.g. SEC Form 4 filings) could be found to support this claim. Insider trades are public record in most regulated markets, so a legitimate claim would cite a filing.",
        sources: [
          { title: "SEC EDGAR — Insider filings search", url: "https://www.sec.gov/cgi-bin/browse-edgar", domain: "sec.gov" },
        ],
      },
      {
        text: "The stock is guaranteed to increase 100x within a month.",
        verdict: "false",
        confidence: 90,
        explanation:
          "No legitimate financial analysis can guarantee a 100x return in a month. This is a common hallmark of pump-and-dump schemes and violates basic principles of market risk.",
        sources: [
          { title: "SEC — Pump-and-dump schemes", url: "https://www.investor.gov/", domain: "investor.gov" },
        ],
      },
    ],
  },
];

function verdictFromClaims(claims: Claim[]): { verdict: Verdict; confidence: number } {
  const weights: Record<Verdict, number> = { true: 0, false: 0, misleading: 0, unverified: 0 };
  for (const c of claims) weights[c.verdict] += c.confidence;

  let best: Verdict = "unverified";
  let bestScore = -1;
  (Object.keys(weights) as Verdict[]).forEach((v) => {
    if (weights[v] > bestScore) {
      bestScore = weights[v];
      best = v;
    }
  });

  const avgConfidence = Math.round(
    claims.reduce((sum, c) => sum + c.confidence, 0) / Math.max(claims.length, 1)
  );

  return { verdict: best, confidence: avgConfidence };
}

export async function runMockAnalysis(videoId: string, originalUrl: string): Promise<AnalysisResult> {
  const scenario = SCENARIOS[hashString(videoId) % SCENARIOS.length];
  const claims: Claim[] = scenario.claims.map((c, idx) => ({ ...c, id: `${videoId}-claim-${idx}` }));
  const { verdict, confidence } = verdictFromClaims(claims);

  return {
    videoId,
    originalUrl,
    checkedAt: new Date().toISOString(),
    title: scenario.title,
    channel: scenario.channel,
    category: scenario.category,
    transcriptSnippet: scenario.transcriptSnippet,
    overallVerdict: verdict,
    overallConfidence: confidence,
    summary: scenario.summary,
    claims,
  };
}
