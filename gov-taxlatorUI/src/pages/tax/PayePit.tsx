// taxlator/src/pages/tax/PayePit.tsx


//  TO BE FIXED LATER
import { useMemo, useState } from "react";
import TaxPageLayout from "./TaxPageLayout";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { addHistory } from "../../state/history";
import type { PayePitCalculatePayload } from "../../api/types";
import { useAuth } from "../../state/useAuth";
import PayePitResultPanel from "./PayePitResultPanel";

type ApiSuccess<T> = { success: true; data: T; message?: string };
type ApiFail = { success?: false; message?: string; error?: string };

/* =======================
   Helpers
======================= */
const formatNumber = (value: string) => {
	if (!value) return "";
	const numeric = value.replace(/,/g, "");
	if (isNaN(Number(numeric))) return value;
	return Number(numeric).toLocaleString();
};

const parseNumber = (value: string) => Number(value.replace(/,/g, "") || 0);

export default function PayePit() {
	const { authenticated } = useAuth();

	// income
	const [grossAnnualIncome, setGrossAnnualIncome] = useState("");

	// deduction toggles
	const [includeRentRelief, setIncludeRentRelief] = useState(true); // CRA default
	const [includePension, setIncludePension] = useState(false);
	const [includeNhf, setIncludeNhf] = useState(false);
	const [includeNhIs, setIncludeNhIs] = useState(false);

	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState<unknown>(null);

	const grossIncomeNumber = useMemo(
		() => parseNumber(grossAnnualIncome),
		[grossAnnualIncome]
	);

	async function calculate() {
		setError("");
		setBusy(true);

		try {
			const rentReliefAmount = includeRentRelief ? grossIncomeNumber * 0.2 : 0;

			const otherDeductions =
				(includePension ? grossIncomeNumber * 0.08 : 0) +
				(includeNhf ? grossIncomeNumber * 0.025 : 0) +
				(includeNhIs ? grossIncomeNumber * 0.015 : 0);

			const payload: PayePitCalculatePayload = {
				taxType: "PAYE/PIT",
				grossIncome: grossIncomeNumber,
				rentRelief: rentReliefAmount,
				otherDeductions,
			};

			const { data } = await api.post<ApiSuccess<unknown> | ApiFail>(
				ENDPOINTS.taxCalculate,
				payload
			);

			if (!("success" in data) || data.success !== true) {
				setError(
					(data as ApiFail).message ||
						(data as ApiFail).error ||
						"PAYE/PIT calculation failed"
				);
				return;
			}

			setResult(data.data);

			addHistory({
				type: "PAYE_PIT",
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
					"PAYE/PIT calculation failed"
			);
		} finally {
			setBusy(false);
		}
	}

	return (
		<TaxPageLayout
			title="PAYE / PIT Calculator"
			subtitle="Calculate your personal income tax based on Nigerian Tax Law (PITA)"
			rightPanel={
				result ? (
					<PayePitResultPanel
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

			<label className="text-xs font-semibold text-slate-700">
				Gross Annual Income
			</label>
			<input
				className="mt-1 w-full rounded border px-3 py-2 text-sm"
				value={formatNumber(grossAnnualIncome)}
				onChange={(e) => setGrossAnnualIncome(e.target.value.replace(/,/g, ""))}
				placeholder="₦ 0"
				inputMode="numeric"
			/>

			{/* Deduction Toggles */}
			<div className="mt-4 space-y-3">
				<label className="flex items-center justify-between border rounded-xl p-3">
					<div>
						<div className="font-semibold text-sm">Rent Relief (CRA)</div>
						<div className="text-xs text-slate-600">20% of gross income</div>
					</div>
					<input
						type="checkbox"
						checked={includeRentRelief}
						onChange={(e) => setIncludeRentRelief(e.target.checked)}
					/>
				</label>

				<label className="flex items-center justify-between border rounded-xl p-3">
					<div>
						<div className="font-semibold text-sm">Pension Contribution</div>
						<div className="text-xs text-slate-600">8% deduction</div>
					</div>
					<input
						type="checkbox"
						checked={includePension}
						onChange={(e) => setIncludePension(e.target.checked)}
					/>
				</label>

				<label className="flex items-center justify-between border rounded-xl p-3">
					<div>
						<div className="font-semibold text-sm">National Housing Fund</div>
						<div className="text-xs text-slate-600">2.5% deduction</div>
					</div>
					<input
						type="checkbox"
						checked={includeNhf}
						onChange={(e) => setIncludeNhf(e.target.checked)}
					/>
				</label>

				<label className="flex items-center justify-between border rounded-xl p-3">
					<div>
						<div className="font-semibold text-sm">Health Insurance</div>
						<div className="text-xs text-slate-600">1.5% deduction</div>
					</div>
					<input
						type="checkbox"
						checked={includeNhIs}
						onChange={(e) => setIncludeNhIs(e.target.checked)}
					/>
				</label>
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
