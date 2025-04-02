import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and Authentication schemas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  email: text("email"),
  phone: text("phone"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  email: true,
  phone: true,
  avatar: true,
});

// Inventory schemas
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  stock: integer("stock").notNull().default(0),
  minLevel: integer("min_level").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("normal"),
  unitType: text("unit_type").notNull().default("item"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  name: true,
  category: true,
  stock: true,
  minLevel: true,
  price: true,
  unitType: true,
});

export const inventoryActivities = pgTable("inventory_activities", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  action: text("action").notNull(),
  quantity: integer("quantity"),
  notes: text("notes"),
  performedBy: integer("performed_by").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertInventoryActivitySchema = createInsertSchema(inventoryActivities).pick({
  itemId: true,
  action: true,
  quantity: true,
  notes: true,
  performedBy: true,
});

// POS schemas
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  ingredients: json("ingredients").default([]),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  name: true,
  category: true,
  price: true,
  description: true,
  ingredients: true,
  isActive: true,
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  tableNumber: text("table_number"),
  customerName: text("customer_name"),
  status: text("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }).notNull(),
  grandTotal: numeric("grand_total", { precision: 10, scale: 2 }).notNull(),
  bartenderId: integer("bartender_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  tableNumber: true,
  customerName: true,
  status: true,
  totalAmount: true,
  tax: true,
  grandTotal: true,
  bartenderId: true,
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  menuItemId: true,
  name: true,
  price: true,
  quantity: true,
});

// Staff schemas
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull().default("active"),
  email: text("email"),
  phone: text("phone"),
  emergencyContact: text("emergency_contact"),
  startDate: timestamp("start_date").defaultNow(),
  employeeId: text("employee_id"),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
});

export const insertStaffSchema = createInsertSchema(staff).pick({
  name: true,
  role: true,
  status: true,
  email: true,
  phone: true,
  emergencyContact: true,
  startDate: true,
  employeeId: true,
  hourlyRate: true,
});

export const staffShifts = pgTable("staff_shifts", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").notNull(),
  day: text("day").notNull(),
  shift: text("shift").notNull(),
  weekOf: timestamp("week_of"),
});

export const insertStaffShiftSchema = createInsertSchema(staffShifts).pick({
  staffId: true,
  day: true,
  shift: true,
  weekOf: true,
});

export const staffPerformance = pgTable("staff_performance", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").notNull(),
  date: timestamp("date").defaultNow(),
  salesAmount: numeric("sales_amount", { precision: 10, scale: 2 }),
  tipsEarned: numeric("tips_earned", { precision: 10, scale: 2 }),
  customerRating: numeric("customer_rating", { precision: 3, scale: 1 }),
  incidents: integer("incidents").default(0),
  hoursWorked: numeric("hours_worked", { precision: 5, scale: 2 }),
});

export const insertStaffPerformanceSchema = createInsertSchema(staffPerformance).pick({
  staffId: true,
  date: true,
  salesAmount: true,
  tipsEarned: true,
  customerRating: true,
  incidents: true,
  hoursWorked: true,
});

// Events schemas
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  performer: text("performer"),
  eventType: text("event_type"),
  rsvpCount: integer("rsvp_count").default(0),
  status: text("status").notNull().default("upcoming"),
});

export const insertEventSchema = createInsertSchema(events).pick({
  name: true,
  description: true,
  date: true,
  startTime: true,
  endTime: true,
  performer: true,
  eventType: true,
  rsvpCount: true,
  status: true,
});

// Customer schemas
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dob: timestamp("dob"),
  vipStatus: text("vip_status").default("regular"),
  loyaltyPoints: integer("loyalty_points").default(0),
  lastVisit: timestamp("last_visit"),
  notes: text("notes"),
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  name: true,
  email: true,
  phone: true,
  dob: true,
  vipStatus: true,
  loyaltyPoints: true,
  lastVisit: true,
  notes: true,
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id"),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  partySize: integer("party_size").notNull(),
  tableNumber: text("table_number"),
  status: text("status").notNull().default("confirmed"),
  notes: text("notes"),
});

export const insertReservationSchema = createInsertSchema(reservations).pick({
  customerId: true,
  date: true,
  time: true,
  partySize: true,
  tableNumber: true,
  status: true,
  notes: true,
});

// Financial schemas
export const financialTransactions = pgTable("financial_transactions", {
  id: serial("id").primaryKey(),
  transactionType: text("transaction_type").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow(),
  category: text("category"),
  paymentMethod: text("payment_method"),
  relatedOrderId: integer("related_order_id"),
});

export const insertFinancialTransactionSchema = createInsertSchema(financialTransactions).pick({
  transactionType: true,
  amount: true,
  description: true,
  date: true,
  category: true,
  paymentMethod: true,
  relatedOrderId: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

export type InventoryActivity = typeof inventoryActivities.$inferSelect;
export type InsertInventoryActivity = z.infer<typeof insertInventoryActivitySchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;

export type StaffShift = typeof staffShifts.$inferSelect;
export type InsertStaffShift = z.infer<typeof insertStaffShiftSchema>;

export type StaffPerformance = typeof staffPerformance.$inferSelect;
export type InsertStaffPerformance = z.infer<typeof insertStaffPerformanceSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type InsertFinancialTransaction = z.infer<typeof insertFinancialTransactionSchema>;
