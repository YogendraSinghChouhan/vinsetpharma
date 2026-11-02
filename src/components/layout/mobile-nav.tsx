"use client";

import { IconMenu } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CONTACT, MAIN_NAV, ROUTES } from "@/config/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Open navigation menu"
            className="min-h-[44px] min-w-[44px] rounded-full border-border/80"
          >
            <IconMenu className="size-5" />
          </Button>
        }
      />
      <SheetContent
        side="left"
        className="flex w-full max-w-xs flex-col gap-6 overflow-y-auto p-6 sm:max-w-sm"
      >
        <div className="flex items-center justify-between">
          <SheetTitle className="sr-only">Site Navigation</SheetTitle>
          <Logo />
        </div>

        <nav aria-label="Mobile navigation" className="mt-2 flex-1">
          <ul className="flex flex-col gap-1.5">
            {MAIN_NAV.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-[44px] items-center rounded-full px-4 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive
                        ? "bg-surface-tint text-primary font-semibold shadow-[inset_0_1px_2px_rgba(4,67,83,0.08)]"
                        : "text-foreground hover:bg-muted/70",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-4 border-t border-dashed border-border">
            <Link
              href={ROUTES.products}
              onClick={close}
              className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore Products
            </Link>
          </div>
        </nav>

        {CONTACT.phones.length > 0 || CONTACT.email ? (
          <div className="flex flex-col gap-3 border-t border-border pt-4 text-xs">
            {CONTACT.phones.map((phone) => (
              <div key={phone.e164} className="flex flex-col gap-0.5">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Phone
                </span>
                {phone.href ? (
                  <a
                    href={phone.href}
                    onClick={close}
                    className="min-h-[44px] inline-flex items-center text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    {phone.display}
                  </a>
                ) : (
                  <span className="text-muted-foreground">{phone.display}</span>
                )}
              </div>
            ))}

            {CONTACT.email ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Email
                </span>
                {CONTACT.email.href ? (
                  <a
                    href={CONTACT.email.href}
                    onClick={close}
                    className="min-h-[44px] inline-flex items-center text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    {CONTACT.email.value}
                  </a>
                ) : (
                  <span className="text-muted-foreground">
                    {CONTACT.email.value}
                  </span>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
