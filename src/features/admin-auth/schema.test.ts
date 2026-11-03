import { describe, expect, it } from "bun:test";
import { MIN_PASSWORD_LENGTH } from "@/features/auth/constants";
import { loginSchema, passwordSchema } from "./schema";

describe("MIN_PASSWORD_LENGTH constant", () => {
  it("is defined as 8", () => {
    expect(MIN_PASSWORD_LENGTH).toBe(8);
  });
});

describe("passwordSchema", () => {
  it("rejects passwords with fewer than 8 characters", () => {
    // 7 characters (boundary)
    const sevenChar = passwordSchema.safeParse("1234567");
    expect(sevenChar.success).toBe(false);
    if (!sevenChar.success) {
      expect(sevenChar.error.issues[0]?.message).toBe(
        "Password must be at least 8 characters.",
      );
    }

    // 0 characters (empty)
    const empty = passwordSchema.safeParse("");
    expect(empty.success).toBe(false);

    // 1 character
    const oneChar = passwordSchema.safeParse("a");
    expect(oneChar.success).toBe(false);

    // 6 characters
    const sixChar = passwordSchema.safeParse("abcdef");
    expect(sixChar.success).toBe(false);
  });

  it("accepts passwords with 8 or more characters", () => {
    // Exactly 8 characters (boundary)
    const eightChar = passwordSchema.safeParse("12345678");
    expect(eightChar.success).toBe(true);

    const eightCharComplex = passwordSchema.safeParse("P@ssw0rd");
    expect(eightCharComplex.success).toBe(true);

    // 9 characters
    const nineChar = passwordSchema.safeParse("123456789");
    expect(nineChar.success).toBe(true);

    // Longer password
    const longerPassword = passwordSchema.safeParse("longerValidPassword!");
    expect(longerPassword.success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("rejects login payload when password is 7 characters", () => {
    const result = loginSchema.safeParse({
      email: "admin@vinsetpharma.com",
      password: "1234567",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find(
        (issue) => issue.path[0] === "password",
      );
      expect(passwordError?.message).toBe(
        "Password must be at least 8 characters.",
      );
    }
  });

  it("accepts login payload when password is 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "admin@vinsetpharma.com",
      password: "12345678",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("admin@vinsetpharma.com");
      expect(result.data.password).toBe("12345678");
    }
  });

  it("accepts login payload when password is longer than 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "admin@vinsetpharma.com",
      password: "SuperSecretPassword123!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email while accepting 8-character password", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "12345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find(
        (issue) => issue.path[0] === "email",
      );
      expect(emailError?.message).toBe("Please enter a valid email address.");
    }
  });

  it("validates password field shape directly (used by form field blur validation)", () => {
    const sevenChar = loginSchema.shape.password.safeParse("abcdefg");
    expect(sevenChar.success).toBe(false);
    if (!sevenChar.success) {
      expect(sevenChar.error.issues[0]?.message).toBe(
        "Password must be at least 8 characters.",
      );
    }

    const eightChar = loginSchema.shape.password.safeParse("abcdefgh");
    expect(eightChar.success).toBe(true);
  });
});
