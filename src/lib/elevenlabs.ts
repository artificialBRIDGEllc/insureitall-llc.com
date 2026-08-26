/** Public agent id. Safe in the client. API key never belongs here. */
const fromVite =
  typeof import.meta !== "undefined"
    ? String(
        (import.meta as ImportMeta & { env?: Record<string, string> }).env
          ?.VITE_ELEVENLABS_AGENT_ID ?? "",
      ).trim()
    : "";
const fromNode =
  typeof process !== "undefined"
    ? String(process.env.ELEVENLABS_AGENT_ID ?? process.env.VITE_ELEVENLABS_AGENT_ID ?? "").trim()
    : "";

export const ELEVENLABS_AGENT_ID =
  fromVite || fromNode || "agent_0501m0dpjakhe87b3tfptxgnwmjy";

export const ELEVENLABS_WIDGET_SRC =
  "https://unpkg.com/@elevenlabs/convai-widget-embed";
