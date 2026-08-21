import { cn } from "@/lib/utils";

type LogoVariant = "primary" | "monogram" | "wordmark";
type LogoColor = "color" | "reverse" | "white" | "black";

const srcMap: Record<LogoVariant, Record<LogoColor, string>> = {
  primary: {
    color: "/brand/insureitall-primary.svg",
    reverse: "/brand/insureitall-primary-reverse.svg",
    white: "/brand/insureitall-primary-white.svg",
    black: "/brand/insureitall-primary-black.svg",
  },
  monogram: {
    color: "/brand/insureitall-monogram.svg",
    reverse: "/brand/insureitall-monogram-reverse.svg",
    white: "/brand/insureitall-monogram-white.svg",
    black: "/brand/insureitall-monogram-black.svg",
  },
  wordmark: {
    color: "/brand/insureitall-wordmark.svg",
    reverse: "/brand/insureitall-wordmark-reverse.svg",
    white: "/brand/insureitall-wordmark-white.svg",
    black: "/brand/insureitall-wordmark-black.svg",
  },
};

export function Logo({
  variant = "wordmark",
  color = "color",
  className,
}: {
  variant?: LogoVariant;
  color?: LogoColor;
  className?: string;
}) {
  return (
    <img
      src={srcMap[variant][color]}
      alt="INSUREitALL — Insurance Made Easy"
      className={cn("h-9 w-auto max-w-[220px] object-contain object-left", className)}
    />
  );
}
