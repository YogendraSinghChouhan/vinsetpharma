import type * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FormSectionProps {
  id?: string;
  title: string;
  description?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  id,
  title,
  description,
  hint,
  children,
  className,
}: FormSectionProps) {
  return (
    <Card
      id={id}
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs transition-colors",
        className,
      )}
    >
      <CardHeader className="p-0 pb-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <div>
            <CardTitle className="font-heading text-base sm:text-lg font-semibold text-foreground tracking-tight">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {description}
              </CardDescription>
            )}
          </div>
          {hint && (
            <div className="text-xs text-muted-foreground shrink-0 self-start sm:self-auto">
              {hint}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4 space-y-4">{children}</CardContent>
    </Card>
  );
}
