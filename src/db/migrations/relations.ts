import { relations } from "drizzle-orm/relations";
import { orders, usedOrderIds, nodeForms, nodes, users } from "./schema";

export const usedOrderIdsRelations = relations(usedOrderIds, ({one}) => ({
	order: one(orders, {
		fields: [usedOrderIds.orderId],
		references: [orders.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	usedOrderIds: many(usedOrderIds),
	nodeForms: many(nodeForms),
	node: one(nodes, {
		fields: [orders.nodeId],
		references: [nodes.id]
	}),
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
}));

export const nodeFormsRelations = relations(nodeForms, ({one}) => ({
	order: one(orders, {
		fields: [nodeForms.orderId],
		references: [orders.id]
	}),
}));

export const nodesRelations = relations(nodes, ({many}) => ({
	orders: many(orders),
}));

export const usersRelations = relations(users, ({many}) => ({
	orders: many(orders),
}));