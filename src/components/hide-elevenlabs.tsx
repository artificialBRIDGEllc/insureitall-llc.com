import { useEffect } from "react";

const SELECTOR = [
  "elevenlabs-convai",
  "[class*='el-convai']",
  "[id*='elevenlabs']",
  "iframe[src*='elevenlabs']",
  "iframe[src*='convai']",
  "script[src*='convai-widget']",
].join(",");

function strip() {
  document.querySelectorAll(SELECTOR).forEach((node) => node.remove());
}

/** Keeps the vendor bubble off the page. Voice, if used later, goes through BRIDGEt chrome. */
export function HideElevenLabs() {
  useEffect(() => {
    strip();
    const mo = new MutationObserver(strip);
    mo.observe(document.documentElement, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  return null;
}
