import "server-only";

/**
 * Single generic constant returned to clients for all unexpected action failures.
 * Internal error details, database queries, and stack traces must never leak to the client.
 */
export const GENERIC_ACTION_ERROR = "Something went wrong. Please try again.";

export interface InnermostErrorInfo {
  code?: string;
  message: string;
}

/**
 * Traverses the error.cause chain to extract the innermost Postgres error code and cause message.
 */
export function getInnermostErrorInfo(err: unknown): InnermostErrorInfo {
  let curr: unknown = err;
  let code: string | undefined;
  let message = err instanceof Error ? err.message : String(err);

  while (curr && typeof curr === "object") {
    const record = curr as Record<string, unknown>;
    if (typeof record.code === "string") {
      code = record.code;
    }
    if (typeof record.message === "string") {
      message = record.message;
    }
    curr = record.cause;
  }

  return { code, message };
}

/**
 * Logs unexpected action failures for server diagnostic logs.
 * Emits ONLY the context label, Postgres error code, and innermost cause message.
 * Never logs request inputs, user data, emails, phones, or storage keys.
 */
export function logActionError(context: string, error: unknown): void {
  const { code, message } = getInnermostErrorInfo(error);
  // Sanctioned server action error logging per security guidelines
  console.error(
    `[action-error:${context}] code=${code ?? "none"} cause=${message}`,
  );
}
