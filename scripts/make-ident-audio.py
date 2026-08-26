#!/usr/bin/env python3
"""INSUREitALL ident bed — calm, in control, authoritative, kind.

One distant, polite ring. No pickup click. A warm low pad blooms underneath
and holds, as if the room was already lit.

Beat map (seconds):
  0.18 ring · 0.70 pad bloom · 6.40 end
No voice.
"""
from __future__ import annotations

import math
import struct
import subprocess
import wave
from pathlib import Path

SR = 44100
DUR = 6.40
N = int(SR * DUR)


def env(t: float, t0: float, t1: float, attack: float, release: float) -> float:
    if t < t0 or t >= t1:
        return 0.0
    local = t - t0
    length = t1 - t0
    if attack and local < attack:
        # sine-ease attack — no stab
        x = local / attack
        return 0.5 - 0.5 * math.cos(math.pi * x)
    if release and local > length - release:
        x = max(0.0, (t1 - t) / release)
        return 0.5 - 0.5 * math.cos(math.pi * x)
    return 1.0


def main() -> None:
    buf = [0.0] * N

    def add(i: int, v: float) -> None:
        if 0 <= i < N:
            buf[i] += v

    # One polite US ring, warmed and distant (not two urgent bursts).
    t0, t1 = 0.18, 0.78
    i0, i1 = int(t0 * SR), int(t1 * SR)
    for i in range(i0, min(i1, N)):
        t = i / SR
        e = env(t, t0, t1, 0.09, 0.16)
        am = 0.92 + 0.08 * math.sin(2 * math.pi * 8 * (t - t0))
        # 440+480 identity, plus a lower octave so it isn't piercing
        s = (
            0.42 * math.sin(2 * math.pi * 220 * t)
            + 0.55 * math.sin(2 * math.pi * 440 * t)
            + 0.38 * math.sin(2 * math.pi * 480 * t)
        )
        buf[i] += 0.105 * e * am * s

    # Quiet room air + kind D-major pad (low register = authority)
    for i in range(N):
        t = i / SR
        air = env(t, 0.55, 5.9, 0.6, 1.4) * 0.008
        nse = ((i * 214013 + 2531011) & 0x7FFFFFFF) / 0x7FFFFFFF * 2 - 1
        buf[i] += air * nse

        pad = env(t, 0.70, 6.35, 1.35, 1.15)
        buf[i] += pad * 0.070 * math.sin(2 * math.pi * 73.42 * t)   # D2
        buf[i] += pad * 0.048 * math.sin(2 * math.pi * 110.00 * t)  # A2
        buf[i] += pad * 0.028 * math.sin(2 * math.pi * 164.81 * t)  # E3
        buf[i] += pad * 0.016 * math.sin(2 * math.pi * 220.00 * t)  # A3

    peak = max(abs(x) for x in buf) or 1.0
    gain = 0.78 / peak
    samples = [max(-1.0, min(1.0, x * gain)) for x in buf]

    out_dir = Path("/workspace/public/audio")
    wav_path = out_dir / "ident-ring.wav"
    mp3_path = out_dir / "ident-ring.mp3"
    with wave.open(str(wav_path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(x * 32767)) for x in samples))

    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(wav_path),
            "-codec:a",
            "libmp3lame",
            "-q:a",
            "4",
            str(mp3_path),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    wav_path.unlink()
    print(f"wrote {mp3_path} ({mp3_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
