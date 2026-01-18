// taxlator/src/pages/tax/VatResultPanel.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function formatNaira(value: unknown) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return "₦0.00";
	return `₦${n.toLocaleString("en-NG", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

type Props = {
	result: unknown;
	amount: number;
	isAuthenticated: boolean; // currently not used, but kept for parity with others
};

export default function VatResultPanel({ result }: Props) {
	const navigate = useNavigate();

	const r = useMemo(() => (result ?? {}) as Record<string, unknown>, [result]);

	// Prefer new backend fields; fall back if backend hasn’t been updated.
	const vatRate = Number(r.vatRate ?? 0);
	const vatAmount = Number(r.vatAmount ?? 0);

	const excludingVat =
		r.excludingVat != null
			? Number(r.excludingVat)
			: Number(r.transactionAmount ?? 0);

	const includingVat =
		r.includingVat != null ? Number(r.includingVat) : Number(r.result ?? 0);

	const ratePct = Number.isFinite(vatRate)
		? Math.round(vatRate * 1000) / 10
		: 0;

	return (
		<div className="bg-white rounded-2xl border shadow-soft overflow-hidden">
			{/* Header */}
			<div className="p-6 text-center border-b">
				<div className="text-sm text-slate-600">VAT Result</div>
				<div className="mt-2 text-3xl font-extrabold text-brand-800">
					{formatNaira(vatAmount)}
				</div>
				<div className="text-sm text-slate-600 mt-1">
					VAT Amount({ratePct}%)
				</div>
			</div>

			<div className="p-6">
				{/* Summary cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="rounded-2xl bg-slate-50 border p-4">
						<div className="text-xs text-slate-600">
							Transaction Amount( Excluding VAT)
						</div>
						<div className="mt-1 font-semibold">
							{formatNaira(excludingVat)}
						</div>
					</div>
					<div className="rounded-2xl bg-slate-50 border p-4">
						<div className="text-xs text-slate-600">
							Total Amount( Including VAT)
						</div>
						<div className="mt-1 font-semibold">
							{formatNaira(includingVat)}
						</div>
					</div>
				</div>

				{/* VAT row */}
				<div className="mt-5 rounded-2xl bg-slate-50 border px-4 py-4 flex items-center justify-between">
					<div className="text-sm font-semibold">VAT Amount( {ratePct}%)</div>
					<div className="text-sm font-semibold">{formatNaira(vatAmount)}</div>
				</div>

				{/* Action */}
				<button
					onClick={() => navigate("/calculate")}
					className="mt-6 w-full rounded bg-brand-800 text-white py-3 text-sm font-semibold hover:bg-brand-900"
				>
					Calculate Another Tax
				</button>
			</div>
		</div>
	);
}
