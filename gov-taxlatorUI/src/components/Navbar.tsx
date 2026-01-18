import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CalculateModal from "./CalculateModal";
import { useAuth } from "../state/useAuth";

function NavItem({
	to,
	children,
	onClick,
}: {
	to: string;
	children: React.ReactNode;
	onClick?: () => void;
}) {
	return (
		<NavLink
			to={to}
			onClick={onClick}
			className={({ isActive }) =>
				`block text-sm font-medium px-2 py-2 rounded ${
					isActive
						? "text-brand-700 bg-brand-50"
						: "text-slate-700 hover:text-brand-700 hover:bg-slate-50"
				}`
			}
		>
			{children}
		</NavLink>
	);
}

export default function Navbar() {
	const navigate = useNavigate();
	const { authenticated, logout } = useAuth();

	const [openCalc, setOpenCalc] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	function closeMobile() {
		setMobileOpen(false);
	}

	return (
		<>
			<header className="bg-white border-b">
				<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
					<Link to="/" className="flex items-center gap-2 shrink-0">
						<div className="w-9 h-9 rounded bg-brand-700 text-white grid place-items-center font-bold">
							T
						</div>
						<div className="leading-tight">
							<div className="text-sm font-semibold">TAXLATOR</div>
							<div className="text-[11px] text-slate-500 -mt-0.5">
								Nigeria Tax Tools
							</div>
						</div>
					</Link>

					{/* Desktop nav */}
					<nav className="hidden md:flex items-center gap-2">
						<NavLink
							to="/"
							className={({ isActive }) =>
								`px-3 py-2 rounded text-sm font-medium ${
									isActive
										? "text-brand-700 bg-brand-50"
										: "text-slate-700 hover:text-brand-700 hover:bg-slate-50"
								}`
							}
						>
							Home
						</NavLink>

						<button
							onClick={() => setOpenCalc(true)}
							className="px-3 py-2 rounded text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50"
						>
							Calculate
						</button>

						{/* NEW: History */}
						<NavLink
							to="/history"
							className={({ isActive }) =>
								`px-3 py-2 rounded text-sm font-medium ${
									isActive
										? "text-brand-700 bg-brand-50"
										: "text-slate-700 hover:text-brand-700 hover:bg-slate-50"
								}`
							}
						>
							History
						</NavLink>

						<a
							className="px-3 py-2 rounded text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50"
							href="/taxguide"
						>
							Tax Guides
						</a>
						<a
							className="px-3 py-2 rounded text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50"
							href="/about"
						>
							About
						</a>
						<a
							className="px-3 py-2 rounded text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50"
							href="/Privacy_Policy"
						>
							Privacy Policy
						</a>
						<a
							className="px-3 py-2 rounded text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50"
							href="/Terms_Conditions"
						>
							TERMS & CONDITIONS
						</a>
					</nav>

					{/* Right controls */}
					<div className="flex items-center gap-2">
						{/* Mobile hamburger */}
						<button
							onClick={() => setMobileOpen((v) => !v)}
							className="md:hidden w-10 h-10 rounded border grid place-items-center hover:bg-slate-50"
							aria-label="Open menu"
						>
							☰
						</button>

						{!authenticated ? (
							<button
								onClick={() => navigate("/signin")}
								className="hidden sm:inline-flex px-3 py-2 rounded border text-sm hover:bg-slate-50"
							>
								Login
							</button>
						) : (
							<button
								onClick={logout}
								className="hidden sm:inline-flex px-3 py-2 rounded border text-sm hover:bg-slate-50"
							>
								Logout
							</button>
						)}
					</div>
				</div>

				{/* Mobile dropdown */}
				{mobileOpen ? (
					<div className="md:hidden border-t bg-white">
						<div className="max-w-6xl mx-auto px-4 py-3 grid gap-1">
							<NavItem to="/" onClick={closeMobile}>
								Home
							</NavItem>

							<button
								onClick={() => {
									closeMobile();
									setOpenCalc(true);
								}}
								className="text-left text-sm font-medium px-2 py-2 rounded text-slate-700 hover:text-brand-700 hover:bg-slate-50"
							>
								Calculate
							</button>

							<NavItem to="/history" onClick={closeMobile}>
								History
							</NavItem>

							<a
								className="block text-sm font-medium px-2 py-2 rounded text-slate-700 hover:text-brand-700 hover:bg-slate-50"
								href="/#guides"
								onClick={closeMobile}
							>
								Tax Guides
							</a>
							<a
								className="block text-sm font-medium px-2 py-2 rounded text-slate-700 hover:text-brand-700 hover:bg-slate-50"
								href="/#about"
								onClick={closeMobile}
							>
								About
							</a>
							<a
								className="block text-sm font-medium px-2 py-2 rounded text-slate-700 hover:text-brand-700 hover:bg-slate-50"
								href="/#faqs"
								onClick={closeMobile}
							>
								FAQs
							</a>

							<div className="pt-2 border-t mt-2">
								{!authenticated ? (
									<button
										onClick={() => {
											closeMobile();
											navigate("/signin");
										}}
										className="w-full px-3 py-2 rounded border text-sm hover:bg-slate-50"
									>
										Login
									</button>
								) : (
									<button
										onClick={() => {
											closeMobile();
											logout();
										}}
										className="w-full px-3 py-2 rounded border text-sm hover:bg-slate-50"
									>
										Logout
									</button>
								)}
							</div>
						</div>
					</div>
				) : null}
			</header>

			<CalculateModal
				open={openCalc}
				onClose={() => setOpenCalc(false)}
				onPick={(path) => {
					setOpenCalc(false);
					navigate(path);
				}}
			/>
		</>
	);
}
