"use server";

import { headers } from "next/headers";
import { requireAdmin } from "@/features/auth/data";
import { GENERIC_ACTION_ERROR, logActionError } from "@/lib/server-error";
import { QUOTE_HONEYPOT_FIELD_NAME } from "./constants";
import * as quoteData from "./data";
import { sendQuoteNotificationEmail } from "./email/send";
import type { QuoteRequest } from "./schema";
import { verifyTurnstileToken } from "./turnstile";
import { quoteSubmissionSchema, updateQuoteStatusSchema } from "./validation";

export type SubmitQuoteActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export type UpdateQuoteStatusActionResult =
  | { success: true; data: QuoteRequest }
  | { success: false; error: string };

/**
 * Public server action for quote request submission.
 * Enforces strict 5-step pipeline:
 * 1. Zod validate
 * 2. Honeypot check (silent discard if filled)
 * 3. Cloudflare Turnstile token verification
 * 4. Database creation with product snapshot
 * 5. Notification email delivery (failure non-blocking)
 */
export async function submitQuoteRequest(
  input: unknown,
): Promise<SubmitQuoteActionResult> {
  // Step 1: Zod validation
  const parsed = quoteSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    const flatErrors = parsed.error.flatten().fieldErrors;
    const firstErrorMessage =
      parsed.error.issues[0]?.message ?? "Please correct the form errors.";
    return {
      success: false,
      error: firstErrorMessage,
      fieldErrors: flatErrors,
    };
  }

  // Step 2: Honeypot check
  const honeypotValue = parsed.data[QUOTE_HONEYPOT_FIELD_NAME];
  if (honeypotValue && honeypotValue.trim().length > 0) {
    // Silently succeed without persisting or notifying
    return { success: true };
  }

  // Step 3: Turnstile verification
  let clientIp: string | undefined;
  try {
    const headerStore = await headers();
    clientIp =
      headerStore.get("cf-connecting-ip") ??
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  } catch {
    // Ignore header lookup failure
  }

  const turnstileResult = await verifyTurnstileToken(
    parsed.data.turnstileToken,
    clientIp,
  );

  if (!turnstileResult.success) {
    return {
      success: false,
      error:
        turnstileResult.error ??
        "Security check failed. Please refresh and try again.",
    };
  }

  // Step 4: Create quote request in database
  let createdQuote: QuoteRequest;
  try {
    createdQuote = await quoteData.createQuoteRequest({
      productId: parsed.data.productId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
    });
  } catch (error: unknown) {
    logActionError("quotes.submit", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }

  // Step 5: Send internal notification email
  // If sending fails, do NOT fail the request: the quote is saved, emailSentAt remains null.
  try {
    const emailResult = await sendQuoteNotificationEmail(createdQuote);
    if (emailResult.success) {
      await quoteData.markQuoteEmailSent(createdQuote.id);
    }
  } catch {
    // Silent catch: record of failure is emailSentAt null in DB
  }

  return { success: true };
}

/**
 * Admin action to update quote review status.
 */
export async function setQuoteStatusAction(
  input: unknown,
): Promise<UpdateQuoteStatusActionResult> {
  try {
    await requireAdmin();
  } catch {
    return {
      success: false,
      error: "Unauthorized: admin session required.",
    };
  }

  const parsed = updateQuoteStatusSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid status parameters.",
    };
  }

  try {
    const updated = await quoteData.setQuoteStatus(parsed.data);
    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    logActionError("quotes.setStatus", error);
    return {
      success: false,
      error: GENERIC_ACTION_ERROR,
    };
  }
}
