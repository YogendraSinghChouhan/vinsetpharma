import { mock } from "bun:test";

// Cleanly mock server-only package so bun scripts can import server modules
mock.module("server-only", () => {
  return {};
});
