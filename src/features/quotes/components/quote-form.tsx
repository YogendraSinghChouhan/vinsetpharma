"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/config/env";
import { submitQuoteRequest } from "../actions";
import { QUOTE_HONEYPOT_FIELD_NAME } from "../constants";
import { quoteSubmissionSchema } from "../validation";

interface QuoteFormProps {
  productId: string;
}

export function QuoteForm({ productId }: QuoteFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const turnstileRef = useRef<TurnstileInstance>(null);
  const successContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSuccess) {
      successContainerRef.current?.focus();
    }
  }, [isSuccess]);

  const form = useForm({
    defaultValues: {
      productId,
      name: "",
      email: "",
      phone: "",
      message: "",
      turnstileToken: "",
      [QUOTE_HONEYPOT_FIELD_NAME]: "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);

      // Client-side Zod validation
      const parseResult = quoteSubmissionSchema.safeParse(value);
      if (!parseResult.success) {
        setFormError(
          parseResult.error.issues[0]?.message ??
            "Please review the form for errors.",
        );
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await submitQuoteRequest(value);

        if (!result.success) {
          setFormError(result.error);
          setIsSubmitting(false);
          turnstileRef.current?.reset();
          form.setFieldValue("turnstileToken", "");
          return;
        }

        setIsSuccess(true);
      } catch {
        setFormError(
          "An unexpected connection error occurred. Please try again.",
        );
        turnstileRef.current?.reset();
        form.setFieldValue("turnstileToken", "");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isSuccess) {
    return (
      <div
        ref={successContainerRef}
        tabIndex={-1}
        aria-live="polite"
        className="rounded-lg border border-emerald-500/20 bg-emerald-50/50 p-8 text-center outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-emerald-950/20"
      >
        <h3 className="text-xl font-semibold tracking-tight text-emerald-900 dark:text-emerald-100">
          Quote Request Received
        </h3>
        <p className="mt-3 text-base text-emerald-800 dark:text-emerald-200">
          Thank you for your enquiry. Our pharmaceutical supply team will review
          your request and contact you promptly.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {formError ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      {/* Visually hidden honeypot field (anti-spam) */}
      <div
        style={{ display: "none" }}
        aria-hidden="true"
        tabIndex={-1}
        className="hidden"
      >
        <label htmlFor={QUOTE_HONEYPOT_FIELD_NAME}>Do not fill this</label>
        <input
          id={QUOTE_HONEYPOT_FIELD_NAME}
          name={QUOTE_HONEYPOT_FIELD_NAME}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.getFieldValue(QUOTE_HONEYPOT_FIELD_NAME)}
          onChange={(e) =>
            form.setFieldValue(QUOTE_HONEYPOT_FIELD_NAME, e.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Name Field */}
        <form.Field
          name="name"
          validators={{
            onBlur: ({ value }) => {
              const res = quoteSubmissionSchema.shape.name.safeParse(value);
              return res.success ? undefined : res.error.issues[0]?.message;
            },
          }}
        >
          {(field) => {
            const error = field.state.meta.errors[0];
            const isInvalid = Boolean(error);
            const errorId = "quote-name-error";

            return (
              <Field data-invalid={isInvalid} className="gap-1.5">
                <FieldLabel htmlFor={field.name}>
                  <FieldTitle>Full Name</FieldTitle>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Dr. Jane Smith"
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

        {/* Email Field */}
        <form.Field
          name="email"
          validators={{
            onBlur: ({ value }) => {
              const res = quoteSubmissionSchema.shape.email.safeParse(value);
              return res.success ? undefined : res.error.issues[0]?.message;
            },
          }}
        >
          {(field) => {
            const error = field.state.meta.errors[0];
            const isInvalid = Boolean(error);
            const errorId = "quote-email-error";

            return (
              <Field data-invalid={isInvalid} className="gap-1.5">
                <FieldLabel htmlFor={field.name}>
                  <FieldTitle>Email Address</FieldTitle>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="name@organization.com"
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
      </div>

      {/* Phone Field */}
      <form.Field
        name="phone"
        validators={{
          onBlur: ({ value }) => {
            const res = quoteSubmissionSchema.shape.phone.safeParse(value);
            return res.success ? undefined : res.error.issues[0]?.message;
          },
        }}
      >
        {(field) => {
          const error = field.state.meta.errors[0];
          const isInvalid = Boolean(error);
          const errorId = "quote-phone-error";

          return (
            <Field data-invalid={isInvalid} className="gap-1.5">
              <FieldLabel htmlFor={field.name}>
                <FieldTitle>Phone Number</FieldTitle>
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
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

      {/* Message Field */}
      <form.Field
        name="message"
        validators={{
          onBlur: ({ value }) => {
            const res = quoteSubmissionSchema.shape.message.safeParse(value);
            return res.success ? undefined : res.error.issues[0]?.message;
          },
        }}
      >
        {(field) => {
          const error = field.state.meta.errors[0];
          const isInvalid = Boolean(error);
          const errorId = "quote-message-error";

          return (
            <Field data-invalid={isInvalid} className="gap-1.5">
              <FieldLabel htmlFor={field.name}>
                <FieldTitle>Enquiry Details & Quantities</FieldTitle>
              </FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                rows={4}
                placeholder="Please outline the required batch quantities, specifications, or delivery timelines."
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

      {/* Cloudflare Turnstile */}
      <form.Field name="turnstileToken">
        {(field) => (
          <div className="flex flex-col gap-2">
            <Turnstile
              ref={turnstileRef}
              siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(token) => field.handleChange(token)}
              onError={() => {
                field.handleChange("");
                setFormError("Security verification failed. Please try again.");
              }}
              onExpire={() => field.handleChange("")}
            />
          </div>
        )}
      </form.Field>

      {/* Consent line */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        By submitting, you agree that Vinsent Pharma may contact you about this
        enquiry.
      </p>

      {/* Submit Button */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit]) => (
          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Submitting Quote Request...
              </>
            ) : (
              "Submit Quote Request"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
