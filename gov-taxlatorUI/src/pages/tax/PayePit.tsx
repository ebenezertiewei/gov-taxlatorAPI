// src/pages/tax/PayePit.tsx
import { useMemo, useState } from "react";
import TaxPageLayout from "./TaxPageLayout";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import PayePitResultPanel from "./PayePitResultPanel";
import type { PayeResult } from "../../api/types";

export default function PayePit() {
	const [income, setIncome] = useState("");
	const [busy, setBusy] = useState(false);
	const [result, setResult] = useState<PayeResult | null>(null);

	const incomeN = useMemo(
		() => Number(income.replace(/,/g, "")) || 0,
		[income],
	);

	async function onProceed() {
		if (incomeN <= 0) return;

		setBusy(true);
		try {
			const { data } = await api.post<{
				success: boolean;
				data: PayeResult;
			}>(ENDPOINTS.taxCalculate, {
				taxType: "PAYE",
				grossIncome: incomeN,
			});

			setResult(data.data);
		} finally {
			setBusy(false);
		}
	}

	return (
		<TaxPageLayout
			title="PAYE Income Tax"
			subtitle="Calculate PAYE based on Nigerian tax rules."
			rightPanel={result ? <PayePitResultPanel result={result} /> : undefined}
		>
			<label className="text-sm font-semibold">Annual Income (₦)</label>
			<input
				className="mt-1 w-full rounded border px-3 py-2"
				value={income}
				onChange={(e) => setIncome(e.target.value)}
				inputMode="numeric"
			/>

			<button
				onClick={onProceed}
				disabled={busy}
				className="mt-6 w-full rounded bg-brand-800 py-2.5 text-sm font-semibold text-white"
			>
				{busy ? "Calculating..." : "Proceed"}
			</button>
		</TaxPageLayout>
	);
}
