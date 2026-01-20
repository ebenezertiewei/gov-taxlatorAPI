// src/pages/tax/PayePitResultPanel.tsx
import type { PayeResult } from "../../api/types";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = {
	result: PayeResult;
};

export default function PayePitResultPanel({ result }: Props) {
	/**
	 * Backend responses are inconsistent, so we safely
	 * narrow possible numeric fields WITHOUT using `any`
	 */
	const taxPayable =
		("taxPayable" in result && typeof result.taxPayable === "number"
			? result.taxPayable
			: undefined) ??
		("totalTax" in result && typeof result.totalTax === "number"
			? result.totalTax
			: undefined) ??
		("tax" in result && typeof result.tax === "number" ? result.tax : 0);

	return (
		<div className="space-y-4">
			<div className="rounded-xl border bg-white p-4">
				<div className="text-xs text-slate-500">Taxable Income</div>
				<div className="text-lg font-semibold">
					{formatCurrency(result.taxableIncome)}
				</div>
			</div>

			<div className="rounded-xl border bg-brand-50 p-4">
				<div className="text-xs text-slate-600">PAYE Tax Payable</div>
				<div className="text-2xl font-bold text-brand-700">
					{formatCurrency(taxPayable)}
				</div>
			</div>
		</div>
	);
}
