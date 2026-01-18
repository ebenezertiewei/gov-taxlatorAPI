// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import taxlatorLanding from "../assets/taxlator-landing.jpg";
// Tax guide pics
import taxUpdate1 from "../assets/taxUpdate1.png";
import taxTipsUpdate from "../assets/taxTipsUpdate.png";
import companyIncomeTax from "../assets/companyIncomeTax.png";
// About pics
import frameArrow from "../assets/FrameArrow.png";
import frameCarbon from "../assets/FrameCarbon.png";
import frameUser from "../assets/fameUser.png";
import frameStars from "../assets/FrameStars.png";

function SectionTitle({
	title,
	subtitle,
}: {
	title: string;
	subtitle?: string;
}) {
	return (
		<div className="text-center">
			<div className="text-[1.6rem] font-semibold text-brand-800">{title}</div>
			{subtitle ? (
				<div className="text-lg text-slate-600 mt-1">{subtitle}</div>
			) : null}
		</div>
	);
}

export default function Landing() {
	const taxGuides = [
		{
			tag: "PAYE/PIT",
			title: "Understanding PAYE Tax Bands in Nigeria",
			description:
				"Learn how progressive tax rates from 7% to 24% apply to your income and what it means for your take-home pay.",
			image: taxUpdate1,
		},
		{
			tag: "Freelancer",
			title: "Tax Tips for Freelancers and Self-Employed",
			description:
				"Discover legitimate business expenses you can deduct and how to optimize your tax payments as a freelancer.",
			image: taxTipsUpdate,
		},
		{
			tag: "Company Income Tax",
			title: "Company Income Tax: What Business Owners Should Know",
			description:
				"A comprehensive guide to CIT rates, allowable deductions, and compliance requirements for Nigerian businesses.",
			image: companyIncomeTax,
		},
	];

	return (
		<div className="bg-white min-h-screen">
			{/* ---------- HERO ---------- */}
			<div className="max-w-6xl mx-auto px-4 py-10">
				{/* Image Hero */}
				<div className="relative overflow-hidden border border-slate-200 aspect-[16/7]">
					<img
						src={taxlatorLanding}
						alt="Taxlator"
						className="absolute inset-0 w-full h-full object-cover object-bottom"
					/>
				</div>

				{/* CTA */}
				<div className="mt-6">
					<Link
						to="/calculate"
						className="block w-full rounded-xl bg-brand-800 py-6 text-center text-lg font-bold text-white hover:bg-brand-900 transition"
					>
						CALCULATE TAX
					</Link>
				</div>
			</div>

			{/* ----------HOW IT WORKS ---------- */}
			<div className="bg-slate-50 py-16">
				<div className="max-w-6xl mx-auto px-4">
					<SectionTitle
						title="How It Works?"
						subtitle="Just three steps to calculate your tax"
					/>

					<div className="mt-12 grid gap-8 md:grid-cols-3">
						{[
							{
								title: "Choose Your Tax Type",
								description:
									"Select from PAYE, Annual PIT, Freelancer, VAT, or Company Income Tax based on your needs.",
							},
							{
								title: "Enter Your Income & Deductions",
								description:
									"Input your gross income and any eligible deductions. Our tooltips guide you through each field.",
							},
							{
								title: "See Your Tax Breakdown Instantly",
								description:
									"Get instant results with detailed breakdowns showing exactly how your tax was calculated.",
							},
						].map((item, index) => (
							<div
								key={item.title}
								className="rounded-2xl border border-brand-500 bg-white px-6 py-10 text-center"
							>
								{/* Number */}
								<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-800 text-white text-lg font-semibold">
									{index + 1}
								</div>

								{/* Title */}
								<h3 className="mt-6 text-lg font-semibold text-slate-900">
									{item.title}
								</h3>

								{/* Description */}
								<p className="mt-4 text-sm text-slate-600 leading-relaxed">
									{item.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ----------LATEST TAX TIPS & UPDATES ---------- */}
			<div id="guides" className="bg-slate-100 py-14">
				<div className="max-w-6xl mx-auto px-4">
					<SectionTitle
						title="Latest Tax Tips & Updates"
						subtitle="Stay informed with helpful tax guides and insights"
					/>

					<div className="mt-12 grid gap-8 md:grid-cols-3">
						{taxGuides.map(({ title, description, image, tag }) => (
							<div
								key={title}
								className="rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-md transition"
							>
								{/* Image */}
								<div className="h-56 bg-slate-50 flex items-center justify-center">
									<img
										src={image}
										alt={title}
										className="max-h-full max-w-full object-contain"
									/>
								</div>

								{/* Text content */}
								<div className="p-6">
									{/* Tag BELOW image, BEFORE title */}
									<span className="inline-block rounded-full bg-brand-100 text-brand-800 px-3 py-1 text-xs font-semibold mb-3">
										{tag}
									</span>

									<h3 className="text-lg font-semibold text-slate-900">
										{title}
									</h3>

									<p className="mt-3 text-sm text-slate-600 leading-relaxed">
										{description}
									</p>

									<a
										href="#"
										className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-800 hover:text-brand-900"
									>
										Read More <span>→</span>
										<p className="text-gray-500 capitalize">(coming soon)</p>
									</a>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ----------ABOUT ---------- */}
			<div id="about" className="bg-slate-50 py-10">
				<div className="max-w-6xl mx-auto px-4">
					<SectionTitle
						title="About"
						subtitle="Essential facts every Nigerian taxpayer should know about us"
					/>

					<div className="mt-10 grid gap-6 md:grid-cols-2">
						{[
							{
								icon: frameArrow,
								title: "Accurate Calculations",
								description:
									"Powered by the latest tax rules, Taxlator ensures your results are correct and dependable.",
							},
							{
								icon: frameCarbon,
								title: "Instant Breakdown of Your Salary",
								description:
									"Get a clear, instant breakdown of taxes, deductions, and take-home pay.",
							},
							{
								icon: frameUser,
								title: "Perfect for Workers, Students & Businesses",
								description:
									"Whether you're employed or self-employed, Taxlator helps you stay financially informed.",
							},
							{
								icon: frameStars,
								title: "Simple, Beautiful & Easy to Use",
								description:
									"Designed to remove confusion and make tax calculations effortless.",
							},
						].map(({ icon, title, description }) => (
							<div
								key={title}
								className="flex items-center gap-5 rounded-2xl bg-white border border-brand-300 p-6"
							>
								{/* Icon – CENTERED */}
								<div className="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-800">
									<img
										src={icon}
										alt={title}
										className="w-7 h-7 object-contain"
									/>
								</div>

								{/* Text */}
								<div>
									<div className="font-semibold text-base text-slate-900">
										{title}
									</div>
									<p className="mt-2 text-sm text-slate-600 leading-relaxed">
										{description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ----------READY TO GET STARTED ---------- */}
			<div className="bg-slate-50 py-16">
				<div className="max-w-6xl mx-auto px-4">
					<div className="rounded-2xl bg-brand-800 px-6 py-14 text-center">
						<h2 className="text-2xl md:text-3xl font-semibold text-white">
							Ready to Get Started?
						</h2>

						<p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-white/90 leading-relaxed">
							Start calculating your taxes now. No signup required. Save your
							calculations by creating a free account (optional).
						</p>

						<div className="mt-8">
							<Link
								to="/calculate"
								className="inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-brand-800 hover:bg-white/90 transition"
							>
								Calculate Now
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div id="faqs" className="sr-only">
				FAQs placeholder
			</div>
		</div>
	);
}
