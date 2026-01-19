// taxlator/src/pages/tax/FreeLancer.tsx
import { useMemo, useState } from "react";
import TaxPageLayout from "./TaxPageLayout";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { addHistory } from "../../state/history";
import type { FreelancerCalculatePayload } from "../../api/types";
import { useAuth } from "../../state/useAuth";
import FreelancerResultPanel from "./FreelancerResultPanel";

type ApiSuccess<T> = { success: true; data: T; message?: string };
type ApiFail = { success?: false; message?: string; error?: string };

/* =======================
   Formatting helpers
======================= */
const formatNumber = (value: string) => {
	if (!value) return "";
	const numeric = value.replace(/,/g, "");
	if (isNaN(Number(numeric))) return value;
	return Number(numeric).toLocaleString();
};

const parseNumber = (value: string) => {
	return Number(value.replace(/,/g, "") || 0);
};

export default function FreeLancer() {
	const { authenticated } = useAuth();

	const [grossAnnualIncome, setGrossAnnualIncome] = useState("");
	const [pensionContrib, setPensionContrib] = useState("");
	const [includeExpenses, setIncludeExpenses] = useState(true);
	const [businessExpenses, setBusinessExpenses] = useState("");

	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState<unknown>(null);

	const grossIncomeNumber = useMemo(
		() => parseNumber(grossAnnualIncome),
		[grossAnnualIncome],
	);

	async function calculate() {
		setError("");
		setBusy(true);

		try {
			const payload: FreelancerCalculatePayload = {
				taxType: "FREELANCER",
				grossIncome: grossIncomeNumber,
				pension: parseNumber(pensionContrib),
				expenses: includeExpenses ? parseNumber(businessExpenses) : 0,
			};

			const { data } = await api.post<ApiSuccess<unknown> | ApiFail>(
				ENDPOINTS.taxCalculate,
				payload,
			);

			if (!("success" in data) || data.success !== true) {
				const msg =
					(data as ApiFail).message ||
					(data as ApiFail).error ||
					"Freelancer calculation failed";
				setError(msg);
				return;
			}

			setResult(data.data);

			addHistory({
				type: "FREELANCER",
				input: payload,
				result: data.data,
			});
		} catch (err: unknown) {
			const e = err as {
				response?: { data?: { message?: string; error?: string } };
				message?: string;
			};
			setError(
				e.response?.data?.message ||
					e.response?.data?.error ||
					e.message ||
					"Freelancer calculation failed",
			);
		} finally {
			setBusy(false);
		}
	}

	return (
		<TaxPageLayout
			title="Freelancer / Self-Employed Tax"
			subtitle="Calculate tax on your freelance or business income."
			rightPanel={
				result ? (
					<FreelancerResultPanel
						result={result}
						grossIncome={grossIncomeNumber}
						isAuthenticated={authenticated}
					/>
				) : null
			}
		>
			{error && (
				<div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
					{error}
				</div>
			)}

			{/* Gross Annual Income */}
			<div className="space-y-1">
				<label
					htmlFor="grossAnnualIncome"
					className="text-sm font-bold text-slate-700"
				>
					Gross Annual Income
				</label>

				<div className="relative">
					<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
						₦
					</span>

					<input
						id="grossAnnualIncome"
						className="w-full box-border rounded border pl-8 pr-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
						value={formatNumber(grossAnnualIncome)}
						onChange={(e) =>
							setGrossAnnualIncome(e.target.value.replace(/,/g, ""))
						}
						placeholder="0"
						inputMode="numeric"
					/>
				</div>
			</div>

			{/* Pension Contributions */}
			<div className="space-y-1 mt-4">
				<label
					htmlFor="pensionContrib"
					className="text-xs font-bold text-slate-700"
				>
					Pension Contributions
				</label>

				<div className="relative">
					<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
						₦
					</span>

					<input
						id="pensionContrib"
						className="w-full box-border rounded border pl-8 pr-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
						value={formatNumber(pensionContrib)}
						onChange={(e) =>
							setPensionContrib(e.target.value.replace(/,/g, ""))
						}
						placeholder="0"
						inputMode="numeric"
					/>
				</div>
			</div>

			<div className="mt-4 rounded-xl border p-4 bg-white">
				<div className="flex items-start justify-between gap-3">
					<div>
						<div className="text-xs font-semibold text-slate-900">
							Include Business Expenses
						</div>
						<div className="text-xs text-slate-600 mt-1">
							Deduct legitimate business expenses from your income
						</div>
					</div>

					<input
						type="checkbox"
						className="h-5 w-5 accent-brand-800"
						checked={includeExpenses}
						onChange={(e) => setIncludeExpenses(e.target.checked)}
					/>
				</div>

				{includeExpenses && (
					<div className="mt-4 space-y-1">
						<label
							htmlFor="businessExpenses"
							className="text-xs font-semibold text-slate-700"
						>
							Total Business Expenses
						</label>

						<div className="relative">
							<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
								₦
							</span>

							<input
								id="businessExpenses"
								className="w-full box-border rounded border pl-8 pr-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
								value={formatNumber(businessExpenses)}
								onChange={(e) =>
									setBusinessExpenses(e.target.value.replace(/,/g, ""))
								}
								placeholder="0"
								inputMode="numeric"
							/>
						</div>
					</div>
				)}
			</div>

			<button
				onClick={calculate}
				disabled={busy}
				className="mt-6 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60"
			>
				{busy ? "Calculating..." : "Proceed"}
			</button>
		</TaxPageLayout>
	);
}
