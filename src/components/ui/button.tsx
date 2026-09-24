import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva("inline-flex min-h-11 items-center justify-center gap-2 border px-5 text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      primary: "border-primary bg-primary text-primary-foreground hover:bg-primary/85",
      secondary: "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/85",
      outline: "border-foreground/30 bg-transparent text-foreground hover:bg-foreground hover:text-background",
      ghost: "border-transparent bg-transparent text-foreground hover:bg-muted",
    },
    size: { default: "h-11", icon: "size-11 p-0", sm: "h-9 min-h-9 px-3" },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Component = asChild ? Slot : "button";
  return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";