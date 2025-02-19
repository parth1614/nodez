import { pgTable, uuid, text, integer, doublePrecision, unique, timestamp, foreignKey, varchar, json } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const nodes = pgTable("nodes", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	type: text("type").notNull(),
	logo: text("logo").notNull(),
	slots: integer("slots").notNull(),
	price: doublePrecision("price").notNull(),
	documentationUrl: text("documentation_url").notNull(),
	rewards: doublePrecision("rewards").notNull(),
	currency: text("currency").notNull(),
});

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	walletAddress: text("wallet_address").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		usersWalletAddressUnique: unique("users_wallet_address_unique").on(table.walletAddress),
	}
});

export const usedOrderIds = pgTable("used_order_ids", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	email: varchar("email", { length: 255 }),
	tgUsername: varchar("tg_username", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		usedOrderIdsOrderIdOrdersIdFk: foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "used_order_ids_order_id_orders_id_fk"
		}).onDelete("cascade"),
		usedOrderIdsOrderIdUnique: unique("used_order_ids_order_id_unique").on(table.orderId),
	}
});

export const nodeForms = pgTable("node_forms", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	formData: json("form_data").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		nodeFormsOrderIdOrdersIdFk: foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "node_forms_order_id_orders_id_fk"
		}).onDelete("cascade"),
	}
});

export const orders = pgTable("orders", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	amount: doublePrecision("amount").notNull(),
	paymentStatus: text("payment_status").default('pending').notNull(),
	nodeId: uuid("node_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	orderId: text("order_id").notNull(),
	paymentId: text("payment_id"),
	quantity: integer("quantity").default(1).notNull(),
	expiryDate: timestamp("expiry_date", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		ordersNodeIdNodesIdFk: foreignKey({
			columns: [table.nodeId],
			foreignColumns: [nodes.id],
			name: "orders_node_id_nodes_id_fk"
		}).onDelete("cascade"),
		ordersUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_users_id_fk"
		}).onDelete("cascade"),
	}
});