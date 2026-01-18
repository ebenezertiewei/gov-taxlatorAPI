// taxlator/src/pages/TaxGuides.tsx
import React from "react";

function BookIcon({ className = "" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M12 6.4c-2.2-1.6-5.4-1.9-8-1.4v13.9c2.6-.6 5.8-.2 8 1.4m0-13.9c2.2-1.6 5.4-1.9 8-1.4v13.9c-2.6-.6-5.8-.2-8 1.4"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinejoin="round"
			/>
			<path
				d="M12 6.6v13.6"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function Tag({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700">
			{children}
		</span>
	);
}

type GuideCardProps = {
	title: string;
	description: string;
	tags: string[];
};

function GuideCard({ title, description, tags }: GuideCardProps) {
	return (
		<div className="rounded-2xl bg-white p-4 shadow-soft border border-slate-200">
			<div className="text-sm font-semibold text-brand-800">{title}</div>
			<div className="mt-1 text-xs text-slate-600">{description}</div>

			<div className="mt-3 flex flex-wrap gap-2">
				{tags.map((t) => (
					<Tag key={t}>{t}</Tag>
				))}
			</div>
		</div>
	);
}

export default function Guides() {
	return (
		<div className="min-h-[80vh] bg-slate-200 px-4 py-8">
			<div className="mx-auto w-full max-w-3xl">
				{/* Header */}
				<div className="text-center">
					<div className="flex items-center justify-center text-brand-700">
						<BookIcon className="h-7 w-7" />
					</div>
					<h1 className="mt-2 text-2xl font-extrabold text-brand-800">
						Tax Guides &amp; Resources
					</h1>
					<p className="mt-1 text-sm text-slate-600">
						Learn about Nigerian tax regulations, calculations, and best
						practices
					</p>
				</div>

				{/* Cards */}
				<div className="mt-6 space-y-4">
					<GuideCard
						title="Understanding PAYE in Nigeria"
						description="Learn how Pay As You Earn (PAYE) works, who it applies to, and how it's calculated."
						tags={[
							"Tax bands and rates",
							"Pension deductions",
							"Consolidated Relief Allowance (CRA)",
							"Monthly vs Annual calculations",
						]}
					/>

					<GuideCard
						title="Annual Personal Income Tax (PIT)"
						description="A comprehensive guide to annual PIT for salaried employees and self-employed individuals."
						tags={[
							"Annual vs Monthly tax",
							"Tax reliefs and deductions",
							"Filing requirements",
							"Payment schedules",
						]}
					/>

					<GuideCard
						title="Tax Guide for Freelancers"
						description="Everything freelancers and self-employed professionals need to know about Nigerian tax."
						tags={[
							"Business expenses",
							"Quarterly payments",
							"Record keeping",
							"Tax optimization",
						]}
					/>

					<GuideCard
						title="Value Added Tax (VAT)"
						description="Understanding VAT registration, collection, and remittance in Nigeria."
						tags={[
							"VAT registration threshold",
							"Standard vs Zero-rated items",
							"Filing and remittance",
							"VAT exemptions",
						]}
					/>

					<GuideCard
						title="Company Income Tax"
						description="A guide for business owners on calculating and paying company income tax."
						tags={[
							"CIT rates",
							"Allowable deductions",
							"Capital allowances",
							"Tax returns and filing",
						]}
					/>
				</div>
			</div>
		</div>
	);
}
