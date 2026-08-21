let pickup: HTMLAudioElement | null = null;

function loadPickup() {
  if (typeof window === "undefined") return null;
  if (!pickup) {
    pickup = new Audio("/audio/ring-pickup.mp3");
    pickup.preload = "auto";
    pickup.volume = 0.32;
  }
  return pickup;
}

/** Short ring on a user click — never autoplays. */
export function playPickup() {
  const audio = loadPickup();
  if (!audio) return;
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}
