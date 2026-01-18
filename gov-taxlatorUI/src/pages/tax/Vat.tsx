// taxlator/src/pages/tax/Vat.tsx
import { useState } from "react";
import TaxPageLayout from "./TaxPageLayout";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { addHistory } from "../../state/history";
import { useAuth } from "../../state/useAuth";
import type {
	VatCalculatePayload,
	VatCalculationType,
	VatTransactionType,
} from "../../api/types";
import VatResultPanel from "./VatResultPanel";

type ApiSuccess<T> = { success: true; data: T; message?: string };
type ApiFail = { success?: false; message?: string; error?: string };

function toNumberSafe(v: string): number {
	const cleaned = v.replace(/,/g, "").trim();
	if (!cleaned) return 0;
	const n = Number(cleaned);
	return Number.isFinite(n) ? n : NaN;
}

function formatWithCommas(value: string): string {
	const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
	if (!cleaned) return "";
	const parts = cleaned.split(".");
	parts[0] = Number(parts[0]).toLocaleString("en-NG");
	return parts.join(".");
}

export default function Vat() {
	const { authenticated } = useAuth();

	const [transactionAmount, setTransactionAmount] = useState("200,000");
	const [calculationType, setCalculationType] =
		useState<VatCalculationType>("add");
	const [transactionType, setTransactionType] = useState<VatTransactionType>(
		"Domestic sale/Purchase"
	);

	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState<unknown>(null);

	async function calculate() {
		setError("");
		setBusy(true);

		try {
			const amountN = toNumberSafe(transactionAmount);
			if (!Number.isFinite(amountN) || amountN <= 0) {
				setError("Transaction amount must be a valid number greater than 0.");
				return;
			}

			const payload: VatCalculatePayload = {
				transactionAmount: amountN,
				calculationType,
				transactionType,
			};

			const { data } = await api.post<ApiSuccess<unknown> | ApiFail>(
				ENDPOINTS.vatCalculate,
				payload
			);

			if (!("success" in data) || data.success !== true) {
				const msg =
					(data as ApiFail).message ||
					(data as ApiFail).error ||
					"VAT calculation failed";
				setError(msg);
				return;
			}

			setResult(data.data);

			addHistory({
				type: "VAT",
				input: payload as Record<string, unknown>,
				result: data.data as unknown,
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
					"VAT calculation failed"
			);
		} finally {
			setBusy(false);
		}
	}

	const amountN = toNumberSafe(transactionAmount);

	return (
		<TaxPageLayout
			title="VAT Calculation"
			subtitle="Quickly add or remove tax from your prices using the latest rates."
			rightPanel={
				result ? (
					<VatResultPanel
						result={result}
						amount={Number.isFinite(amountN) ? amountN : 0}
						isAuthenticated={authenticated}
					/>
				) : undefined
			}
		>
			{error ? (
				<div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
					{error}
				</div>
			) : null}

			<label className="text-xs font-semibold text-slate-700">
				Transaction Amount
			</label>
			<input
				className="mt-1 w-full rounded border px-3 py-2 text-sm"
				value={transactionAmount}
				onChange={(e) => setTransactionAmount(formatWithCommas(e.target.value))}
				placeholder="200,000"
				inputMode="decimal"
			/>

			{/* Add/Remove toggle buttons */}
			<div className="mt-4 grid grid-cols-2 gap-4">
				<button
					type="button"
					onClick={() => setCalculationType("add")}
					className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
						calculationType === "add"
							? "bg-brand-800 text-white border-brand-800"
							: "bg-white text-slate-900"
					}`}
				>
					+Add VAT
				</button>

				<button
					type="button"
					onClick={() => setCalculationType("remove")}
					className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
						calculationType === "remove"
							? "bg-brand-800 text-white border-brand-800"
							: "bg-white text-slate-900"
					}`}
				>
					-Remove VAT
				</button>
			</div>

			{/* Transaction type */}
			<div className="mt-6">
				<div className="text-xs font-semibold text-slate-700">
					Transaction type
				</div>

				<div className="mt-3 grid sm:grid-cols-2 gap-3">
					{(
						[
							"Domestic sale/Purchase",
							"Export/International",
							"Digital Services",
							"Exempt",
						] as VatTransactionType[]
					).map((t) => {
						const active = transactionType === t;
						const label =
							t === "Domestic sale/Purchase"
								? "Domestic sale/Purchase 7.5%"
								: t === "Digital Services"
								? "Digital Services 7.5%"
								: t === "Export/International"
								? "Export/International 0%"
								: "Exempt Items (no VAT)";

						return (
							<button
								key={t}
								type="button"
								onClick={() => setTransactionType(t)}
								className={`w-full rounded-lg border px-4 py-3 text-sm flex items-center justify-between ${
									active ? "border-brand-800" : "border-slate-300"
								}`}
							>
								<span className="text-left">{label}</span>
								<span
									className={`h-5 w-5 rounded border grid place-items-center ${
										active
											? "bg-brand-800 border-brand-800 text-white"
											: "bg-white border-slate-400 text-transparent"
									}`}
								>
									✓
								</span>
							</button>
						);
					})}
				</div>
			</div>

			<button
				onClick={calculate}
				disabled={busy}
				className="mt-10 w-full max-w-sm mx-auto block rounded bg-brand-800 text-white py-3 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60"
			>
				{busy ? "Calculating..." : "Proceed"}
			</button>
		</TaxPageLayout>
	);
}
