import { describe, expect, it } from "bun:test";
import { PgDialect } from "drizzle-orm/pg-core";
import { categories } from "@/features/categories/schema";
import { media } from "@/features/media/schema";
import { products } from "@/features/products/schema";
import {
  buildReorderStatement,
  buildSubsetReorderStatement,
  ReorderValidationError,
} from "./reorder";

describe("buildReorderStatement", () => {
  const dialect = new PgDialect();

  const id1 = "11111111-1111-1111-1111-111111111111";
  const id2 = "22222222-2222-2222-2222-222222222222";
  const id3 = "33333333-3333-3333-3333-333333333333";

  it("throws ReorderValidationError when ids array is empty", () => {
    expect(() =>
      buildReorderStatement({
        table: media,
        ids: [],
      }),
    ).toThrow(ReorderValidationError);

    expect(() =>
      buildReorderStatement({
        table: media,
        ids: [],
      }),
    ).toThrow("Reorder list cannot be empty.");
  });

  it("throws ReorderValidationError when duplicate ids exist in input", () => {
    expect(() =>
      buildReorderStatement({
        table: media,
        ids: [id1, id2, id1],
      }),
    ).toThrow(ReorderValidationError);

    expect(() =>
      buildReorderStatement({
        table: media,
        ids: [id1, id2, id1],
      }),
    ).toThrow(`Reorder list contains duplicate ID: ${id1}`);
  });

  it("builds reorder statement for media with explicit casts on both sides and no updated_at", () => {
    const ids = [id1, id2];
    const statement = buildReorderStatement({
      table: media,
      ids,
      refreshUpdatedAt: false,
    });

    const query = dialect.sqlToQuery(statement);

    // Verify explicit ::uuid and ::integer casts in both CASE and WHERE IN
    expect(query.sql).toBe(
      'UPDATE "media" SET sort_order = CASE "media"."id" WHEN $1::uuid THEN $2::integer WHEN $3::uuid THEN $4::integer END WHERE "media"."id" IN ($5::uuid, $6::uuid)',
    );

    // Verify absence of updated_at column update for media
    expect(query.sql).not.toContain("updated_at");

    // Verify parameter count: 2 ids * 3 positions (when id, then position, where id) = 6 params
    expect(query.params).toHaveLength(6);

    // Verify exact parameter values and ordering
    expect(query.params).toEqual([id1, 1, id2, 2, id1, id2]);
  });

  it("builds reorder statement for products with updated_at refreshed", () => {
    const ids = [id1, id2, id3];
    const statement = buildReorderStatement({
      table: products,
      ids,
      refreshUpdatedAt: true,
    });

    const query = dialect.sqlToQuery(statement);

    // Verify SQL shape includes updated_at = NOW()
    expect(query.sql).toBe(
      'UPDATE "products" SET sort_order = CASE "products"."id" WHEN $1::uuid THEN $2::integer WHEN $3::uuid THEN $4::integer WHEN $5::uuid THEN $6::integer END, updated_at = NOW() WHERE "products"."id" IN ($7::uuid, $8::uuid, $9::uuid)',
    );

    // Verify parameter count: 3 * 3 = 9 params
    expect(query.params).toHaveLength(9);
    expect(query.params).toEqual([id1, 1, id2, 2, id3, 3, id1, id2, id3]);
  });

  it("builds reorder statement for categories with updated_at refreshed", () => {
    const ids = [id2, id1];
    const statement = buildReorderStatement({
      table: categories,
      ids,
      refreshUpdatedAt: true,
    });

    const query = dialect.sqlToQuery(statement);

    expect(query.sql).toBe(
      'UPDATE "categories" SET sort_order = CASE "categories"."id" WHEN $1::uuid THEN $2::integer WHEN $3::uuid THEN $4::integer END, updated_at = NOW() WHERE "categories"."id" IN ($5::uuid, $6::uuid)',
    );

    expect(query.params).toEqual([id2, 1, id1, 2, id2, id1]);
  });
});

describe("buildSubsetReorderStatement", () => {
  const dialect = new PgDialect();

  const id1 = "11111111-1111-1111-1111-111111111111";
  const id2 = "22222222-2222-2222-2222-222222222222";
  const id3 = "33333333-3333-3333-3333-333333333333";

  it("throws ReorderValidationError when ids array is empty", () => {
    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [],
      }),
    ).toThrow(ReorderValidationError);

    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [],
      }),
    ).toThrow("Reorder list cannot be empty.");
  });

  it("throws ReorderValidationError when ids array has length < 2", () => {
    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [id1],
      }),
    ).toThrow(ReorderValidationError);

    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [id1],
      }),
    ).toThrow("Reorder list must contain at least 2 items to reorder.");
  });

  it("throws ReorderValidationError when duplicate ids exist in input", () => {
    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [id1, id2, id1],
      }),
    ).toThrow(ReorderValidationError);

    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [id1, id2, id1],
      }),
    ).toThrow(`Reorder list contains duplicate ID: ${id1}`);
  });

  it("throws ReorderValidationError when an id is not a valid UUID", () => {
    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [id1, "not-a-valid-uuid"],
      }),
    ).toThrow(ReorderValidationError);

    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [id1, "not-a-valid-uuid"],
      }),
    ).toThrow("Reorder list contains invalid UUID: not-a-valid-uuid");
  });

  it("throws ReorderValidationError when an id is unknown (not in knownIds)", () => {
    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [id1, id2],
        knownIds: [id1, id3],
      }),
    ).toThrow(ReorderValidationError);

    expect(() =>
      buildSubsetReorderStatement({
        table: products,
        ids: [id1, id2],
        knownIds: [id1, id3],
      }),
    ).toThrow(`Reorder list contains unknown ID: ${id2}`);
  });

  it("builds atomic CTE reorder statement for products with updated_at and bound parameters", () => {
    const ids = [id2, id1];
    const statement = buildSubsetReorderStatement({
      table: products,
      ids,
      refreshUpdatedAt: true,
    });

    const query = dialect.sqlToQuery(statement);

    // Verify CTE structure and unnest with ordinality
    expect(query.sql).toContain("WITH target_order AS");
    expect(query.sql).toContain(
      "unnest(ARRAY[$1::uuid, $2::uuid]) WITH ORDINALITY AS t(id, pos)",
    );
    expect(query.sql).toContain("current_ranks AS");
    expect(query.sql).toContain(
      'ORDER BY "products"."sort_order" ASC, "products"."created_at" ASC, "products"."id" ASC',
    );
    expect(query.sql).toContain(
      'WHERE "products"."id" IN ($3::uuid, $4::uuid)',
    );
    expect(query.sql).toContain("mapping AS");
    expect(query.sql).toContain(
      "JOIN current_ranks c ON t.new_rank = c.old_rank",
    );
    expect(query.sql).toContain('UPDATE "products"');
    expect(query.sql).toContain(
      "SET sort_order = mapping.new_sort_order, updated_at = NOW()",
    );
    expect(query.sql).toContain('WHERE "products"."id" = mapping.id');
    expect(query.sql).toContain('RETURNING "products"."id" AS id');

    // Verify bound parameters
    expect(query.params).toEqual([id2, id1, id2, id1]);
  });
});
