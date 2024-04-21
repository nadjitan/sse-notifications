import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
})
