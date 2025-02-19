import {
  doublePrecision,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export enum PaymentStatus {
  PENDING = 'pending',
  FINISHED = 'finished',
  FAILED = 'failed',
}

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletAddress: text('wallet_address').unique().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
})

export const nodes = pgTable('nodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  logo: text('logo').notNull(),
  docs_url: text('documentation_url').notNull(),
  slots: integer('slots').notNull(),
  price: doublePrecision('price').notNull(),
  rewards: doublePrecision('rewards'),
  currency: text('currency'),
})

export const completed_orders = pgTable('completed_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  wallet_address: text('wallet_address').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  logo: text('logo').notNull(),
  slots: integer('slots').notNull(),
  price: doublePrecision('price').notNull(),
  documentation_url: text('documentation_url').notNull(),
  rewards: doublePrecision('rewards'),
  currency: text('currency'),
  user_id: uuid('user_id').notNull(),
  amount: doublePrecision('amount').notNull(),
  quantity: integer('quantity').notNull(),
  expiry_date: timestamp('expiry_date'),
  payment_status: text('payment_status').notNull(),
  node_id: uuid('node_id').notNull(),
  order_id: uuid('order_id'),
  payment_id: text('payment_id'),
})

// orders table is deprecated use completed_orders instead, 
// the migration is ongoing and user have to manually migrate from active nodez banner dialog, 
// LLM dont use this table for anything use completed orders instead for all your validations and future purchases
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  amount: doublePrecision('amount').notNull(),
  quantity: integer('quantity').notNull().default(1),
  expiryDate: timestamp('expiry_date').defaultNow(),
  payment_status: text('payment_status', {
    enum: Object.values(PaymentStatus) as [string, ...string[]],
  })
    .notNull()
    .default(PaymentStatus.PENDING),
  nodeId: uuid('node_id')
    .notNull()
    .references(() => nodes.id, {
      onDelete: 'cascade',
    }),
  orderId: text('order_id').notNull(),
  paymentId: text('payment_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
})

export const nodeForms = pgTable('node_forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull(),
  // .references(() => orders.id, {
  //   onDelete: 'cascade',
  // }),
  formData: json('form_data').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const usedOrderIds = pgTable('used_order_ids', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .unique()
    .references(() => orders.id, {
      onDelete: 'cascade',
    }),
  email: varchar('email', { length: 255 }),
  tgUsername: varchar('tg_username', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const claimed_rewards = pgTable('claimed_rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  transaction_hash: text('transaction_hash').notNull(),
  wallet_address: text('wallet_address').notNull(),
  user_id: uuid('user_id').notNull(),
  node_id: uuid('node_id')
    .notNull()
    .references(() => nodes.id, {
      onDelete: 'cascade',
    }),
  order_id: uuid('order_id').notNull(),
  token_amount: doublePrecision('token_amount').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect

export type InsertOrder = typeof orders.$inferInsert
export type SelectOrder = typeof orders.$inferSelect

export type InsertNode = typeof nodes.$inferInsert
export type SelectNode = typeof nodes.$inferSelect

export type InsertNodeForm = typeof nodeForms.$inferInsert
export type SelectNodeForm = typeof nodeForms.$inferSelect

export type InsertUsedOrderId = typeof usedOrderIds.$inferInsert
export type SelectUsedOrderId = typeof usedOrderIds.$inferSelect

export type InsertClaimedReward = typeof claimed_rewards.$inferInsert
export type SelectClaimedReward = typeof claimed_rewards.$inferSelect

export type SelectCompletedOrder = typeof completed_orders.$inferSelect
export type InsertCompletedOrder = typeof completed_orders.$inferInsert
