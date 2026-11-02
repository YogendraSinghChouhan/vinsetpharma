import { z } from "zod";
import {
  QUOTE_HONEYPOT_FIELD_NAME,
  QUOTE_LIMITS,
  QUOTE_STATUSES,
} from "./constants";

const phoneRegex = /^[0-9+\-()\s]+$/;

export const quoteSubmissionSchema = z.object({
  productId: z
    .string()
    .min(1, "Product reference is required.")
    .uuid("Invalid product identifier."),
  name: z
    .string()
    .trim()
    .min(
      QUOTE_LIMITS.name.min,
      `Name must be at least ${QUOTE_LIMITS.name.min} characters.`,
    )
    .max(
      QUOTE_LIMITS.name.max,
      `Name cannot exceed ${QUOTE_LIMITS.name.max} characters.`,
    ),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(
      QUOTE_LIMITS.email.max,
      `Email cannot exceed ${QUOTE_LIMITS.email.max} characters.`,
    ),
  phone: z
    .string()
    .trim()
    .min(
      QUOTE_LIMITS.phone.min,
      `Phone number must be at least ${QUOTE_LIMITS.phone.min} characters.`,
    )
    .max(
      QUOTE_LIMITS.phone.max,
      `Phone number cannot exceed ${QUOTE_LIMITS.phone.max} characters.`,
    )
    .regex(phoneRegex, "Phone number contains invalid characters.")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return (
        digits.length >= QUOTE_LIMITS.phone.minDigits &&
        digits.length <= QUOTE_LIMITS.phone.maxDigits
      );
    }, `Phone number must contain between ${QUOTE_LIMITS.phone.minDigits} and ${QUOTE_LIMITS.phone.maxDigits} digits.`),
  message: z
    .string()
    .trim()
    .min(
      QUOTE_LIMITS.message.min,
      `Message must be at least ${QUOTE_LIMITS.message.min} characters.`,
    )
    .max(
      QUOTE_LIMITS.message.max,
      `Message cannot exceed ${QUOTE_LIMITS.message.max} characters.`,
    ),
  turnstileToken: z
    .string()
    .trim()
    .min(1, "Please complete the security check."),
  [QUOTE_HONEYPOT_FIELD_NAME]: z.string().optional(),
});

export type QuoteSubmissionInput = z.infer<typeof quoteSubmissionSchema>;

export const quoteIdSchema = z
  .string()
  .uuid("Invalid quote request identifier.");

export const updateQuoteStatusSchema = z.object({
  id: z.string().uuid("Invalid quote request identifier."),
  status: z.enum(QUOTE_STATUSES, {
    message: "Invalid quote status value.",
  }),
});

export type UpdateQuoteStatusInput = z.infer<typeof updateQuoteStatusSchema>;
