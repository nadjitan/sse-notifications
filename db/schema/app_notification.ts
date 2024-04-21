import { relations, sql } from "drizzle-orm"
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { userTable } from "."

export const appNotificationTypeEnum = ["success", "failed"] as const
export type AppNotificationType = (typeof appNotificationTypeEnum)[number]

export const appNotificationTable = sqliteTable("app_notification", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  user_id: text("user_id").notNull(),
  type: text("type", { enum: appNotificationTypeEnum }).notNull(),
  resource_id: text("type").notNull(),
  createdAt: text("created_at")
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull(),
})
export const appNotificationTableRelations = relations(
  appNotificationTable,
  ({ many }) => ({
    appNotificationsToUsers: many(appNotificationToUserTable),
  })
)

export const appNotificationToUserTable = sqliteTable(
  "app_notification_to_user",
  {
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
    appNotificationId: text("app_notification_id")
      .notNull()
      .references(() => appNotificationTable.id),
    viewed: integer("viewed", { mode: "boolean" }).default(false),
  },
  t => ({
    pk: primaryKey({ columns: [t.userId, t.appNotificationId] }),
  })
)
export const appNotificationToUserTableRelations = relations(
  appNotificationToUserTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [appNotificationToUserTable.userId],
      references: [userTable.id],
    }),
    appNotification: one(appNotificationTable, {
      fields: [appNotificationToUserTable.appNotificationId],
      references: [appNotificationTable.id],
    }),
  })
)
