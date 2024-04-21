import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core"

export const userTable = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("text_modifiers"),
  password: text("text_modifiers"),
})
