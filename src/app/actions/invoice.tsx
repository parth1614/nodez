// "use server";

// import { PaymentStatus } from "@/db/schema";
// import axios from "axios";
// import { NextApiRequest, NextApiResponse } from 'next';

// // export const getInvoice = async ({
// //     order_id,
// //     node_id,
// //     plan,
// //     price,
// //     userId,
// //     quantity,
// //     duration,
// //   }: {
// //     order_id: string;
// //     node_id: string;
// //     plan: string;
// //     price: number;
// //     userId: string | null;
// //     quantity: number;
// //     duration: string;
// //   }) => {
// //     try {
// //       await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/init`, {
// //         payment_amount: price,
// //         payment_status: "pending",
// //         user_id: userId,
// //         node_id,
// //         order_id,
// //         quantity,
// //         duration,
// //       });
  
// //       const { data } = await axios.post(
// //         `${process.env.NOWPAYMENTS_BASE_URL}/invoice`,
// //         {
// //           price_amount: price,
// //           price_currency: "usdc",
// //           order_description: `${plan}-${node_id}`,
// //           ipn_callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/callback`,
// //           success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments?success=true&orderId=${order_id}&amount=${price}&nodeId=${node_id}`,
// //           cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments?success=false&orderId=${order_id}&amount=${price}&nodeId=${node_id}`,
// //           order_id,
// //         },
// //         {
// //           headers: {
// //             "x-api-key": process.env.NOWPAYMENTS_API_KEY,
// //           },
// //         },
// //       );
// //       return data;
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// interface CopperXInvoiceResponse {
//   id: string;
//   url: string;
//   status: string;
//   expiresAt: string;
//   amountTotal: string;
//   currency: string;
//   paymentStatus: string;
// }

// interface Metadata {
//   order_id: string;
//   node_id: string;
//   plan: string;
//   quantity: number;
//   duration: string;
// }

// interface InvoiceData {
//   id: string;
//   amount: number;
//   metadata: Metadata;
// }

// type PaymentWebhookBody = {
//   actually_paid: number;
//   actually_paid_at_fiat: number;
//   fee: {
//     currency: string;
//     depositFee: number;
//     serviceFee: number;
//     withdrawalFee: number;
//   };
//   invoice_id: number;
//   order_id: string;
//   order_description: string;
//   outcome_amount: number;
//   outcome_currency: string;
//   parent_payment_id: number | null;
//   pay_address: string;
//   pay_amount: number;
//   pay_currency: string;
//   payin_extra_id: number | null;
//   payment_extra_ids: number[] | null;
//   payment_id: number;
//   payment_status: PaymentStatus;
//   purchase_id: string;
//   updated_at: number;
//   price_amount: number;
//   price_currency: string;
// };

// export const getInvoice = async ({
//   order_id,
//   node_id,
//   plan,
//   price,
//   userId,
//   quantity,
//   duration,
// }: {
//   order_id: string;
//   node_id: string;
//   plan: string;
//   price: number;
//   userId: string | null;
//   quantity: number;
//   duration: string;
// }) => {
//   console.log(order_id, node_id, plan, price, userId, quantity, duration);
//   try {
//     await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/init`, {
//       payment_amount: price,
//       payment_status: "pending",
//       user_id: userId,
//       node_id,
//       order_id,
//       quantity,
//       duration,
//     });
   
//     console.log("Creating invoice...");

//     const { data } = await axios.post<CopperXInvoiceResponse>(
//       // `${process.env.COPPERX_API_URL}/v1/checkout/sessions`,
//       "https://api.copperx.dev/api/v1/checkout/sessions",
//       {
//         successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payments?success=true&orderId=${order_id}&amount=${price}&nodeId=${node_id}`,
//         cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payments?success=false&orderId=${order_id}&amount=${price}&nodeId=${node_id}`,
//         ipnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/callback`,
//         lineItems: {
//           data: [
//             {
//               priceData: {
//                 currency: "usdt",
//                 unitAmount: price * 1000000,
//                 productData: {
//                   name: plan,
//                   description: `${plan}-${node_id}`,
//                 }
//               },
//             }
//           ]
//         },
//         customerId: userId,
//         paymentSetting: {
//           allowSwap: false
//         },
//         metadata: {
//           node_id,
//           plan,
//           quantity,
//           duration,
//           order_id
//         },
//       },
//       {
//         headers: {
//           "authorization": `Bearer ${process.env.COPPERX_API_KEY}`,
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//       },
//     );

//     console.log("Invoice ID:", data.id);
//     console.log("Checkout URL:", data.url);

//     return {
//       invoice_url: data.url,
//       invoiceId: data.id,
//       status: data.status,
//       expiresAt: data.expiresAt,
//       amountTotal: data.amountTotal,
//       currency: data.currency,
//       paymentStatus: data.paymentStatus
//     };
//   } catch (error) {
//     console.error("Error creating invoice:", error);
//     throw error;
//   }
// };

// export const handleWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     const webhookData = req.body;

//     if (!verifyWebhookSignature(req)) {
//       return res.status(401).json({ error: 'Invalid signature' });
//     }

//     switch (webhookData.event) {
//       case 'invoice.paid':
//         await handleInvoicePaid(webhookData.data);
//         break;
//       case 'invoice.payment_failed':
//         await handleInvoicePaymentFailed(webhookData.data);
//         break;
//       default:
//         console.log(`Unhandled webhook event: ${webhookData.event}`);
//     }

//     res.status(200).json({ received: true });
//   } catch (error) {
//     console.error('Error handling webhook:', error);
//     res.status(400).json({ error: 'Webhook error' });
//   }
// };

// async function handleInvoicePaid(data: InvoiceData) {
//   const paymentBody = mapWebhookToPaymentBody(data);

//   await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/update`, {
//     order_id: paymentBody.order_id,
//     payment_status: 'completed',
//     amount: paymentBody.actually_paid,
//     payment_id: paymentBody.payment_id,
//     currency: paymentBody.outcome_currency
//   });
// }

// async function handleInvoicePaymentFailed(data: InvoiceData) {
//   const paymentBody = mapWebhookToPaymentBody(data);

//   await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/update`, {
//     order_id: paymentBody.order_id,
//     payment_status: 'failed',
//   });
// }

// // Helper function to map webhook data to PaymentWebhookBody
// function mapWebhookToPaymentBody({webhook}: any): PaymentWebhookBody {
//   const dataObject = webhook;

//   return {
//     actually_paid: Number(dataObject.amountTotal) / 1000000,
//     actually_paid_at_fiat: new Date(dataObject.updatedAt).getTime(),
//     fee: {
//       currency: dataObject.currency,
//       depositFee: Number(dataObject.amountFee) / 1000000,
//       serviceFee: 0,
//       withdrawalFee: 0
//     },
//     invoice_id: (dataObject.invoiceId as number),
//     order_id: dataObject.metadata.order_id,
//     order_description: dataObject.lineItems.data[0]?.price.product.name || '',
//     outcome_amount: Number(dataObject.amountTotal) / 1000000,
//     outcome_currency: dataObject.currency,
//     parent_payment_id: null,
//     pay_address: dataObject.addresses[0]?.paymentAddress || '',
//     pay_amount: Number(dataObject.amountTotal) / 1000000,
//     pay_currency: dataObject.currency,
//     payin_extra_id: null,
//     payment_extra_ids: null,
//     payment_id: Number(dataObject.paymentIntent.id),
//     payment_status: dataObject.paymentStatus,
//     purchase_id: dataObject.id,
//     updated_at: new Date(dataObject.updatedAt).getTime(),
//     price_amount: Number(dataObject.amountSubtotal) / 1000000,
//     price_currency: dataObject.currency
//   };
// }

// const verifyWebhookSignature = (req: NextApiRequest) => {
//   return true;
// }