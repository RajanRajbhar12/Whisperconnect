import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the available moods
export const MoodEnum = z.enum(["happy", "sad", "anxious", "tired", "lonely"]);
export type Mood = z.infer<typeof MoodEnum>;

// Define the user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the active user schema (for matching)
export const activeUsers = pgTable("active_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  socketId: text("socket_id").notNull().unique(),
  mood: text("mood").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isMatched: boolean("is_matched").default(false),
});

export const insertActiveUserSchema = createInsertSchema(activeUsers).pick({
  socketId: true,
  mood: true,
  userId: true,
});

export type InsertActiveUser = z.infer<typeof insertActiveUserSchema>;
export type ActiveUser = typeof activeUsers.$inferSelect;

// Define the match schema
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  user1Id: text("user1_id").notNull(), // socketId of first user
  user2Id: text("user2_id").notNull(), // socketId of second user
  roomName: text("room_name").notNull(),
  mood: text("mood").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const insertMatchSchema = createInsertSchema(matches).pick({
  user1Id: true,
  user2Id: true,
  roomName: true, 
  mood: true,
});

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
