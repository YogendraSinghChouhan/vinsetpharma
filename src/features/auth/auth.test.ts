import { describe, expect, it } from "bun:test";
import { auth } from "./auth";
import { MIN_PASSWORD_LENGTH } from "./constants";

describe("Better Auth configuration", () => {
  it("enforces MIN_PASSWORD_LENGTH equal to 8", () => {
    expect(MIN_PASSWORD_LENGTH).toBe(8);
  });

  it("configures emailAndPassword minPasswordLength with MIN_PASSWORD_LENGTH", () => {
    expect(auth.options.emailAndPassword?.minPasswordLength).toBe(
      MIN_PASSWORD_LENGTH,
    );
    expect(auth.options.emailAndPassword?.minPasswordLength).toBe(8);
  });

  it("keeps disableSignUp set to true", () => {
    expect(auth.options.emailAndPassword?.disableSignUp).toBe(true);
  });
});
