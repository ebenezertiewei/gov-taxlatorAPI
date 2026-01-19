// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import CalculateModal from "./CalculateModal";
import { useAuth } from "../state/useAuth";
import { Menu, X } from "lucide-react";

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
	const location = useLocation();
	const { authenticated, logout } = useAuth();

	const [openCalc, setOpenCalc] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const isCalculateActive =
		openCalc || location.pathname.startsWith("/calculate");

	function closeMobile() {
		setMobileOpen(false);
	}

	return (
		<>
			<header className="bg-white border-b w-full">
				<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
					{/* Logo */}
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

					{/* DESKTOP NAV */}
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

						{/* CALCULATE (MANUAL ACTIVE) */}
						<button
							onClick={() => setOpenCalc(true)}
							className={`px-3 py-2 rounded text-sm font-medium ${
								isCalculateActive
									? "text-brand-700 bg-brand-50"
									: "text-slate-700 hover:text-brand-700 hover:bg-slate-50"
							}`}
						>
							Calculate
						</button>

						{authenticated && (
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
						)}

						<NavLink
							to="/taxguide"
							className={({ isActive }) =>
								`px-3 py-2 rounded text-sm font-medium ${
									isActive
										? "text-brand-700 bg-brand-50"
										: "text-slate-700 hover:text-brand-700 hover:bg-slate-50"
								}`
							}
						>
							Tax Guides
						</NavLink>

						<NavLink
							to="/about"
							className={({ isActive }) =>
								`px-3 py-2 rounded text-sm font-medium ${
									isActive
										? "text-brand-700 bg-brand-50"
										: "text-slate-700 hover:text-brand-700 hover:bg-slate-50"
								}`
							}
						>
							About
						</NavLink>
					</nav>

					{/* MOBILE HAMBURGER */}
					<div className="flex items-center gap-2 w-full justify-end">
						{/* MOBILE HAMBURGER / CLOSE */}
						<button
							onClick={() => setMobileOpen((v) => !v)}
							className="md:hidden w-9 h-9 rounded border grid place-items-center hover:bg-slate-50"
							aria-label={mobileOpen ? "Close menu" : "Open menu"}
						>
							{mobileOpen ? (
								<X className="w-7 h-7" />
							) : (
								<Menu className="w-7 h-7" />
							)}
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

				{/* MOBILE DROPDOWN */}
				{mobileOpen && (
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
								className={`text-left text-sm font-medium px-2 py-2 rounded ${
									isCalculateActive
										? "text-brand-700 bg-brand-50"
										: "text-slate-700 hover:text-brand-700 hover:bg-slate-50"
								}`}
							>
								Calculate
							</button>

							{authenticated && (
								<NavItem to="/history" onClick={closeMobile}>
									History
								</NavItem>
							)}

							<NavItem to="/taxguide" onClick={closeMobile}>
								Tax Guides
							</NavItem>

							<NavItem to="/about" onClick={closeMobile}>
								About
							</NavItem>

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
				)}
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
