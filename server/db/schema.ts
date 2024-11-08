import type { InferSelectModel } from 'drizzle-orm'
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const link = pgTable('links', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  longUrl: varchar({ length: 255 }).notNull(),
  code: varchar({ length: 255 }).notNull(),
  click: integer().notNull().default(0),
  createdAt: timestamp().defaultNow()
})

export type Link = InferSelectModel<typeof link>

export const stats = pgTable('stats', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  linkId: integer().references(() => link.id),
  createdAt: timestamp().defaultNow()
})

export type Stats = InferSelectModel<typeof stats>
