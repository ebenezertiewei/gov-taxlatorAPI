// taxlator/src/pages/About.tsx
import React from "react";

function IconBox({
	children,
	tone = "blue",
}: {
	children: React.ReactNode;
	tone?: "blue" | "yellow";
}) {
	const base =
		tone === "yellow"
			? "bg-yellow-100 text-yellow-700 border-yellow-200"
			: "bg-brand-50 text-brand-800 border-brand-100";

	return (
		<div
			className={`h-9 w-9 rounded-lg border grid place-items-center ${base}`}
		>
			{children}
		</div>
	);
}

function UsersIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11Z"
				stroke="currentColor"
				strokeWidth="1.7"
			/>
			<path
				d="M8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Z"
				stroke="currentColor"
				strokeWidth="1.7"
			/>
			<path
				d="M8 14c-2.76 0-5 1.79-5 4v2h10v-2c0-2.21-2.24-4-5-4Z"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinejoin="round"
			/>
			<path
				d="M16 14c-1.05 0-2.02.22-2.83.6 1.7.88 2.83 2.32 2.83 3.9v1.5h6V18c0-2.21-2.69-4-6-4Z"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function BriefcaseIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M9 7V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
			<path
				d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinejoin="round"
			/>
			<path
				d="M4 12h16"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function InfoIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
				stroke="currentColor"
				strokeWidth="1.7"
			/>
			<path
				d="M12 10v6"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
			<path
				d="M12 7.2h.01"
				stroke="currentColor"
				strokeWidth="2.2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function MailIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M4 6h16v12H4V6Z"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinejoin="round"
			/>
			<path
				d="M4 7l8 6 8-6"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function Card({
	title,
	icon,
	children,
	tone = "blue",
}: {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	tone?: "blue" | "yellow";
}) {
	const cardBg =
		tone === "yellow"
			? "bg-yellow-50 border-yellow-200"
			: "bg-white border-slate-200";

	return (
		<div className={`rounded-xl border shadow-soft ${cardBg}`}>
			<div className="p-4 flex gap-3">
				<IconBox tone={tone}>{icon}</IconBox>
				<div className="flex-1">
					<div className="text-sm font-semibold text-brand-800">{title}</div>
					<div className="mt-2 text-xs text-slate-700 leading-relaxed">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function About() {
	return (
		<div className="min-h-[80vh] bg-slate-200 px-4 py-8">
			<div className="mx-auto w-full max-w-5xl">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl font-extrabold text-brand-800">
						About Taxlator
					</h1>
					<p className="mt-1 text-sm text-slate-600">
						Your trusted Nigerian tax calculation companion
					</p>
				</div>

				{/* Content */}
				<div className="mt-8 space-y-5">
					<Card title="Our Mission" icon={<UsersIcon />}>
						Taxlator was created to simplify tax calculations for Nigerians. We
						believe that understanding and calculating your tax obligations
						should not be complicated or expensive. Our mission is to provide
						free, accurate, and easy to use tax calculation tools that comply
						with Nigerian tax regulations.
					</Card>

					<Card title="What We Do" icon={<BriefcaseIcon />}>
						We provide accurate tax calculations for various Nigerian tax types
						including PAYE, Annual Personal Income Tax, Freelancers/Self
						Employed Taxes, VAT, and Company Income Tax. Our Calculator is built
						based on current Nigeria Tax Laws and Regulations including:
						<ul className="mt-3 list-disc pl-5 space-y-1">
							<li>8% pension deduction calculation</li>
							<li>Consolidated Relief Allowance (CRA) computation</li>
							<li>Progressive Tax Bands (7%, 11%, 15%, 19%, 21%, 24%)</li>
							<li>Monthly and Annual Tax Calculations</li>
						</ul>
					</Card>

					<Card title="Importance Disclaimer" icon={<InfoIcon />} tone="yellow">
						Taxlator is for informational purposes only. While we strive to keep
						our calculator accurate and up-to-date with Nigerian Tax
						Regulations, tax laws can change, and individual circumstances may
						vary. We strongly recommend consulting with a qualified tax
						professional or the Federal Inland Revenue Service (FIRS) for
						official tax advice and compliance guidance.
					</Card>

					<Card title="Get in Touch" icon={<MailIcon />}>
						Have questions, feedback, or suggestions? We’d love to hear from
						you.
						<div className="mt-4">
							<a
								href="mailto:hello@taxlator.ng"
								className="inline-flex items-center gap-2 rounded bg-brand-800 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-900"
							>
								<span className="opacity-95">
									<MailIcon />
								</span>
								hello@taxlator.ng
							</a>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
