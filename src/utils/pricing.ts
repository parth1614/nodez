const basePrice = 21.99;

export const discounts = {
  "1 month": 0,
  "2 months": 1,
  "3 months": 2,
};

export function getBaseprice(node_name: string) {
  if (node_name === "Citrea") {
    return 21.99;
  }
  return basePrice;
}

export const calculatePrice = (plan: string, quantity: number) => {
  const months = parseInt(plan.split(" ")[0]!, 10);
  const discount = discounts[plan as keyof typeof discounts] || 0;
  return (basePrice - discount) * quantity * months;
};

export function calculatePriceWithNode(
  node_name: string,
  plan: string,
  quantity: number,
) {
  const months = parseInt(plan.split(" ")[0]!, 10);
  const discount = discounts[plan as keyof typeof discounts] || 0;
  const basePrice = getBaseprice(node_name);
  return (basePrice - discount) * quantity * months;
}
