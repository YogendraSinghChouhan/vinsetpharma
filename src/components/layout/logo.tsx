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
          "inline-flex items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2",
          className,
        )}
        aria-label={`${SITE_NAME} home`}
      >
        <span className="inline-flex items-center justify-center rounded-xl bg-card px-4 py-2 shadow-2xs ring-1 ring-border/60 transition-opacity hover:opacity-95">
          <Image
            src={logoImage}
            alt={SITE_NAME}
            width={160}
            height={55}
            className="h-10 w-auto object-contain sm:h-11 md:h-12"
            sizes="(max-width: 640px) 130px, 160px"
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
        width={size === "small" ? 100 : 180}
        height={size === "small" ? 35 : 62}
        className={cn(
          "w-auto object-contain",
          size === "small" ? "h-7 sm:h-8" : "h-10 sm:h-12 lg:h-14",
        )}
        sizes={
          size === "small"
            ? "100px"
            : "(max-width: 640px) 140px, (max-width: 1024px) 160px, 180px"
        }
      />
    </Link>
  );
}
