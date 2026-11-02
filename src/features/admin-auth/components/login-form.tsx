"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/config/site";
import { authClient } from "@/features/auth/client";
import { ADMIN_AUTH_COPY } from "../constants";
import { loginSchema } from "../schema";

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);

      // Validate on client before submitting
      const parsed = loginSchema.safeParse(value);
      if (!parsed.success) {
        setFormError(ADMIN_AUTH_COPY.genericError);
        return;
      }

      try {
        const { error } = await authClient.signIn.email({
          email: parsed.data.email,
          password: parsed.data.password,
        });

        if (error) {
          if (error.status === 429) {
            setFormError(ADMIN_AUTH_COPY.rateLimitError);
          } else {
            setFormError(ADMIN_AUTH_COPY.genericError);
          }
          return;
        }

        router.push(ROUTES.admin);
        router.refresh();
      } catch {
        setFormError(ADMIN_AUTH_COPY.networkError);
      }
    },
  });

  return (
    <Card className="w-full max-w-md border bg-card shadow-sm">
      <CardHeader className="space-y-1.5 text-center">
        <h1 className="text-xl font-bold tracking-tight text-card-foreground">
          {ADMIN_AUTH_COPY.title}
        </h1>
        <CardDescription className="text-sm text-muted-foreground">
          {ADMIN_AUTH_COPY.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formError ? (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <form.Field
            name="email"
            validators={{
              onBlur: ({ value }) => {
                const res = loginSchema.shape.email.safeParse(value);
                return res.success ? undefined : res.error.issues[0]?.message;
              },
            }}
          >
            {(field) => {
              const error = field.state.meta.errors[0];
              const isInvalid = Boolean(error);
              const errorId = "email-error";

              return (
                <Field data-invalid={isInvalid} className="gap-1.5">
                  <FieldLabel htmlFor={field.name}>
                    <FieldTitle>{ADMIN_AUTH_COPY.emailLabel}</FieldTitle>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder={ADMIN_AUTH_COPY.emailPlaceholder}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? errorId : undefined}
                    required
                  />
                  {isInvalid ? (
                    <FieldError id={errorId}>{String(error)}</FieldError>
                  ) : null}
                </Field>
              );
            }}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) => {
                const res = loginSchema.shape.password.safeParse(value);
                return res.success ? undefined : res.error.issues[0]?.message;
              },
            }}
          >
            {(field) => {
              const error = field.state.meta.errors[0];
              const isInvalid = Boolean(error);
              const errorId = "password-error";

              return (
                <Field data-invalid={isInvalid} className="gap-1.5">
                  <FieldLabel htmlFor={field.name}>
                    <FieldTitle>{ADMIN_AUTH_COPY.passwordLabel}</FieldTitle>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    autoComplete="current-password"
                    placeholder={ADMIN_AUTH_COPY.passwordPlaceholder}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? errorId : undefined}
                    required
                  />
                  {isInvalid ? (
                    <FieldError id={errorId}>{String(error)}</FieldError>
                  ) : null}
                </Field>
              );
            }}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    {ADMIN_AUTH_COPY.submittingButton}
                  </>
                ) : (
                  ADMIN_AUTH_COPY.submitButton
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
