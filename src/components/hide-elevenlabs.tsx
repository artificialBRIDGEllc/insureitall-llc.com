import { useEffect } from "react";

const SELECTOR = [
  "elevenlabs-convai",
  "script[src*='convai-widget']",
  "script[data-iia-convai]",
].join(",");

function strip() {
  document.querySelectorAll(SELECTOR).forEach((node) => node.remove());
}

/** Vendor bubble only. Do not strip WebRTC audio used by Talk with me. */
export function HideElevenLabs() {
  useEffect(() => {
    strip();
    const mo = new MutationObserver(strip);
    mo.observe(document.documentElement, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  return null;
}
