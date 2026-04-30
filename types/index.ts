export type Provider = "anthropic" | "openai";

export type Mode = "show-your-work" | "free";

export type HintLevel = 1 | 2 | 3;

export interface Settings {
  provider: Provider;
  apiKey: string;
  model: string;
  mode: Mode;
  showSymbolKeyboard: boolean;
}

export interface StoredMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  createdAt: number;
}

export interface Session {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  mode: Mode;
  messages: StoredMessage[];
}

export const DEFAULT_MODELS: Record<Provider, string> = {
  anthropic: "claude-sonnet-4-6",
  openai: "gpt-4o",
};

export const MODEL_CHOICES: Record<Provider, string[]> = {
  anthropic: ["claude-sonnet-4-6", "claude-opus-4-7", "claude-haiku-4-5-20251001"],
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4.1"],
};

export const DEFAULT_SETTINGS: Settings = {
  provider: "anthropic",
  apiKey: "",
  model: DEFAULT_MODELS.anthropic,
  mode: "show-your-work",
  showSymbolKeyboard: true,
};
