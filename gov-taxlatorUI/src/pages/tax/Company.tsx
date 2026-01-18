// taxlator/src/pages/tax/Company.tsx
import { useMemo, useState } from "react";
import TaxPageLayout from "./TaxPageLayout";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { addHistory } from "../../state/history";
import { useAuth } from "../../state/useAuth";
import CompanyResultPanel from "./CompanyResultPanel";
import type { CitCalculatePayload } from "../../api/types";

type CompanySize = "SMALL" | "MEDIUM" | "LARGE";

type FormState = {
	revenue: string;
	companySize: CompanySize | "";
	includeBusinessExpenses: boolean;
	businessExpenses: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>> & {
	general?: string;
};

type ApiSuccess<T> = { success: true; data: T; message?: string };
type ApiFail = { success?: false; message?: string; error?: string };

function isApiSuccess<T>(d: ApiSuccess<T> | ApiFail): d is ApiSuccess<T> {
	return (
		typeof d === "object" && d !== null && "success" in d && d.success === true
	);
}

function toNumberSafe(v: string): number {
	const cleaned = v.replace(/,/g, "").trim();
	if (!cleaned) return 0;
	const n = Number(cleaned);
	return Number.isFinite(n) ? n : NaN;
}

function formatNumberInput(v: string) {
	// keep digits only
	const digits = v.replace(/[^\d]/g, "");
	if (!digits) return "";
	// add commas
	return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Company() {
	const { authenticated } = useAuth();

	const [form, setForm] = useState<FormState>({
		revenue: "",
		companySize: "",
		includeBusinessExpenses: false,
		businessExpenses: "",
	});

	const [errors, setErrors] = useState<FieldErrors>({});
	const [busy, setBusy] = useState(false);
	const [result, setResult] = useState<unknown>(null);

	const revenueN = useMemo(() => toNumberSafe(form.revenue), [form.revenue]);
	const businessExpensesN = useMemo(
		() => toNumberSafe(form.businessExpenses),
		[form.businessExpenses]
	);

	function validate(): boolean {
		const next: FieldErrors = {};

		if (!form.revenue.trim()) next.revenue = "Revenue is required";
		else if (!Number.isFinite(revenueN))
			next.revenue = "Revenue must be a valid number";
		else if (revenueN < 0) next.revenue = "Revenue cannot be negative";

		if (!form.companySize) next.companySize = "Select company size";

		if (form.includeBusinessExpenses) {
			if (!form.businessExpenses.trim())
				next.businessExpenses = "Enter total business expenses";
			else if (!Number.isFinite(businessExpensesN))
				next.businessExpenses = "Expenses must be a valid number";
			else if (businessExpensesN < 0)
				next.businessExpenses = "Expenses cannot be negative";
			else if (Number.isFinite(revenueN) && businessExpensesN > revenueN) {
				next.businessExpenses = "Expenses cannot be greater than revenue";
			}
		}

		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function onProceed() {
		if (!validate()) return;

		setBusy(true);
		setErrors({});
		try {
			const payload: CitCalculatePayload = {
				taxType: "CIT",
				revenue: revenueN,
				companySize: form.companySize as CompanySize,
				expenses: form.includeBusinessExpenses ? businessExpensesN : 0,
				// frequency optional; backend defaults to "annual"
				// frequency: "annual",
			};

			const { data } = await api.post<ApiSuccess<unknown> | ApiFail>(
				ENDPOINTS.taxCalculate,
				payload
			);

			if (!isApiSuccess(data)) {
				const msg =
					data.message || data.error || "Company Income Tax calculation failed";
				setErrors({ general: msg });
				return;
			}

			setResult(data.data);

			addHistory({
				type: "COMPANY",
				input: payload as unknown as Record<string, unknown>,
				result: data.data,
			});
		} catch (err: unknown) {
			const e = err as {
				response?: { data?: { message?: string; error?: string } };
				message?: string;
			};
			setErrors({
				general:
					e.response?.data?.message ||
					e.response?.data?.error ||
					e.message ||
					"Company Income Tax calculation failed",
			});
		} finally {
			setBusy(false);
		}
	}

	return (
		<TaxPageLayout
			title="Company Income Tax"
			subtitle="Calculate company income tax based on Nigerian CIT rules."
			rightPanel={
				result ? (
					<CompanyResultPanel
						result={result}
						revenue={revenueN}
						expenses={form.includeBusinessExpenses ? businessExpensesN : 0}
						companySize={form.companySize || undefined}
						isAuthenticated={authenticated}
					/>
				) : undefined
			}
		>
			{errors.general ? (
				<div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
					{errors.general}
				</div>
			) : null}

			<label className="text-xs font-semibold text-slate-700">Revenue</label>
			<div className="mt-1 flex items-center gap-2">
				<span className="text-sm text-slate-600">₦</span>
				<input
					className={`w-full rounded border px-3 py-2 text-sm ${
						errors.revenue ? "border-red-300" : ""
					}`}
					value={form.revenue}
					inputMode="numeric"
					onChange={(e) => {
						const formatted = formatNumberInput(e.target.value);
						setForm((s) => ({ ...s, revenue: formatted }));
					}}
					placeholder="0"
				/>
			</div>
			{errors.revenue ? (
				<div className="mt-1 text-xs text-red-600">{errors.revenue}</div>
			) : null}

			<div className="mt-4">
				<label className="text-xs font-semibold text-slate-700">
					Company Size
				</label>
				<select
					className={`mt-1 w-full rounded border px-3 py-2 text-sm bg-white ${
						errors.companySize ? "border-red-300" : ""
					}`}
					value={form.companySize}
					onChange={(e) =>
						setForm((s) => ({
							...s,
							companySize: e.target.value as CompanySize,
						}))
					}
				>
					<option value="">Select Size</option>
					<option value="SMALL">Small Company</option>
					<option value="MEDIUM">Medium Company</option>
					<option value="LARGE">Large Company</option>
				</select>
				{errors.companySize ? (
					<div className="mt-1 text-xs text-red-600">{errors.companySize}</div>
				) : null}
			</div>

			<div className="mt-4 rounded-xl border p-4 bg-white">
				<div className="flex items-start justify-between gap-3">
					<div>
						<div className="text-sm font-semibold text-slate-900">
							Include Business Expenses
						</div>
						<div className="text-xs text-slate-600 mt-1">
							Deduct allowable business expenses from revenue
						</div>
					</div>

					<input
						type="checkbox"
						className="h-5 w-5 accent-brand-800"
						checked={form.includeBusinessExpenses}
						onChange={(e) =>
							setForm((s) => ({
								...s,
								includeBusinessExpenses: e.target.checked,
								// optional: clear expenses when turning off
								...(e.target.checked ? null : { businessExpenses: "" }),
							}))
						}
					/>
				</div>

				{form.includeBusinessExpenses && (
					<div className="mt-4">
						<label className="text-xs font-semibold text-slate-700 block">
							Total Business Expenses
						</label>
						<div className="mt-1 flex items-center gap-2">
							<span className="text-sm text-slate-600">₦</span>
							<input
								className={`w-full rounded border px-3 py-2 text-sm ${
									errors.businessExpenses ? "border-red-300" : ""
								}`}
								value={form.businessExpenses}
								onChange={(e) => {
									const formatted = formatNumberInput(e.target.value);
									setForm((s) => ({ ...s, businessExpenses: formatted }));
								}}
								placeholder="0"
								inputMode="numeric"
							/>
						</div>
						{errors.businessExpenses ? (
							<div className="mt-1 text-xs text-red-600">
								{errors.businessExpenses}
							</div>
						) : null}
					</div>
				)}
			</div>

			<button
				onClick={onProceed}
				disabled={busy}
				className="mt-6 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60"
			>
				{busy ? "Calculating..." : "Proceed"}
			</button>
		</TaxPageLayout>
	);
}
