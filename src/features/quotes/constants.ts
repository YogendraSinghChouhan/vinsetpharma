export const QUOTE_LIMITS = {
  name: {
    min: 2,
    max: 100,
  },
  email: {
    max: 254,
  },
  phone: {
    min: 7,
    max: 20,
    minDigits: 7,
    maxDigits: 15,
  },
  message: {
    min: 10,
    max: 2000,
  },
} as const;

export const QUOTE_STATUSES = ["new", "contacted"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];
export const DEFAULT_QUOTE_STATUS: QuoteStatus = "new";

export const ADMIN_QUOTES_PAGE_SIZE = 20;

export const QUOTE_HONEYPOT_FIELD_NAME = "business_fax";

export const QUOTE_FORM_ANCHOR_ID = "request-quote";
