import { createFileRoute } from "@tanstack/react-router";
import { ELEVENLABS_AGENT_ID } from "@/lib/elevenlabs";

/** Dynamic lookup so Vite cannot inline `undefined` at build time. */
function readEnv(...names: string[]) {
  const env =
    typeof process !== "undefined" && process.env
      ? (process.env as Record<string, string | undefined>)
      : {};
  for (const name of names) {
    const value = String(env[name] ?? "").trim();
    if (value) return value;
  }
  return "";
}

export const Route = createFileRoute("/api/bridget-voice")({
  server: {
    handlers: {
      GET: async () => {
        const key = readEnv("ELEVENLABS_API_KEY", "XI_API_KEY", "ELEVEN_LABS_API_KEY");
        const agentId =
          readEnv("ELEVENLABS_AGENT_ID", "VITE_ELEVENLABS_AGENT_ID") || ELEVENLABS_AGENT_ID;

        if (!key) {
          return Response.json({
            ok: true,
            mode: "public",
            agentId,
            hasKey: false,
            hint: "Set ELEVENLABS_API_KEY on this Vercel project (Production), then Redeploy. Env vars do not attach to the running deployment.",
          });
        }

        const url = new URL(
          "https://api.elevenlabs.io/v1/convai/conversation/get_signed_url",
        );
        url.searchParams.set("agent_id", agentId);

        const res = await fetch(url, {
          headers: { "xi-api-key": key },
        });
        if (!res.ok) {
          const detail = await res.text();
          return Response.json(
            {
              ok: false,
              error: "elevenlabs_signed_url_failed",
              status: res.status,
              hasKey: true,
              hint:
                res.status === 401
                  ? "API key rejected. Check ELEVENLABS_API_KEY on Vercel."
                  : res.status === 404
                    ? "Agent id not found. Check ELEVENLABS_AGENT_ID."
                    : "ElevenLabs refused the signed URL. Allow this host in the agent’s allowed origins.",
              detail: detail.slice(0, 240),
            },
            { status: 502 },
          );
        }
        const data = (await res.json()) as { signed_url?: string };
        return Response.json({
          ok: true,
          mode: "signed",
          agentId,
          hasKey: true,
          signedUrl: data.signed_url,
        });
      },
    },
  },
});
