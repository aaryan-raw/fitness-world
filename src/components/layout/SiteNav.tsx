"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/data/navigation";

type SiteNavProps = {
  items: NavItem[];
  /** Header call to action, shown from the `sm` breakpoint up. */
  headerCta: ReactNode;
  /** Full-width call to action inside the mobile menu, shown below `sm`. */
  menuCta: ReactNode;
};

function isActive(pathname: string, href: string): boolean {
  const path = href.split("#")[0];
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * The only client component in the shell. It needs the current path for active
 * link styling and state for the mobile menu. Everything else stays on the server.
 */
export function SiteNav({ items, headerCta, menuCta }: SiteNavProps) {
  const pathname = usePathname();
  // The menu is open only for the path it was opened on, so navigating
  // anywhere closes it without needing an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPath(null);
        buttonRef.current?.focus();
      }
    }
    // Click outside the menu closes it.
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpenPath(null);
    }
    // Tabbing out of the menu closes it.
    function onFocusIn(event: FocusEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpenPath(null);
    }
    // Following any link inside the menu closes it, including same-page links
    // (a path change alone would not catch those).
    function onClick(event: MouseEvent) {
      const link = (event.target as Element).closest("a");
      if (link && panelRef.current?.contains(link)) setOpenPath(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="flex items-center gap-6 xl:gap-8">
      <nav aria-label="Main" className="hidden lg:block">
        <ul className="flex items-center gap-6 xl:gap-8">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="relative inline-block py-2 text-[0.9375rem] font-medium text-ink-muted transition-colors hover:text-ink aria-[current=page]:text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden sm:block">{headerCta}</div>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Menu"
        onClick={() => setOpenPath(open ? null : pathname)}
        className="inline-flex size-11 items-center justify-center rounded-control border border-line-strong text-ink transition-colors hover:border-ink lg:hidden"
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>

      {/* Anchored to the sticky header, which is the nearest positioned ancestor. */}
      <div
        ref={panelRef}
        id={menuId}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-canvas lg:hidden"
      >
        <nav aria-label="Main" className="mx-auto w-full max-w-page px-gutter pb-6 pt-2">
          <ul>
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="type-title flex min-h-14 items-center py-3 text-ink-muted transition-colors hover:text-ink aria-[current=page]:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 sm:hidden">{menuCta}</div>
        </nav>
      </div>
    </div>
  );
}
