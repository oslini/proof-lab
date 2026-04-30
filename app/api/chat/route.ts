import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { z } from "zod";
import { selectProvider } from "@/lib/providers/selectProvider";
import { buildSystemPrompt } from "@/lib/prompts/tutorSystemPrompt";

const BodySchema = z.object({
  messages: z.array(z.any()),
  provider: z.enum(["anthropic", "openai"]),
  model: z.string().min(1),
  apiKey: z.string().min(1),
  mode: z.enum(["show-your-work", "free"]),
  probe: z.boolean().optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = BodySchema.parse(await req.json());
  } catch (err) {
    return new Response(
      `Invalid request: ${err instanceof Error ? err.message : "unknown"}`,
      { status: 400 },
    );
  }

  const { messages, provider, model, apiKey, mode, probe } = parsed;
  const sdkModel = selectProvider(provider, model, apiKey);
  const system = probe
    ? "Reply with the single word OK."
    : buildSystemPrompt(mode);

  const modelMessages = await convertToModelMessages(messages as UIMessage[]);
  const result = streamText({
    model: sdkModel,
    system,
    messages: modelMessages,
    maxOutputTokens: probe ? 8 : 2048,
  });

  return result.toUIMessageStreamResponse();
}
