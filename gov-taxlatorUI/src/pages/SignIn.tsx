import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth.context";
import axios from "axios";

type SigninResponse = {
	success?: boolean;
	message?: string;
	token?: string;
};

export default function SignIn() {
	const { signin } = useAuth();
	const navigate = useNavigate();

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
			// ✅ capture response so we can store token
			const data = (await signin({ email, password })) as SigninResponse;

			// ✅ store JWT for Authorization header usage in other requests
			if (data?.token) {
				localStorage.setItem("token", data.token);
			}

			navigate("/calculate");
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message ?? "Signin failed");
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Signin failed");
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
					<div className="mt-3 text-lg font-semibold">Welcome back!</div>
					<div className="text-xs text-slate-600">Sign in to your account</div>
				</div>

				<form className="p-6" onSubmit={onSubmit}>
					{error && (
						<div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
							{error}
						</div>
					)}

					<label className="text-xs font-semibold text-slate-700">Email</label>
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
						{busy ? "Signing in..." : "Sign In"}
					</button>

					<div className="mt-4 text-xs text-slate-600 text-center">
						Don&apos;t have an account?{" "}
						<Link
							className="text-brand-800 font-semibold hover:text-brand-900"
							to="/signup"
						>
							Sign up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
