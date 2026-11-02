import "server-only";

import { env } from "@/config/env";
import { TURNSTILE_TIMEOUT_MS, TURNSTILE_VERIFY_URL } from "./constants";

export type TurnstileVerificationResult =
  | { success: true }
  | { success: false; error: string };

type TurnstileApiResponse = {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
};

/**
 * Verifies a Cloudflare Turnstile token via siteverify API.
 * Fails closed: any timeout, network error, or invalid response returns failure.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<TurnstileVerificationResult> {
  if (!token) {
    return {
      success: false,
      error: "Security verification token is missing.",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        success: false,
        error: "Security check verification failed. Please try again.",
      };
    }

    const data = (await response.json()) as TurnstileApiResponse;

    if (!data.success) {
      return {
        success: false,
        error: "Security check could not be verified. Please try again.",
      };
    }

    return { success: true };
  } catch {
    // Fail closed on network failure or timeout
    return {
      success: false,
      error: "Security verification service timed out. Please try again.",
    };
  }
}
