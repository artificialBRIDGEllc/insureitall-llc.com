import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-[color,background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-11 px-5 hover:-translate-y-0.5 active:translate-y-0",
  {
    variants: {
      variant: {
        navy: "bg-navy text-elevated shadow-elevation-brand hover:bg-navy-deep",
        blue: "bg-blue text-elevated shadow-btn hover:bg-blue-deep",
        outline: "bg-elevated text-navy shadow-elevation-1 hover:bg-soft",
        ghost: "bg-transparent text-navy hover:bg-soft",
        soft: "bg-soft text-navy hover:bg-mist",
      },
      size: {
        default: "h-11",
        lg: "h-12 px-6 text-base",
        sm: "h-9 px-3.5 text-sm min-h-9",
      },
    },
    defaultVariants: {
      variant: "navy",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
