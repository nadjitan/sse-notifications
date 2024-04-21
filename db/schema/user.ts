import { createId } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core"
import { appNotificationToUserTable } from "./app_notification"
import { InferQueryModel } from "../types"

export type User = typeof userTable.$inferSelect
export type UserWithNotifications = InferQueryModel<
  "userTable",
  undefined,
  { appNotificationToUser: { with: { appNotification: true } } }
>

export const userTable = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").unique(),
  password: text("password", { length: 24 }),
})

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
})

export const userTableRelations = relations(userTable, ({ many }) => ({
  appNotificationToUser: many(appNotificationToUserTable),
}))
