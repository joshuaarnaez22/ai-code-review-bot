import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core"
import { customType } from "drizzle-orm/pg-core"

// pgvector custom type (requires `create extension vector` in Supabase)
const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(1536)"
  },
  toDriver(value: number[]) {
    return JSON.stringify(value)
  },
  fromDriver(value: unknown) {
    if (typeof value === "string") return JSON.parse(value) as number[]
    return value as number[]
  },
})

// Enums
export const tierEnum = pgEnum("tier", ["free", "pro", "team"])
export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "completed",
  "failed",
])
export const commentTypeEnum = pgEnum("comment_type", [
  "security",
  "test",
  "style",
  "performance",
])
export const severityEnum = pgEnum("severity", ["critical", "warning", "info"])

// Users (synced from Clerk on first sign-in)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  tier: tierEnum("tier").notNull().default("free"),
  reviewsUsedThisMonth: integer("reviews_used_this_month").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// GitHub App installations
export const installations = pgTable("installations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  installationId: integer("installation_id").notNull().unique(),
  accountLogin: text("account_login").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// PR reviews
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  installationId: uuid("installation_id")
    .notNull()
    .references(() => installations.id, { onDelete: "cascade" }),
  repo: text("repo").notNull(),
  prNumber: integer("pr_number").notNull(),
  prTitle: text("pr_title").notNull(),
  status: reviewStatusEnum("status").notNull().default("pending"),
  commentsCount: integer("comments_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Inline review comments
export const reviewComments = pgTable("review_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id")
    .notNull()
    .references(() => reviews.id, { onDelete: "cascade" }),
  filePath: text("file_path").notNull(),
  lineNumber: integer("line_number").notNull(),
  type: commentTypeEnum("type").notNull(),
  severity: severityEnum("severity").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// RAG document embeddings
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  installationId: uuid("installation_id")
    .notNull()
    .references(() => installations.id, { onDelete: "cascade" }),
  repo: text("repo").notNull(),
  filePath: text("file_path").notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Installation = typeof installations.$inferSelect
export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
export type ReviewComment = typeof reviewComments.$inferSelect
export type NewReviewComment = typeof reviewComments.$inferInsert
export type Document = typeof documents.$inferSelect
