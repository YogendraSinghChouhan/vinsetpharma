"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { calculateHeaderState } from "./header-scroll";

interface HeaderScrollShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Client leaf wrapping the site navigation header.
 * Uses a single passive scroll listener throttled with requestAnimationFrame.
 * Mutates data attributes directly on the DOM node to eliminate React re-renders on scroll.
 * Reveals automatically on focusin for full keyboard accessibility.
 */
export function HeaderScrollShell({
  children,
  className,
}: HeaderScrollShellProps) {
  const shellRef = useRef<HTMLElement>(null);
  const prevScrollYRef = useRef(0);
  const isHiddenRef = useRef(false);
  const isScrolledRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    // Initialize with current scroll position
    const initialScrollY = window.scrollY;
    prevScrollYRef.current = Math.max(0, initialScrollY);

    const initial = calculateHeaderState({
      currentScrollY: initialScrollY,
      prevScrollY: initialScrollY,
      currentIsHidden: false,
    });

    isHiddenRef.current = initial.isHidden;
    isScrolledRef.current = initial.isScrolled;
    el.setAttribute("data-hidden", String(initial.isHidden));
    el.setAttribute("data-scrolled", String(initial.isScrolled));

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const currentY = window.scrollY;
        const prevY = prevScrollYRef.current;

        const next = calculateHeaderState({
          currentScrollY: currentY,
          prevScrollY: prevY,
          currentIsHidden: isHiddenRef.current,
        });

        if (next.isHidden !== isHiddenRef.current) {
          isHiddenRef.current = next.isHidden;
          el.setAttribute("data-hidden", String(next.isHidden));
        }

        if (next.isScrolled !== isScrolledRef.current) {
          isScrolledRef.current = next.isScrolled;
          el.setAttribute("data-scrolled", String(next.isScrolled));
        }

        prevScrollYRef.current = Math.max(0, currentY);
      });
    };

    const handleFocusIn = () => {
      // Bring header into view whenever keyboard navigation focuses an element inside it
      if (isHiddenRef.current) {
        isHiddenRef.current = false;
        el.setAttribute("data-hidden", "false");
        prevScrollYRef.current = Math.max(0, window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    el.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      el.removeEventListener("focusin", handleFocusIn);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  return (
    <header
      ref={shellRef}
      data-hidden="false"
      data-scrolled="false"
      className={cn(
        "header-scroll-shell sticky top-0 z-40 w-full bg-white border-b border-border/80",
        className,
      )}
    >
      {children}
    </header>
  );
}
