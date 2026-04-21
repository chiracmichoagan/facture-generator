export const calculateInvoiceTotals = (invoiceData) => {
  const subtotal = invoiceData.items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) * parseFloat(item.price));
  }, 0);

  const discount = parseFloat(invoiceData.discount) || 0;
  const taxRate = parseFloat(invoiceData.taxRate) || 0;

  const discountedSubtotal = subtotal - discount;
  const tax = (discountedSubtotal * taxRate) / 100;
  const total = discountedSubtotal + tax;

  return {
    subtotal: isNaN(subtotal) ? 0 : subtotal,
    tax: isNaN(tax) ? 0 : tax,
    total: isNaN(total) ? 0 : Math.max(0, total)
  };
};