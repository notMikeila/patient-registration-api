import { integer, pgTable, varchar } from "drizzle-orm/pg-core"

export const usersTable = pgTable("patients", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    phone: varchar({ length: 20 }).notNull().unique(),
    photo_id_path: varchar({ length: 255 }).notNull(),
})
