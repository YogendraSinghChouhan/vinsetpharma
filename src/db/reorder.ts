import { type SQL, sql } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class ReorderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReorderValidationError";
  }
}

export interface BuildReorderStatementOptions<
  TTable extends PgTable & { id: PgColumn },
> {
  table: TTable;
  ids: readonly string[];
  refreshUpdatedAt?: boolean;
}

/**
 * Pure helper that builds a single atomic UPDATE statement with CASE for reordering table rows.
 * Used for full-list reordering (e.g., categories and media).
 *
 * Rules:
 * - Both sides of each CASE branch are explicitly cast: id::uuid, position::integer.
 * - All values are passed as bound parameters through the Drizzle sql template (never string concatenation).
 * - The WHERE id IN clause is built with sql.join and explicit ::uuid casts.
 * - updatedAt = NOW() is refreshed only when refreshUpdatedAt is true.
 * - Validates against empty and duplicate ID lists before statement generation.
 */
export function buildReorderStatement<
  TTable extends PgTable & { id: PgColumn },
>({
  table,
  ids,
  refreshUpdatedAt = false,
}: BuildReorderStatementOptions<TTable>): SQL {
  if (ids.length === 0) {
    throw new ReorderValidationError("Reorder list cannot be empty.");
  }

  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      throw new ReorderValidationError(
        `Reorder list contains duplicate ID: ${id}`,
      );
    }
    seen.add(id);
  }

  const cases = ids.map(
    (id, index) => sql`WHEN ${id}::uuid THEN ${index + 1}::integer`,
  );
  const idList = ids.map((id) => sql`${id}::uuid`);

  const setClause = refreshUpdatedAt
    ? sql`sort_order = CASE ${table.id} ${sql.join(cases, sql` `)} END, updated_at = NOW()`
    : sql`sort_order = CASE ${table.id} ${sql.join(cases, sql` `)} END`;

  return sql`UPDATE ${table} SET ${setClause} WHERE ${table.id} IN (${sql.join(idList, sql`, `)})`;
}

export interface BuildSubsetReorderStatementOptions<
  TTable extends PgTable & {
    id: PgColumn;
    sortOrder: PgColumn;
    createdAt: PgColumn;
  },
> {
  table: TTable;
  ids: readonly string[];
  refreshUpdatedAt?: boolean;
  knownIds?: readonly string[];
}

/**
 * Pure helper that builds a single atomic UPDATE statement with CTE/unnest for reordering a subset of table rows (e.g. a single page).
 *
 * Rules:
 * - Reassigns the exact set of sort_order integers already held by these rows, re-sorted according to the provided ID order.
 * - Rows outside this subset (e.g. on other pages) are completely untouched.
 * - Rejects empty list, lists shorter than 2 items, duplicates, malformed UUIDs, and unknown IDs (when knownIds is provided).
 * - Uses explicit casts (::uuid, ::integer) and bound parameters only.
 * - Atomically updates sort_order (and optionally updated_at = NOW()) and returns updated IDs.
 */
export function buildSubsetReorderStatement<
  TTable extends PgTable & {
    id: PgColumn;
    sortOrder: PgColumn;
    createdAt: PgColumn;
  },
>({
  table,
  ids,
  refreshUpdatedAt = true,
  knownIds,
}: BuildSubsetReorderStatementOptions<TTable>): SQL {
  if (ids.length === 0) {
    throw new ReorderValidationError("Reorder list cannot be empty.");
  }

  if (ids.length < 2) {
    throw new ReorderValidationError(
      "Reorder list must contain at least 2 items to reorder.",
    );
  }

  const knownSet = knownIds ? new Set(knownIds) : null;
  const seen = new Set<string>();

  for (const id of ids) {
    if (!UUID_REGEX.test(id)) {
      throw new ReorderValidationError(
        `Reorder list contains invalid UUID: ${id}`,
      );
    }
    if (seen.has(id)) {
      throw new ReorderValidationError(
        `Reorder list contains duplicate ID: ${id}`,
      );
    }
    if (knownSet && !knownSet.has(id)) {
      throw new ReorderValidationError(
        `Reorder list contains unknown ID: ${id}`,
      );
    }
    seen.add(id);
  }

  const targetIdCasts = ids.map((id) => sql`${id}::uuid`);
  const whereIdCasts = ids.map((id) => sql`${id}::uuid`);

  const setClause = refreshUpdatedAt
    ? sql`sort_order = mapping.new_sort_order, updated_at = NOW()`
    : sql`sort_order = mapping.new_sort_order`;

  return sql`WITH target_order AS (
  SELECT id, pos::integer AS new_rank
  FROM unnest(ARRAY[${sql.join(targetIdCasts, sql`, `)}]) WITH ORDINALITY AS t(id, pos)
),
current_ranks AS (
  SELECT
    ${table.id} AS id,
    ${table.sortOrder} AS sort_order,
    ROW_NUMBER() OVER (
      ORDER BY ${table.sortOrder} ASC, ${table.createdAt} ASC, ${table.id} ASC
    )::integer AS old_rank
  FROM ${table}
  WHERE ${table.id} IN (${sql.join(whereIdCasts, sql`, `)})
),
mapping AS (
  SELECT
    t.id,
    c.sort_order AS new_sort_order
  FROM target_order t
  JOIN current_ranks c ON t.new_rank = c.old_rank
)
UPDATE ${table}
SET ${setClause}
FROM mapping
WHERE ${table.id} = mapping.id
RETURNING ${table.id} AS id`;
}
