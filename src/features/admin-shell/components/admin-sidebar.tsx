"use client";

import { IconExternalLink, IconLogout, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/config/site";
import { authClient } from "@/features/auth/client";
import type { Session } from "@/features/auth/server";
import { ADMIN_NAV } from "../constants";

type AdminSidebarProps = {
  session: Session;
};

export function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push(ROUTES.adminLogin);
    router.refresh();
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="small" href={ROUTES.admin} />
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Admin
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.url}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      }
                      isActive={isActive}
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu className="mb-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <a href={ROUTES.home} target="_blank" rel="noopener noreferrer">
                  <IconExternalLink className="size-4" />
                  <span>View website</span>
                </a>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="w-full justify-start gap-2.5 px-2 py-6 text-left"
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <IconUser className="size-4" />
                </div>
                <div className="flex flex-1 flex-col min-w-0">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {session.user.name}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground lowercase">
                    {session.user.email}
                  </span>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <div className="border-b px-3 pb-2 pt-1 text-xs text-muted-foreground mb-1">
              <p className="font-semibold text-foreground truncate">
                {session.user.name}
              </p>
              <p className="truncate lowercase">{session.user.email}</p>
            </div>
            <DropdownMenuItem
              variant="destructive"
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              <IconLogout className="size-3.5" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
