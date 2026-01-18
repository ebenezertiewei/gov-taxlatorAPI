import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/useAuth";
import axios from "axios";

export default function SignUp() {
	const { signup } = useAuth();
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [showPassword, setShowPassword] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setBusy(true);

		try {
			// Signup already sends a verification code in your backend.
			// So you do NOT need to call sendVerificationCode here.
			await signup({ firstName, lastName, email, password });

			// Redirect user to verify page with email prefilled
			navigate("/verify-email", { state: { email } });
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || "Signup failed");
			} else {
				setError("Signup failed");
			}
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="bg-slate-200 min-h-[80vh] flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md bg-white rounded-2xl border shadow-soft overflow-hidden">
				<div className="p-6 border-b text-center">
					<div className="w-12 h-12 mx-auto rounded bg-brand-700 text-white grid place-items-center font-bold">
						T
					</div>
					<div className="mt-3 text-lg font-semibold">Sign Up</div>
					<div className="text-xs text-slate-600">
						Create your free Taxlator account
					</div>
				</div>

				<form className="p-6" onSubmit={onSubmit}>
					{error && (
						<div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
							{error}
						</div>
					)}

					<label className="text-xs font-semibold text-slate-700">
						First Name
					</label>
					<input
						className="mt-1 w-full rounded border px-3 py-2 text-sm"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						placeholder="Enter first name"
						required
					/>

					<label className="text-xs font-semibold text-slate-700 mt-3 block">
						Last Name
					</label>
					<input
						className="mt-1 w-full rounded border px-3 py-2 text-sm"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						placeholder="Enter last name"
						required
					/>

					<label className="text-xs font-semibold text-slate-700 mt-4 block">
						Email Address
					</label>
					<input
						className="mt-1 w-full rounded border px-3 py-2 text-sm"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						required
					/>

					<label className="text-xs font-semibold text-slate-700 mt-4 block">
						Password
					</label>

					{/* 🔐 PASSWORD WITH TOGGLE */}
					<div className="relative mt-1">
						<input
							className="w-full rounded border px-3 py-2 pr-10 text-sm"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							required
						/>

						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
							className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? "🙈" : "👁"}
						</button>
					</div>

					<button
						disabled={busy}
						className="mt-5 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60"
					>
						{busy ? "Creating..." : "Sign Up"}
					</button>

					<div className="mt-4 text-xs text-slate-600 text-center">
						Already have an account?{" "}
						<Link
							className="text-brand-800 font-semibold hover:text-brand-900"
							to="/signin"
						>
							Sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
