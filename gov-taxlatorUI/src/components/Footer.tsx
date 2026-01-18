// taxlator/src/components/Footer.tsx

import {
	FaFacebookF,
	FaInstagram,
	FaLinkedinIn,
	FaXTwitter,
} from "react-icons/fa6";
import { FaApple, FaAndroid } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-white border-t">
			<div className="max-w-6xl mx-auto px-4 py-10">
				<div className="flex flex-row justify-between gap-8">
					{/* Copyright */}
					<div className="text-sm text-slate-600">
						<p>© {new Date().getFullYear()} Taxlator.</p>
						<p>For informational purposes only.</p>
					</div>

					{/* About */}
					<div className="space-y-2 text-sm text-slate-700">
						<a href="/about" className="block hover:text-brand-700">
							About Us
						</a>
						<a href="/Privacy_Policy" className="block hover:text-brand-700">
							Privacy Policy
						</a>
						<a href="/feedback" className="block hover:text-brand-700">
							Feedback
						</a>
					</div>

					{/* Help */}
					<div className="space-y-2 text-sm text-slate-700">
						<a href="/#help" className="block hover:text-brand-700">
							Help
						</a>
						<a href="/Terms_Conditions" className="block hover:text-brand-700">
							Terms of Service
						</a>
						<a href="/#security" className="block hover:text-brand-700">
							Trust, Safety and Security
						</a>
					</div>

					{/* Social */}
					<div>
						<p className="mb-2 text-sm font-medium text-slate-800">
							Follow Us:
						</p>
						<div className="flex items-center gap-4 text-slate-700">
							<FaFacebookF className="h-4 w-4 cursor-pointer hover:text-brand-700" />
							<FaInstagram className="h-4 w-4 cursor-pointer hover:text-brand-700" />
							<FaLinkedinIn className="h-4 w-4 cursor-pointer hover:text-brand-700" />
							<FaXTwitter className="h-4 w-4 cursor-pointer hover:text-brand-700" />
						</div>
					</div>

					{/* Mobile App */}
					<div>
						<p className="mb-2 text-sm font-medium text-slate-800">
							Mobile App:
						</p>
						<div className="flex items-center gap-4 text-slate-700">
							<a
								href="https://expo.dev/artifacts/eas/jM6QDqM63Hut7M4nfUB9Rf.apk"
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaAndroid className="h-5 w-5 cursor-pointer hover:text-brand-700" />
							</a>

							<FaApple className="h-5 w-5 cursor-pointer hover:text-brand-700" />
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
