import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

config({ path: ".env.local" })

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Uses direct connection (port 5432) — NOT the pooler
    // Get this from Supabase → Settings → Database → Connection string → URI
    url: process.env.DATABASE_DIRECT_URL!,
  },
})
