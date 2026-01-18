// taxlator/src/pages/tax/TaxPageLayout.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function TaxPageLayout({
	title,
	subtitle,
	children,
	rightPanel,
}: {
	title: string;
	subtitle: string;
	children: React.ReactNode;
	rightPanel?: React.ReactNode;
}) {
	return (
		<div className="bg-slate-200 min-h-[80vh] px-4 py-8">
			<div className="max-w-5xl mx-auto">
				<Link
					to="/calculate"
					className="text-sm text-slate-700 hover:text-brand-800"
				>
					← Back
				</Link>

				<div className="mt-4 grid lg:grid-cols-2 gap-6 items-start">
					<div className="bg-white rounded-2xl border p-6 shadow-soft">
						<div className="text-brand-800 font-semibold">{title}</div>
						<div className="text-xs text-slate-600 mt-1">{subtitle}</div>
						<div className="mt-6">{children}</div>
					</div>

					<div className="bg-white rounded-2xl border p-6 shadow-soft">
						{rightPanel ? (
							rightPanel
						) : (
							<>
								<div className="text-sm font-semibold">Result Panel</div>
								<div className="text-xs text-slate-600 mt-1">
									Render totals and breakdown here.
								</div>
								<div className="mt-5 rounded-xl bg-slate-50 border p-4 text-sm text-slate-700">
									Waiting for calculation…
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
