import "server-only";

import { headers } from "next/headers";
import { auth } from "./server";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

// All seeded accounts are admins; public registration is disabled.
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: an admin session is required");
  }
  return session;
}
