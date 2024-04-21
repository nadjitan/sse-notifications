import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm"
import type * as schema from "./schema/index"

type Schema = typeof schema
type TablesWithRelations = ExtractTablesWithRelations<Schema>
// see: https://github.com/drizzle-team/drizzle-orm/issues/695#issuecomment-1973603420
export type IncludeRelation<TableName extends keyof TablesWithRelations> =
  DBQueryConfig<
    "one" | "many",
    boolean,
    TablesWithRelations,
    TablesWithRelations[TableName]
  >["with"]

export type IncludeColumns<TableName extends keyof TablesWithRelations> =
  DBQueryConfig<
    "one" | "many",
    boolean,
    TablesWithRelations,
    TablesWithRelations[TableName]
  >["columns"]

export type InferQueryModel<
  TableName extends keyof TablesWithRelations,
  Columns extends IncludeColumns<TableName> | undefined = undefined,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TablesWithRelations,
  TablesWithRelations[TableName],
  {
    columns: Columns
    with: With
  }
>
