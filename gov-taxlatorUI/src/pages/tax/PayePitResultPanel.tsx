// taxlator/src/pages/tax/PayePitResultPanel.tsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
	grossIncome: number;
	isAuthenticated: boolean;
	prefillEmail?: string;
};

export default function PayePitResultPanel({
	result,
	grossIncome,
	isAuthenticated,
	prefillEmail = "",
}: Props) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState(prefillEmail);

	// Be defensive: backend result shape may vary.
	const r = useMemo(() => (result ?? {}) as Record<string, unknown>, [result]);

	const taxDue =
		r.totalTax ?? r.taxAmount ?? r.annualTax ?? r.totalAnnualTax ?? r.tax ?? 0;

	const netIncome =
		r.netIncome ??
		r.netAnnualIncome ??
		(typeof taxDue === "number" ? grossIncome - taxDue : grossIncome);

	const deductions = useMemo(() => {
		// Common patterns you might return from service
		const d =
			(r.deductions as Record<string, unknown>) ||
			(r.breakdown as Record<string, unknown>) ||
			{};
		return d;
	}, [r]);

	const taxBands = (r.taxBands || r.bands || r.progressiveBands) as
		| Array<Record<string, unknown>>
		| undefined;

	const computedBreakdown = (r.computation || r.steps || r.taxBreakdown) as
		| Array<Record<string, unknown>>
		| undefined;

	return (
		<div className="bg-white rounded-2xl border shadow-soft overflow-hidden">
			{/* Header */}
			<div className="p-6 text-center border-b">
				<div className="text-sm text-slate-600">
					Salaried (PAYE/ PIT) Result
				</div>
				<div className="mt-2 text-3xl font-extrabold text-brand-800">
					{formatNaira(taxDue)}
				</div>
				<div className="text-sm text-slate-600 mt-1">Total Tax Due</div>
			</div>

			{/* Summary cards */}
			<div className="p-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="rounded-2xl bg-slate-50 border p-4">
						<div className="text-xs text-slate-600">Gross Income</div>
						<div className="mt-1 font-semibold">{formatNaira(grossIncome)}</div>
					</div>
					<div className="rounded-2xl bg-slate-50 border p-4">
						<div className="text-xs text-slate-600">Net Income</div>
						<div className="mt-1 font-semibold">{formatNaira(netIncome)}</div>
					</div>
				</div>

				{/* Accordion trigger */}
				<button
					type="button"
					onClick={() => setOpen((s) => !s)}
					className="mt-5 w-full flex items-center justify-between rounded-2xl bg-slate-50 border px-4 py-3 text-sm font-semibold"
				>
					<span>View Tax Breakdown</span>
					<span className="text-slate-500">{open ? "▴" : "▾"}</span>
				</button>

				{/* Breakdown */}
				{open && (
					<div className="mt-4 rounded-2xl border bg-slate-50 p-4">
						<div className="text-brand-800 font-semibold">
							Tax Calculation Breakdown
						</div>

						<div className="mt-3 space-y-1 text-xs text-slate-700">
							{Object.keys(deductions).length > 0 ? (
								Object.entries(deductions).map(([k, v]) => (
									<div key={k} className="flex justify-between gap-3">
										<div className="truncate">{k}</div>
										<div className="font-medium">{formatNaira(v)}</div>
									</div>
								))
							) : (
								<div className="text-slate-600">
									No deductions details returned by the API.
								</div>
							)}
						</div>

						{/* Bands (if present) */}
						{Array.isArray(taxBands) && taxBands.length > 0 && (
							<>
								<hr className="my-4" />
								<div className="text-xs font-semibold text-slate-700">
									Progressive Tax Band (Annual)
								</div>
								<div className="mt-2 space-y-1 text-xs text-slate-700">
									{taxBands.map((b, idx) => {
										const label =
											(b.label as string) ||
											`${b.min ?? ""} - ${b.max ?? ""}`.trim();
										const rate = b.rate ?? b.percent ?? "";
										return (
											<div key={idx} className="flex justify-between gap-3">
												<div className="truncate">
													{label || `Band ${idx + 1}`}
												</div>
												<div className="font-medium">{String(rate)}</div>
											</div>
										);
									})}
								</div>
							</>
						)}

						{/* Computation steps (if present) */}
						{Array.isArray(computedBreakdown) &&
							computedBreakdown.length > 0 && (
								<>
									<hr className="my-4" />
									<div className="text-xs font-semibold text-slate-700">
										Break Down Your Tax
									</div>
									<div className="mt-2 space-y-1 text-xs text-slate-700">
										{computedBreakdown.map((s, idx) => (
											<div key={idx} className="flex justify-between gap-3">
												<div className="truncate">
													{String(s.label ?? s.name ?? `Step ${idx + 1}`)}
												</div>
												<div className="font-medium">
													{formatNaira(s.amount)}
												</div>
											</div>
										))}
									</div>
								</>
							)}

						<hr className="my-4" />

						<div className="flex justify-between text-xs text-slate-700">
							<div>Total Annual Tax</div>
							<div className="font-semibold">{formatNaira(taxDue)}</div>
						</div>

						<div className="flex justify-between text-xs text-slate-700 mt-1">
							<div>Monthly Tax</div>
							<div className="font-semibold">
								{formatNaira(
									typeof taxDue === "number" ? taxDue / 12 : Number(taxDue) / 12
								)}
							</div>
						</div>
					</div>
				)}

				{/* Actions */}
				<button
					onClick={() => navigate("/calculate")}
					className="mt-6 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900"
				>
					Calculate Another Tax
				</button>

				{/* Guest-only CTA (matches your first screenshot intent) */}
				{!isAuthenticated && (
					<div className="mt-6 rounded-2xl border bg-slate-200/60 p-5">
						<div className="text-sm font-semibold text-slate-900">
							Save Your Calculations
						</div>
						<div className="text-xs text-slate-600 mt-1">
							Create a free account to save your tax calculations, track
							history, and get reminders.
						</div>

						<div className="mt-4 flex gap-3">
							<div className="flex-1">
								<input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded border px-3 py-2 text-sm bg-white"
									placeholder="Enter your email"
									type="email"
								/>
							</div>
							<Link
								to="/signup"
								state={{ email }}
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
