import { type SQL, sql } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

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
