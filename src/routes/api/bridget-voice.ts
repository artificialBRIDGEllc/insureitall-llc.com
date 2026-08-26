import { createFileRoute } from "@tanstack/react-router";
import { ELEVENLABS_AGENT_ID } from "@/lib/elevenlabs";

export const Route = createFileRoute("/api/bridget-voice")({
  server: {
    handlers: {
      GET: async () => {
        const key = process.env.ELEVENLABS_API_KEY?.trim();
        const agentId =
          process.env.ELEVENLABS_AGENT_ID?.trim() ||
          process.env.VITE_ELEVENLABS_AGENT_ID?.trim() ||
          ELEVENLABS_AGENT_ID;

        if (!key) {
          return Response.json({
            ok: true,
            mode: "public",
            agentId,
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
              hint:
                res.status === 401
                  ? "API key rejected. Check ELEVENLABS_API_KEY on Vercel."
                  : res.status === 404
                    ? "Agent id not found. Check ELEVENLABS_AGENT_ID."
                    : "ElevenLabs refused the signed URL. Allow this host in the agent’s allowed origins, and if auth is on, keep the API key on the server.",
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
          signedUrl: data.signed_url,
        });
      },
    },
  },
});
