// src/utils/formatCurrency.ts
export function formatCurrency(amount: number): string {
	if (!Number.isFinite(amount)) return "₦0";

	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0,
	}).format(amount);
}
