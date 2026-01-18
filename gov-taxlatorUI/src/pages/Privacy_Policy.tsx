// taxlator/src/pages/Privacy_Policy.tsx
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

export default function PrivacyPolicy() {
	const navigate = useNavigate();

	return (
		<div className="min-h-[80vh] bg-slate-200 px-4 py-8">
			<div className="mx-auto w-full max-w-2xl">
				{/* Header */}
				<div className="text-center">
					<div className="flex items-center justify-center text-brand-700">
						<BookIcon className="h-7 w-7" />
					</div>
					<h1 className="mt-2 text-2xl font-extrabold tracking-wide text-brand-800">
						PRIVACY POLICY
					</h1>
				</div>

				{/* Card */}
				<div className="mt-5 rounded-2xl bg-white/70 p-3">
					<div className="rounded-2xl bg-white p-5 shadow-soft border border-slate-200">
						<div className="space-y-4 text-[13px] leading-relaxed text-slate-800">
							<section>
								<div className="font-semibold text-brand-800">
									1. Information We Collect
								</div>
								<div className="mt-1">
									We may collect:
									<ul className="mt-1 list-disc pl-5">
										<li>
											Income and tax-related inputs (for calculation only)
										</li>
										<li>Optional account details (if you choose to sign up)</li>
									</ul>
									We do not collect unnecessary personal data.
								</div>
							</section>

							<section>
								<div className="font-semibold text-brand-800">
									2. How We Use Your Information
								</div>
								<ul className="mt-1 list-disc pl-5">
									<li>Calculate tax estimates</li>
									<li>Improve accuracy and user experience</li>
									<li>Save results (only if you create an account)</li>
								</ul>
							</section>

							<section>
								<div className="font-semibold text-brand-800">
									3. Data Protection
								</div>
								<div>
									We apply standard security measures to protect your data. Your
									information is not sold or shared with third parties.
								</div>
							</section>

							<section>
								<div className="font-semibold text-brand-800">
									4. Your Choices
								</div>
								<ul className="mt-1 list-disc pl-5">
									<li>You can use Taxlator without creating an account</li>
									<li>Saving calculations is optional</li>
									<li>You may delete saved data at any time</li>
								</ul>
							</section>

							<section>
								<div className="font-semibold text-brand-800">
									5. Updates to This Policy
								</div>
								<div>
									This policy may be updated to reflect changes in the app or
									legal requirements.
								</div>
							</section>

							<section>
								<div className="font-semibold text-brand-800">
									6. Contact Us
								</div>
								<div>
									If you have questions about your privacy, reach us through the
									app’s support section.
								</div>
							</section>
						</div>

						{/* Back button */}
						<div className="mt-6 flex justify-center">
							<button
								onClick={() => navigate(-1)}
								className="w-full max-w-sm rounded-md bg-brand-800 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
							>
								Back to Home
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
