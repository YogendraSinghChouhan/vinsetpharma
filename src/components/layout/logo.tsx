import Link from "next/link";
import { CapsuleMark } from "@/components/brand/capsule-mark";
import { ROUTES, SITE_NAME } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  inverted?: boolean;
  className?: string;
};

export function Logo({ inverted = false, className }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full py-1 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      aria-label={`${SITE_NAME} home`}
    >
      <CapsuleMark size={28} inverted={inverted} />
      <span
        className={cn(
          "font-heading text-lg font-bold tracking-tight transition-colors",
          inverted
            ? "text-brand-dark-foreground group-hover:text-accent-light"
            : "text-foreground group-hover:text-primary",
        )}
      >
        {SITE_NAME}
      </span>
    </Link>
  );
}
