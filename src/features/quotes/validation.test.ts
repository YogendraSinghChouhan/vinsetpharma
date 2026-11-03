import { describe, expect, it } from "bun:test";
import { QUOTE_HONEYPOT_FIELD_NAME, QUOTE_LIMITS } from "./constants";
import { quoteSubmissionSchema } from "./validation";

const validBasePayload = {
  productId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  name: "Dr. Jane Smith",
  email: "jane.smith@hospital.org",
  phone: "+1 (555) 234-5678",
  message: "We need 500 units of this formulation delivered by next month.",
};

describe("quoteSubmissionSchema", () => {
  it("accepts valid inputs with standard phone and message", () => {
    const result = quoteSubmissionSchema.safeParse(validBasePayload);
    expect(result.success).toBe(true);
  });

  describe("phone variants", () => {
    it("accepts international format with plus prefix and spaces", () => {
      const payload = { ...validBasePayload, phone: "+44 20 7946 0912" };
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(true);
    });

    it("accepts digits only format", () => {
      const payload = { ...validBasePayload, phone: "5551234567" };
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(true);
    });

    it("accepts parentheses and hyphens", () => {
      const payload = { ...validBasePayload, phone: "(555) 123-4567" };
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(true);
    });

    it("rejects phone numbers with alphabetic or illegal characters", () => {
      const payload = { ...validBasePayload, phone: "555-CALL-NOW" };
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(false);

      const payload2 = { ...validBasePayload, phone: "555#123*4567" };
      expect(quoteSubmissionSchema.safeParse(payload2).success).toBe(false);
    });

    it("rejects phone numbers with fewer than minDigits (7 digits)", () => {
      const payload = { ...validBasePayload, phone: "123-456" }; // 6 digits
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(false);
    });

    it("rejects phone numbers with more than maxDigits (15 digits)", () => {
      const payload = { ...validBasePayload, phone: "1234567890123456" }; // 16 digits
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(false);
    });
  });

  describe("honeypot field", () => {
    it("accepts payload when honeypot field is omitted", () => {
      const result = quoteSubmissionSchema.safeParse(validBasePayload);
      expect(result.success).toBe(true);
    });

    it("accepts payload when honeypot field is empty", () => {
      const payload = { ...validBasePayload, [QUOTE_HONEYPOT_FIELD_NAME]: "" };
      const result = quoteSubmissionSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("parses honeypot string when filled (for downstream silent drop)", () => {
      const payload = {
        ...validBasePayload,
        [QUOTE_HONEYPOT_FIELD_NAME]: "I am a bot",
      };
      const result = quoteSubmissionSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[QUOTE_HONEYPOT_FIELD_NAME]).toBe("I am a bot");
      }
    });
  });

  describe("message limits", () => {
    it("rejects message shorter than minimum length (10 characters)", () => {
      const payload = { ...validBasePayload, message: "Too short" }; // 9 chars
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(false);
    });

    it("accepts message at minimum length boundary (10 characters)", () => {
      const payload = { ...validBasePayload, message: "1234567890" }; // 10 chars
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(true);
    });

    it("accepts message at maximum length boundary (2000 characters)", () => {
      const payload = {
        ...validBasePayload,
        message: "A".repeat(QUOTE_LIMITS.message.max),
      };
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(true);
    });

    it("rejects message exceeding maximum length (2000 characters)", () => {
      const payload = {
        ...validBasePayload,
        message: "A".repeat(QUOTE_LIMITS.message.max + 1),
      };
      expect(quoteSubmissionSchema.safeParse(payload).success).toBe(false);
    });
  });
});
