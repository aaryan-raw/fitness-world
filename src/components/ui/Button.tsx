import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "inverse-outline";
type Size = "sm" | "md";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps | "href"> & {
    href: string;
    /** Open in a new tab. Adds rel="noopener noreferrer" and a screen-reader hint. */
    newTab?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold leading-none whitespace-nowrap select-none transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-active",
  secondary:
    "border border-line-strong text-ink hover:border-ink hover:bg-surface",
  ghost: "text-ink hover:text-accent underline-offset-4 hover:underline",
  // For use on accent (lime) backgrounds. The focus ring switches to the dark
  // canvas colour, because a lime ring would vanish against lime.
  inverse:
    "bg-canvas text-ink hover:bg-surface focus-visible:outline-canvas",
  "inverse-outline":
    "border border-on-accent/60 text-on-accent hover:border-on-accent hover:bg-on-accent/10 focus-visible:outline-canvas",
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-4 text-[0.9375rem]",
  md: "h-13 px-6 text-base",
};

const externalPattern = /^(https?:|mailto:|tel:|\/\/)/;

/**
 * A real <a>/<Link> when `href` is given, otherwise a real <button>.
 * Internal paths use next/link; http(s), tel: and mailto: use a plain <a>.
 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  if (props.href !== undefined) {
    const { href, newTab, ...anchorProps } = props;

    if (externalPattern.test(href)) {
      return (
        <a
          href={href}
          className={classes}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...anchorProps}
        >
          {children}
          {newTab && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
