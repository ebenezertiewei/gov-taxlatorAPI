// taxlator/src/pages/Terms_Conditions.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function Terms() {
	const navigate = useNavigate();
	const [accepted, setAccepted] = useState<boolean>(() => {
		return localStorage.getItem("taxlator_terms_accepted") === "true";
	});

	function accept() {
		localStorage.setItem("taxlator_terms_accepted", "true");
		setAccepted(true);
		navigate(-1);
	}

	return (
		<div className="min-h-[80vh] bg-slate-200 px-4 py-8">
			<div className="mx-auto w-full max-w-2xl">
				{/* Header */}
				<div className="text-center">
					<div className="flex items-center justify-center text-brand-700">
						<BookIcon className="h-7 w-7" />
					</div>
					<h1 className="mt-2 text-2xl font-extrabold tracking-wide text-brand-800">
						TERMS AND CONDITIONS
					</h1>
					<p className="mt-1 text-sm text-slate-600">
						By clicking accept means you agreed to our terms and conditions
					</p>
				</div>

				{/* Card */}
				<div className="mt-5 rounded-2xl bg-white/70 p-3">
					<div className="rounded-2xl bg-white p-5 shadow-soft border border-slate-200">
						<div className="space-y-4 text-[13px] leading-relaxed text-slate-800">
							<section>
								<div className="font-semibold text-brand-800">
									1. Acceptance of Terms
								</div>
								<div>
									By accessing or using Taxlator, you agree to be bound by these
									Terms and Conditions. If you do not agree, please discontinue
									use of the app.
								</div>
							</section>

							<section>
								<div className="font-semibold text-brand-800">
									2. Purpose of Taxlator
								</div>
								<div>
									Taxlator provides estimated tax calculations based on the
									information you enter. All results are for informational
									purposes only and should not be considered legal, financial,
									or tax advice.
								</div>
							</section>

							<section>
								<div className="font-semibold text-brand-800">
									3. User Responsibilities
								</div>
								<div className="mt-1">You agree to:</div>
								<ul className="mt-1 list-disc pl-5">
									<li>Provide accurate and complete information</li>
									<li>Use the app for lawful purposes only</li>
									<li>
										Understand that incorrect inputs may produce inaccurate
										results
									</li>
								</ul>
							</section>

							<section>
								<div className="font-semibold text-brand-800">
									4. Limitations of Liability
								</div>
								<div className="mt-1">Taxlator is not responsible for:</div>
								<ul className="mt-1 list-disc pl-5">
									<li>Errors caused by incorrect user inputs</li>
									<li>Decisions made based on calculated results</li>
									<li>Financial or legal outcomes resulting from app usage</li>
								</ul>
							</section>

							<section>
								<div className="font-semibold text-brand-800">
									5. Changes to These Terms
								</div>
								<div>
									We may update these Terms from time to time. Continued use of
									the app means you accept the updated terms.
								</div>
							</section>

							<section>
								<div className="font-semibold text-brand-800">6. Contact</div>
								<div>
									For questions about these terms, contact us via the support
									section in the app.
								</div>
							</section>
						</div>

						{/* Accept button */}
						<div className="mt-6 flex justify-center">
							<button
								onClick={accept}
								className="w-full max-w-sm rounded-md bg-brand-800 py-2.5 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-60"
								disabled={accepted}
							>
								{accepted ? "Accepted" : "Accept"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
