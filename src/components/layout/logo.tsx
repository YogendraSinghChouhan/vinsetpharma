import Image from "next/image";
import Link from "next/link";
import { ROUTES, SITE_NAME } from "@/config/site";
import { cn } from "@/lib/utils";
import logoImage from "../../../public/logo.png";

type LogoProps = {
  inverted?: boolean;
  priority?: boolean;
  size?: "default" | "small";
  className?: string;
  href?: string;
};

export function Logo({
  inverted = false,
  priority = false,
  size = "default",
  className,
  href = ROUTES.home,
}: LogoProps) {
  // On dark surfaces (site footer), display on a light rounded blister tile for crisp contrast and legibility
  if (inverted) {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex items-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark",
          className,
        )}
        aria-label={`${SITE_NAME} home`}
      >
        <span className="inline-flex items-center justify-center rounded-2xl bg-card px-5 py-3 shadow-2xs ring-1 ring-border/60 transition-opacity hover:opacity-95">
          <Image
            src={logoImage}
            alt={SITE_NAME}
            width={220}
            height={76}
            className="h-12 w-auto object-contain sm:h-14 md:h-16"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 190px, 220px"
          />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      aria-label={`${SITE_NAME} home`}
    >
      <Image
        src={logoImage}
        alt={SITE_NAME}
        priority={priority}
        width={size === "small" ? 110 : 220}
        height={size === "small" ? 38 : 76}
        className={cn(
          "w-auto object-contain",
          size === "small" ? "h-8 sm:h-9" : "h-12 sm:h-14 lg:h-16",
        )}
        sizes={
          size === "small"
            ? "110px"
            : "(max-width: 640px) 150px, (max-width: 1024px) 180px, 220px"
        }
      />
    </Link>
  );
}
