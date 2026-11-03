import { mock } from "bun:test";

// Populate mock environment variables for unit tests to satisfy T3 Env validation
process.env.DATABASE_URL = "postgres://test:test@localhost:5432/test";
process.env.BETTER_AUTH_SECRET = "test-secret-must-be-long-enough-32-chars";
process.env.APP_URL = "https://vinsetpharma.com";
process.env.S3_REGION = "us-east-1";
process.env.S3_BUCKET = "vinset-pharma-bucket";
process.env.S3_ACCESS_KEY_ID = "test-access-key";
process.env.S3_SECRET_ACCESS_KEY = "test-secret-key";
process.env.S3_PUBLIC_URL = "https://s3.vinsetpharma.com";
process.env.RESEND_API_KEY = "re_test_12345";
process.env.QUOTE_NOTIFICATION_EMAIL = "quotes@vinsetpharma.com";
process.env.QUOTE_FROM_EMAIL = "system@vinsetpharma.com";

// Cleanly mock server-only package so unit tests can import server modules
mock.module("server-only", () => {
  return {};
});
