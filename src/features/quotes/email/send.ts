import "server-only";

import { Resend } from "resend";
import { env } from "@/config/env";
import { ROUTES } from "@/config/site";
import type { QuoteRequest } from "../schema";
import { QuoteNotificationEmail } from "./quote-notification";

const resend = new Resend(env.RESEND_API_KEY);

/**
 * Sanitizes header and subject values to prevent email header injection (CRLF injection).
 */
function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export type SendQuoteEmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

/**
 * Sends internal quote notification email to company address using Resend.
 * Does NOT send a confirmation email to the visitor.
 */
export async function sendQuoteNotificationEmail(
  quote: QuoteRequest,
): Promise<SendQuoteEmailResult> {
  const cleanProductTitle = sanitizeHeader(quote.productTitle);
  const cleanVisitorEmail = sanitizeHeader(quote.email);
  const cleanVisitorName = sanitizeHeader(quote.name);

  const adminBaseUrl = env.APP_URL.replace(/\/+$/, "");
  const adminDetailUrl = `${adminBaseUrl}${ROUTES.adminQuoteDetail(quote.id)}`;

  try {
    const { data, error } = await resend.emails.send({
      from: env.QUOTE_FROM_EMAIL,
      to: [env.QUOTE_NOTIFICATION_EMAIL],
      replyTo: cleanVisitorEmail,
      subject: `New quote request: ${cleanProductTitle}`,
      react: QuoteNotificationEmail({
        quoteId: quote.id,
        productTitle: quote.productTitle,
        name: cleanVisitorName,
        email: cleanVisitorEmail,
        phone: quote.phone,
        message: quote.message,
        submittedAt: quote.createdAt,
        adminUrl: adminDetailUrl,
      }),
    });

    if (error || !data) {
      return {
        success: false,
        error: error?.message ?? "Failed to deliver email through Resend.",
      };
    }

    return {
      success: true,
      messageId: data.id,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Network error during email dispatch.";
    return {
      success: false,
      error: message,
    };
  }
}
