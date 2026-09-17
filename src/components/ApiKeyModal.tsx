"use client";

import { useState } from "react";

export type ApiProvider = "openai" | "claude" | "openrouter" | "groq";

export interface ApiConfig {
  provider: ApiProvider;
  apiKey: string;
}

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiConfig: ApiConfig | null;
  onSave: (config: ApiConfig | null) => void;
}

const PROVIDERS: { id: ApiProvider; name: string; badge: string; prefix: string; description: string }[] = [
  {
    id: "openai",
    name: "OpenAI (GPT)",
    badge: "GPT-4o / GPT-3.5",
    prefix: "sk-...",
    description: "Industry standard models with accurate analysis.",
  },
  {
    id: "claude",
    name: "Anthropic (Claude)",
    badge: "Claude 3.5 Sonnet",
    prefix: "sk-ant-...",
    description: "Exceptional reasoning and detailed claim breakdown.",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    badge: "Multi-Model Gateway",
    prefix: "sk-or-...",
    description: "Access 100+ AI models including open-source options.",
  },
  {
    id: "groq",
    name: "Groq API",
    badge: "Ultra-Fast Llama 3",
    prefix: "gsk_...",
    description: "Lightning-fast inference speed for immediate results.",
  },
];

const TUTORIALS: Record<
  ApiProvider,
  { title: string; steps: { number: number; text: string; link?: { label: string; url: string } }[] }
> = {
  openai: {
    title: "How to get an OpenAI (GPT) API Key",
    steps: [
      {
        number: 1,
        text: "Visit the OpenAI Platform website and sign up or log in.",
        link: { label: "Go to platform.openai.com", url: "https://platform.openai.com/signup" },
      },
      {
        number: 2,
        text: "Click on 'API Keys' in the left sidebar menu (or click your profile icon at top right and select 'View API keys').",
        link: { label: "Open API Keys Page", url: "https://platform.openai.com/api-keys" },
      },
      {
        number: 3,
        text: "Click the '+ Create new secret key' button.",
      },
      {
        number: 4,
        text: "Give your key a name (e.g. 'ShortsCheck') and click 'Create secret key'. Copy the key starting with 'sk-' and paste it here.",
      },
    ],
  },
  claude: {
    title: "How to get an Anthropic (Claude) API Key",
    steps: [
      {
        number: 1,
        text: "Go to the Anthropic Console and create an account or sign in.",
        link: { label: "Go to console.anthropic.com", url: "https://console.anthropic.com/" },
      },
      {
        number: 2,
        text: "Click on 'API Keys' in the dashboard or settings menu.",
        link: { label: "Open Anthropic Keys", url: "https://console.anthropic.com/settings/keys" },
      },
      {
        number: 3,
        text: "Click 'Create Key' and enter a descriptive name like 'ShortsCheck'.",
      },
      {
        number: 4,
        text: "Copy the newly generated key starting with 'sk-ant-' and paste it here.",
      },
    ],
  },
  openrouter: {
    title: "How to get an OpenRouter API Key",
    steps: [
      {
        number: 1,
        text: "Visit OpenRouter and create an account with email or GitHub/Google.",
        link: { label: "Go to openrouter.ai", url: "https://openrouter.ai/" },
      },
      {
        number: 2,
        text: "Click on your account profile at top right and choose 'Keys'.",
        link: { label: "Open OpenRouter Keys", url: "https://openrouter.ai/keys" },
      },
      {
        number: 3,
        text: "Click 'Create Key', set an optional credit limit if desired, and click 'Create'.",
      },
      {
        number: 4,
        text: "Copy your key starting with 'sk-or-' and paste it here.",
      },
    ],
  },
  groq: {
    title: "How to get a Groq API Key",
    steps: [
      {
        number: 1,
        text: "Go to the GroqConsole portal and sign in or sign up.",
        link: { label: "Go to console.groq.com", url: "https://console.groq.com/" },
      },
      {
        number: 2,
        text: "Select 'API Keys' from the left navigation menu.",
        link: { label: "Open Groq API Keys", url: "https://console.groq.com/keys" },
      },
      {
        number: 3,
        text: "Click 'Create API Key', name it (e.g. 'ShortsCheck'), and click 'Submit'.",
      },
      {
        number: 4,
        text: "Copy the key starting with 'gsk_' and paste it here.",
      },
    ],
  },
};

export function ApiKeyModal({ isOpen, onClose, apiConfig, onSave }: ApiKeyModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<ApiProvider>(
    apiConfig?.provider || "openai"
  );
  const [keyInput, setKeyInput] = useState<string>(apiConfig?.apiKey || "");
  const [activeTab, setActiveTab] = useState<"setup" | "guide">("setup");

  if (!isOpen) return null;

  const currentProviderInfo = PROVIDERS.find((p) => p.id === selectedProvider)!;
  const tutorial = TUTORIALS[selectedProvider];

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!keyInput.trim()) {
      onSave(null);
    } else {
      onSave({
        provider: selectedProvider,
        apiKey: keyInput.trim(),
      });
    }
    onClose();
  }

  function handleClear() {
    setKeyInput("");
    onSave(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#12121e] p-6 shadow-2xl text-slate-100 scrollbar-thin"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300 font-bold text-sm">
                🔑
              </span>
              <h2 id="api-modal-title" className="text-xl font-bold text-white">
                Add Your Custom AI API Key
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              For better fact-checking results & custom provider speeds.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-200 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Temporary memory notice */}
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200/90">
          <span className="text-base shrink-0">🛡️</span>
          <div>
            <strong className="font-semibold text-amber-200">Temporary In-Memory Storage:</strong>
            <p className="mt-0.5 leading-relaxed">
              Your API key is kept <strong>only in memory</strong> for this session. It is never saved to disk, local storage, or transmitted to any third-party storage server.
              <span className="block mt-1 text-amber-300/80 font-medium">
                ⚡ Once you refresh or close this tab, your key will be completely removed.
              </span>
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-5 flex gap-2 border-b border-white/10 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("setup")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === "setup"
                ? "bg-violet-600/30 text-violet-200 border border-violet-500/40"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            ⚙️ Key Setup
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === "guide"
                ? "bg-violet-600/30 text-violet-200 border border-violet-500/40"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            📖 Step-by-Step Guide for Non-Tech Users
          </button>
        </div>

        {activeTab === "setup" ? (
          <form onSubmit={handleSave} className="mt-5 space-y-5">
            {/* Provider selection grid */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                1. Choose AI Provider
              </label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {PROVIDERS.map((prov) => {
                  const isSelected = selectedProvider === prov.id;
                  return (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => {
                        setSelectedProvider(prov.id);
                        if (apiConfig?.provider !== prov.id) {
                          setKeyInput("");
                        } else {
                          setKeyInput(apiConfig.apiKey);
                        }
                      }}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? "border-violet-500 bg-violet-500/15 ring-1 ring-violet-500/50"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-semibold text-sm text-slate-100">{prov.name}</span>
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                          {prov.badge}
                        </span>
                      </div>
                      <span className="mt-1 text-xs text-slate-400 leading-snug">
                        {prov.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* API Key Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="api-key-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  2. Enter Your {currentProviderInfo.name} API Key
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab("guide")}
                  className="text-xs text-violet-300 hover:underline"
                >
                  Need help getting a key?
                </button>
              </div>
              <input
                id="api-key-input"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder={`Paste your key here (e.g. ${currentProviderInfo.prefix})`}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              {apiConfig ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition"
                >
                  Remove Key
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!keyInput.trim()}
                  className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save API Key (Temporary)
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Detailed manual tutorial step-by-step for non-technical users */
          <div className="mt-5 space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Provider Tutorial:
              </label>
              <div className="flex flex-wrap gap-2">
                {PROVIDERS.map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setSelectedProvider(prov.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedProvider === prov.id
                        ? "bg-violet-500 text-white shadow-md"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    }`}
                  >
                    {prov.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-violet-500/20 bg-violet-950/20 p-5 space-y-4">
              <h3 className="text-base font-semibold text-violet-200 flex items-center gap-2">
                <span>📘</span> {tutorial.title}
              </h3>

              <div className="space-y-3.5">
                {tutorial.steps.map((step) => (
                  <div key={step.number} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-500/30">
                      {step.number}
                    </span>
                    <div className="space-y-1">
                      <p className="text-slate-300 leading-relaxed">{step.text}</p>
                      {step.link && (
                        <a
                          href={step.link.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-medium underline underline-offset-2"
                        >
                          {step.link.label} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <p className="text-xs text-slate-400">
                Once you copy your key, switch back to the Key Setup tab to paste it.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("setup")}
                className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition"
              >
                Go to Key Setup →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
