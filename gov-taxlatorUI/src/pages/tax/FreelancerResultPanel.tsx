import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* =======================
   Types
======================= */

type TaxBreakdownItem = {
	rate?: number;
	tax?: number;
	taxableAmount?: number;
};

type FreelancerResult = {
	totalAnnualTax?: number;
	totalTax?: number;
	taxAmount?: number;
	annualTax?: number;
	tax?: number;

	monthlyTax?: number;

	annualGrossIncome?: number;
	grossIncome?: number;

	taxableIncome?: number;
	pension?: number;
	expenses?: number;

	breakdown?: TaxBreakdownItem[];
};

type Props = {
	result: unknown;
	grossIncome: number;
	isAuthenticated: boolean;
	prefillEmail?: string;
};

/* =======================
   Helpers
======================= */

function formatNaira(value: unknown) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return "₦0.00";
	return `₦${n.toLocaleString("en-NG", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

export default function FreelancerResultPanel({
	result,
	grossIncome,
	isAuthenticated,
	prefillEmail = "",
}: Props) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState(prefillEmail);

	/* =======================
	   Normalize backend result
	======================= */

	const r: FreelancerResult = useMemo(() => {
		if (typeof result === "object" && result !== null) {
			return result as FreelancerResult;
		}
		return {};
	}, [result]);

	const totalAnnualTax =
		r.totalAnnualTax ?? r.totalTax ?? r.taxAmount ?? r.annualTax ?? r.tax ?? 0;

	const annualGross = r.annualGrossIncome ?? r.grossIncome ?? grossIncome;
	const taxableIncome = r.taxableIncome ?? 0;
	const pension = r.pension ?? 0;
	const expenses = r.expenses ?? 0;

	const netIncome = useMemo(() => {
		const tax = Number(totalAnnualTax);
		const gross = Number(annualGross);
		if (!Number.isFinite(tax) || !Number.isFinite(gross)) return grossIncome;
		return Math.max(0, gross - tax);
	}, [totalAnnualTax, annualGross, grossIncome]);

	const breakdown: TaxBreakdownItem[] = Array.isArray(r.breakdown)
		? r.breakdown
		: [];

	return (
		<div className="bg-white rounded-2xl border shadow-soft overflow-hidden">
			{/* Header */}
			<div className="p-8 text-center border-b">
				<div className="text-xs text-slate-500">
					Freelancers / Self employed (PIT- Self assessment) Result
				</div>
				<div className="mt-2 text-3xl font-extrabold text-brand-800">
					{formatNaira(totalAnnualTax)}
				</div>
				<div className="text-sm text-slate-600 mt-1">Total Tax Due</div>
			</div>

			<div className="p-6">
				{/* Gross / Net */}
				<div className="grid grid-cols-2 gap-4 mt-2">
					<div className="rounded-xl bg-slate-50 border px-5 py-4">
						<div className="text-xs text-slate-500">Gross Income</div>
						<div className="mt-2 text-sm font-semibold text-slate-900">
							{formatNaira(annualGross)}
						</div>
					</div>

					<div className="rounded-xl bg-slate-50 border px-5 py-4">
						<div className="text-xs text-slate-500">Net Income</div>
						<div className="mt-2 text-sm font-semibold text-slate-900">
							{formatNaira(netIncome)}
						</div>
					</div>
				</div>

				{/* Accordion */}
				<button
					type="button"
					onClick={() => setOpen((s) => !s)}
					className="mt-6 w-full flex items-center justify-between rounded-xl bg-slate-50 border px-5 py-3 text-sm font-semibold"
				>
					<span>View Tax Breakdown</span>
					<span className="text-slate-500">{open ? "▴" : "▾"}</span>
				</button>

				{open && (
					<div className="mt-4 rounded-xl border bg-slate-50 p-5">
						<div className="text-brand-800 font-semibold">
							Tax Calculation Breakdown
						</div>

						{/* Deductions */}
						<div className="mt-4 space-y-2 text-xs text-slate-700">
							<div className="flex justify-between">
								<span>Business Expenses (100%)</span>
								<span>-{formatNaira(expenses)}</span>
							</div>
							<div className="flex justify-between">
								<span>Pension Deduction</span>
								<span>-{formatNaira(pension)}</span>
							</div>

							<hr />

							<div className="flex justify-between font-medium">
								<span>Annual Taxable Income</span>
								<span>{formatNaira(taxableIncome)}</span>
							</div>
						</div>

						{/* Progressive bands */}
						<hr className="my-4" />

						<div className="text-xs font-semibold text-slate-700">
							Progressive Tax Band (Annual)
						</div>

						<div className="mt-2 space-y-1 text-xs text-slate-600">
							<div className="flex justify-between">
								<span>₦0 - ₦800,000</span>
								<span>0%</span>
							</div>
							<div className="flex justify-between">
								<span>₦800,001 - ₦3,000,000</span>
								<span>15%</span>
							</div>
							<div className="flex justify-between">
								<span>₦3,000,001 - ₦12,000,000</span>
								<span>18%</span>
							</div>
							<div className="flex justify-between">
								<span>₦12,000,001 - ₦25,000,000</span>
								<span>21%</span>
							</div>
							<div className="flex justify-between">
								<span>₦25,000,001 - ₦50,000,000</span>
								<span>23%</span>
							</div>
							<div className="flex justify-between">
								<span>Above ₦50,000,000</span>
								<span>25%</span>
							</div>
						</div>

						{/* Dynamic breakdown */}
						{breakdown.length > 0 && (
							<>
								<hr className="my-4" />
								<div className="text-xs font-semibold text-slate-700">
									Break Down Your Tax
								</div>

								<div className="mt-2 space-y-2 text-xs">
									{breakdown.map((b, idx) => {
										const ratePct =
											typeof b.rate === "number"
												? `${Math.round(b.rate * 100)}%`
												: "—";

										return (
											<div
												key={idx}
												className="flex justify-between rounded bg-white border px-3 py-2"
											>
												<span>
													Tax Band {idx + 1} ({ratePct})
												</span>
												<span className="font-medium">
													{formatNaira(b.tax ?? 0)}
												</span>
											</div>
										);
									})}
								</div>
							</>
						)}

						<hr className="my-4" />

						<div className="flex justify-between text-xs text-slate-700">
							<span>Total Annual Tax</span>
							<span className="font-semibold">
								{formatNaira(totalAnnualTax)}
							</span>
						</div>

						<div className="flex justify-between text-xs text-slate-700 mt-1">
							<span>Monthly Tax</span>
							<span className="font-semibold">
								{formatNaira(r.monthlyTax ?? Number(totalAnnualTax) / 12)}
							</span>
						</div>
					</div>
				)}

				{/* CTA */}
				<button
					onClick={() => navigate("/calculate")}
					className="mt-8 w-full rounded-lg bg-brand-800 text-white py-3 text-sm font-semibold hover:bg-brand-900"
				>
					Calculate Another Tax
				</button>

				{/* Guest CTA */}
				{!isAuthenticated && (
					<div className="mt-6 rounded-xl border bg-slate-200/60 p-5">
						<div className="text-sm font-semibold text-slate-900">
							Save Your Calculations
						</div>
						<div className="text-xs text-slate-600 mt-1">
							Create a free account to save your tax calculations, track
							history, and get reminders.
						</div>

						<div className="mt-4 flex gap-3">
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="flex-1 rounded border px-3 py-2 text-sm bg-white"
								placeholder="Enter your email"
								type="email"
							/>
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
