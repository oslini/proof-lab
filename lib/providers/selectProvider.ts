import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import type { Provider } from "@/types";

export function selectProvider(
  provider: Provider,
  model: string,
  apiKey: string,
): LanguageModel {
  if (provider === "anthropic") {
    const anthropic = createAnthropic({ apiKey });
    return anthropic(model);
  }
  const openai = createOpenAI({ apiKey });
  return openai(model);
}
