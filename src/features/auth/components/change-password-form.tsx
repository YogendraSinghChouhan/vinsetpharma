"use client";

import { IconShieldCheck } from "@tabler/icons-react";
import { useState } from "react";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "../client";
import { MIN_PASSWORD_LENGTH } from "../constants";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      ),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

type FormErrors = Partial<
  Record<"currentPassword" | "newPassword" | "confirmPassword", string>
>;

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setErrors({});

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const nextErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (
          (field === "currentPassword" ||
            field === "newPassword" ||
            field === "confirmPassword") &&
          !nextErrors[field]
        ) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    const { error } = await authClient.changePassword({
      currentPassword: result.data.currentPassword,
      newPassword: result.data.newPassword,
      revokeOtherSessions,
    });

    if (error) {
      setFormError(error.message || "Unable to change your password.");
      setIsSubmitting(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
    toast.add({
      title: "Password changed",
      description: revokeOtherSessions
        ? "Your password was changed and other sessions were signed out."
        : "Your password was changed successfully.",
      type: "success",
    });
  }

  return (
    <Card className="w-full border bg-card shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Change password</h2>
            <p className="text-sm text-muted-foreground">
              Update the password used to access the admin dashboard.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {formError ? (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
          <Field data-invalid={Boolean(errors.currentPassword)}>
            <FieldLabel htmlFor="current-password">
              <FieldTitle>Current password</FieldTitle>
            </FieldLabel>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.currentPassword)}
            />
            {errors.currentPassword ? (
              <FieldError>{errors.currentPassword}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={Boolean(errors.newPassword)}>
            <FieldLabel htmlFor="new-password">
              <FieldTitle>New password</FieldTitle>
            </FieldLabel>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.newPassword)}
            />
            {errors.newPassword ? (
              <FieldError>{errors.newPassword}</FieldError>
            ) : (
              <p className="text-xs text-muted-foreground">
                Use at least {MIN_PASSWORD_LENGTH} characters.
              </p>
            )}
          </Field>

          <Field data-invalid={Boolean(errors.confirmPassword)}>
            <FieldLabel htmlFor="confirm-password">
              <FieldTitle>Confirm new password</FieldTitle>
            </FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword ? (
              <FieldError>{errors.confirmPassword}</FieldError>
            ) : null}
          </Field>

          <label
            htmlFor="revoke-other-sessions"
            className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/30 p-3 text-sm"
          >
            <Checkbox
              id="revoke-other-sessions"
              checked={revokeOtherSessions}
              onCheckedChange={(checked) =>
                setRevokeOtherSessions(checked === true)
              }
              disabled={isSubmitting}
              aria-label="Sign out other sessions"
            />
            <span>
              <span className="block font-medium text-foreground">
                Sign out other sessions
              </span>
              <span className="block text-xs text-muted-foreground">
                Recommended if you suspect someone else knows your password.
              </span>
            </span>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Changing password..." : "Change password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
