import {
  IconCheck,
  IconCloud,
  IconDatabase,
  IconServer,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DashboardSystemInfo } from "../data";

type DashboardSystemOverviewProps = {
  system: DashboardSystemInfo;
  adminName: string;
  adminEmail?: string;
};

export function DashboardSystemOverview({
  system,
  adminName,
  adminEmail,
}: DashboardSystemOverviewProps) {
  return (
    <Card
      id="system-overview"
      className="border border-border/70 shadow-2xs overflow-hidden scroll-mt-6"
    >
      <div className="flex items-center justify-between p-5 border-b border-border/60 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <IconServer className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Operational Status & Environment
            </h2>
            <p className="text-xs text-muted-foreground">
              Connected cloud services and authenticated operator details.
            </p>
          </div>
        </div>

        <Badge className="border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-1">
          <IconCheck className="size-3" />
          <span>All Services Operational</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/50">
        {/* Database */}
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <IconDatabase className="size-3.5 text-primary" />
            <span>Database</span>
          </div>
          <p className="text-sm font-medium text-foreground">Neon PostgreSQL</p>
          <p className="text-[11px] text-muted-foreground">
            Serverless connection pool active
          </p>
        </div>

        {/* Storage */}
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <IconCloud className="size-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Object Storage</span>
          </div>
          <p className="text-sm font-medium text-foreground font-mono truncate">
            {system.storageBucket}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Region: {system.storageRegion}
          </p>
        </div>

        {/* Notifications */}
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <IconShieldCheck className="size-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Inquiry Alerts</span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">Resend</p>
          <p
            className="text-[11px] text-muted-foreground truncate"
            title={system.notificationEmail}
          >
            Alerts: {system.notificationEmail}
          </p>
        </div>

        {/* Operator Session */}
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <IconUser className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Active Operator</span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">
            {adminName}
          </p>
          <p
            className="text-[11px] text-muted-foreground truncate"
            title={adminEmail}
          >
            {adminEmail ?? "Authenticated Admin"}
          </p>
        </div>
      </div>
    </Card>
  );
}
