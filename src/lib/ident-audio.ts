import { IDENT_AUDIO_SRC } from "@/lib/ident";

const GAIN = 0.70;

let ctx: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let loading: Promise<void> | null = null;
let html: HTMLAudioElement | null = null;
let source: AudioBufferSourceNode | null = null;
let playing = false;

function reducedAudio() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  } catch {
    /* ignore */
  }
  return false;
}

function audioContext() {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  return ctx;
}

function htmlNode() {
  if (typeof window === "undefined") return null;
  if (!html) {
    html = new Audio(IDENT_AUDIO_SRC);
    html.preload = "auto";
    html.volume = GAIN;
    html.addEventListener("ended", () => {
      playing = false;
    });
  }
  return html;
}

export function preloadIdentAudio() {
  htmlNode();
  if (loading) return loading;
  loading = (async () => {
    try {
      const res = await fetch(IDENT_AUDIO_SRC, { cache: "force-cache" });
      const data = await res.arrayBuffer();
      const ac = audioContext();
      if (!ac) return;
      buffer = await ac.decodeAudioData(data.slice(0));
    } catch {
      /* HTMLAudio fallback still works */
    }
  })();
  return loading;
}

export function unlockIdentAudio() {
  const ac = audioContext();
  if (ac && ac.state === "suspended") void ac.resume();
}

function startBuffer(): boolean {
  const ac = audioContext();
  if (!ac || !buffer || ac.state !== "running") return false;
  stopIdentAudio();
  const gain = ac.createGain();
  gain.gain.value = GAIN;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  src.connect(gain);
  gain.connect(ac.destination);
  src.onended = () => {
    playing = false;
    if (source === src) source = null;
  };
  src.start(0);
  source = src;
  playing = true;
  return true;
}

export async function playIdentAudio(): Promise<boolean> {
  if (reducedAudio()) return false;
  unlockIdentAudio();
  await loading?.catch(() => undefined);
  if (playing) return true;
  if (startBuffer()) return true;
  const audio = htmlNode();
  if (!audio) return false;
  try {
    audio.currentTime = 0;
    audio.volume = GAIN;
    await audio.play();
    playing = true;
    return true;
  } catch {
    playing = false;
    return false;
  }
}

export function stopIdentAudio() {
  playing = false;
  if (source) {
    try {
      source.stop();
    } catch {
      /* already stopped */
    }
    source = null;
  }
  if (html) {
    html.pause();
    html.currentTime = 0;
  }
}
