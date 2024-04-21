import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./sqlite.db",
  },
})
