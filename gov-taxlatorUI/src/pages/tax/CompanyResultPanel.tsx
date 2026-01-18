// taxlator/src/pages/tax/CompanyResultPanel.tsx
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

function formatNaira(value: unknown) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return "₦0.00";
	return `₦${n.toLocaleString("en-NG", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

function toFiniteNumber(v: unknown, fallback = 0) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}

type Props = {
	result: unknown;
	revenue: number;
	expenses: number;
	companySize?: string;
	isAuthenticated: boolean;
	prefillEmail?: string;
};

function companySizeLabel(size?: string) {
	if (size === "SMALL") return "Small Company";
	if (size === "MEDIUM") return "Medium Company";
	if (size === "LARGE") return "Large Company";
	return "—";
}

export default function CompanyResultPanel({
	result,
	revenue,
	expenses,
	companySize,
	isAuthenticated,
	prefillEmail = "",
}: Props) {
	const navigate = useNavigate();

	const r = useMemo(() => (result ?? {}) as Record<string, unknown>, [result]);

	// ✅ CIT backend returns: taxPayable, taxRate, profit, companySize, revenue, expenses
	const taxDue = toFiniteNumber(
		r.taxPayable ?? r.taxAmount ?? r.totalTax ?? r.totalAnnualTax ?? r.tax ?? 0
	);

	const profit = toFiniteNumber(
		r.profit ??
			r.taxableProfit ??
			r.taxableIncome ??
			Math.max(0, revenue - expenses)
	);

	const profitAfterTax = toFiniteNumber(
		r.profitAfterTax ?? r.netProfit ?? Math.max(0, profit - taxDue)
	);

	const effectiveCompanySize =
		(typeof r.companySize === "string"
			? (r.companySize as string)
			: undefined) || companySize;

	const ratePct = useMemo(() => {
		const rate = r.taxRate ?? r.rate ?? r.citRate;
		if (typeof rate === "number" && Number.isFinite(rate)) {
			return `${Math.round(rate * 100)}%`;
		}
		if (effectiveCompanySize === "SMALL") return "0%";
		if (effectiveCompanySize === "MEDIUM") return "20%";
		if (effectiveCompanySize === "LARGE") return "30%";
		return "—";
	}, [r, effectiveCompanySize]);

	const showExpenses = Number.isFinite(expenses) && expenses > 0;

	return (
		<div className="bg-white rounded-2xl border shadow-soft overflow-hidden">
			{/* Header */}
			<div className="p-6 text-center border-b">
				<div className="text-sm text-slate-600">Company Income Tax Result</div>

				{/* ✅ Reduced font-size (was text-4xl) */}
				<div className="mt-2 text-3xl md:text-4xl font-extrabold text-brand-800">
					{formatNaira(taxDue)}
				</div>

				<div className="text-sm text-slate-600 mt-1">Total Tax Due</div>

				{/* ✅ Company size shown */}
				<div className="mt-2 text-xs text-slate-600">
					Company Size:{" "}
					<span className="font-semibold text-slate-800">
						{companySizeLabel(effectiveCompanySize)}
					</span>
				</div>
			</div>

			<div className="p-6">
				{/* Summary cards */}
				<div className="grid grid-cols-2 gap-4">
					<div className="rounded-2xl bg-slate-50 border p-4">
						<div className="text-xs text-slate-600">Tax Amount</div>
						<div className="mt-1 font-semibold">{formatNaira(taxDue)}</div>
					</div>
					<div className="rounded-2xl bg-slate-50 border p-4">
						<div className="text-xs text-slate-600">Profit After Tax</div>
						<div className="mt-1 font-semibold">
							{formatNaira(profitAfterTax)}
						</div>
					</div>
				</div>

				{/* ✅ Show business expenses only when provided */}
				{showExpenses && (
					<div className="mt-5 rounded-2xl bg-slate-50 border px-4 py-4 flex items-center justify-between">
						<div className="text-sm font-semibold text-slate-800">
							Business Expenses
						</div>
						<div className="text-sm font-semibold text-slate-900">
							-{formatNaira(expenses)}
						</div>
					</div>
				)}

				{/* Rate row */}
				<div className="mt-5 rounded-2xl bg-slate-50 border px-4 py-4 flex items-center justify-between">
					<div className="text-sm font-semibold text-slate-800">
						Company Income Tax rate ({ratePct})
					</div>
					<div className="text-sm font-semibold text-slate-900">
						{formatNaira(taxDue)}
					</div>
				</div>

				<button
					onClick={() => navigate("/calculate")}
					className="mt-6 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900"
				>
					Calculate Another Tax
				</button>

				{/* Guest CTA */}
				{!isAuthenticated && (
					<div className="mt-6 rounded-2xl border bg-slate-200/60 p-5">
						<div className="text-sm font-semibold text-slate-900">
							Save Your Calculations
						</div>
						<div className="text-xs text-slate-600 mt-1">
							Create a free account to save your calculations and track history.
						</div>

						<div className="mt-4 flex gap-3">
							<input
								defaultValue={prefillEmail}
								className="flex-1 w-full rounded border px-3 py-2 text-sm bg-white"
								placeholder="Enter your email"
								type="email"
							/>
							<Link
								to="/signup"
								className="px-6 rounded bg-brand-800 text-white text-sm font-semibold grid place-items-center hover:bg-brand-900"
							>
								Sign Up
							</Link>
						</div>

						<Link
							to="/calculate"
							className="inline-block mt-3 text-xs text-slate-700 hover:text-brand-800"
						>
							Continue as guest
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
