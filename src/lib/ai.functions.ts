import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

const Fact = z.object({
  name: z.string(),
  type: z.string(),
  version: z.string(),
  rippleScore: z.number(),
  degree: z.number(),
  betweenness: z.number(),
  reach: z.number(),
  directDependents: z.array(z.string()),
  downstreamCount: z.number(),
  affectedApps: z.array(z.string()),
  maxDepth: z.number(),
  lastPublished: z.string().nullable(),
});

const Input = z.object({
  sourceLabel: z.string(),
  totalPackages: z.number(),
  applications: z.array(z.string()),
  edges: z.number(),
  criticalCount: z.number(),
  top: z.array(Fact).max(8),
});

export type AnalysisInput = z.infer<typeof Input>;

export interface AnalysisResult {
  ok: boolean;
  summary: string;
  narratives: { name: string; text: string }[];
  priorities: string[];
  error?: string;
}

function parseSections(raw: string): Omit<AnalysisResult, "ok"> {
  const summaryMatch = /##\s*SUMMARY\s*([\s\S]*?)(?=##\s|$)/i.exec(raw);
  const narrativeMatch = /##\s*NARRATIVES\s*([\s\S]*?)(?=##\s|$)/i.exec(raw);
  const prioritiesMatch = /##\s*PRIORITIES\s*([\s\S]*?)(?=##\s|$)/i.exec(raw);

  const narratives: { name: string; text: string }[] = [];
  const narrativeBody = narrativeMatch?.[1]?.trim() ?? "";
  for (const block of narrativeBody.split(/\n(?=###\s)/)) {
    const m = /###\s*(.+)\n([\s\S]*)/.exec(block.trim());
    if (m?.[1] && m[2]) narratives.push({ name: m[1].trim(), text: m[2].trim() });
  }

  const priorities = (prioritiesMatch?.[1] ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);

  return {
    summary: summaryMatch?.[1]?.trim() ?? raw.trim(),
    narratives,
    priorities,
  };
}

/** Generate the Explain-page analysis with a real model, from live graph metrics. */
export const generateAnalysis = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return {
        ok: false,
        summary: "",
        narratives: [],
        priorities: [],
        error: "AI is not configured for this project.",
      };
    }

    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });

    const facts = JSON.stringify(data, null, 2);

    try {
      const result = streamText({
        model: lovable.responses("openai/gpt-6-astra"),
        system:
          "You are a senior software supply chain security analyst. You are given computed graph metrics for a real dependency ecosystem. Write precise, evidence-based analysis that cites the numbers you were given. Never invent CVEs, dates or packages that are not in the data. Be concrete and readable for an incident responder.",
        prompt: `Analyse this dependency ecosystem and reply in EXACTLY this format, with no preamble:

## SUMMARY
<4-5 sentences: size of the ecosystem, where the concentration risk sits, what a single compromise of the top chokepoint would cost, and the overall posture.>

## NARRATIVES
### <package name>
<one paragraph explaining WHY this package is a chokepoint, citing its Ripple Score, centrality, dependents and application reach.>
(repeat for the top 3 packages)

## PRIORITIES
- <5 prioritised, specific mitigation actions naming real packages from the data>

DATA:
${facts}`,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });

      const text = await result.text;
      if (!text.trim()) {
        return {
          ok: false,
          summary: "",
          narratives: [],
          priorities: [],
          error: "The model returned an empty analysis. Try again.",
        };
      }
      return { ok: true, ...parseSections(text) };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The analysis service is unavailable.";
      console.error("generateAnalysis failed", error);
      return {
        ok: false,
        summary: "",
        narratives: [],
        priorities: [],
        error: message,
      };
    }
  });
