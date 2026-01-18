// src/pages/VerifyEmail.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type VerifyState = { email?: string };
type ApiResponse = { success?: boolean; message?: string };

const API_BASE =
	import.meta.env.VITE_API_BASE_URL || "https://gov-taxlator-api.onrender.com";

function isEmail(v: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function getErrorMessage(err: unknown) {
	return err instanceof Error
		? err.message
		: "Network error. Please try again.";
}

export default function VerifyEmail() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as VerifyState) || {};

	const [email, setEmail] = useState(state.email || "");
	const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
	const [loading, setLoading] = useState(false);

	const [resending, setResending] = useState(false);
	const [cooldown, setCooldown] = useState(0);

	const [error, setError] = useState("");
	const [info, setInfo] = useState("");

	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
	const code = useMemo(() => digits.join(""), [digits]);

	useEffect(() => {
		if (!cooldown) return;
		const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
		return () => clearInterval(t);
	}, [cooldown]);

	const setDigitAt = (idx: number, val: string) => {
		const onlyDigit = (val || "").replace(/\D/g, "").slice(-1);
		setDigits((prev) => {
			const next = [...prev];
			next[idx] = onlyDigit;
			return next;
		});
	};

	const onChange = (idx: number, val: string) => {
		setError("");
		setInfo("");
		setDigitAt(idx, val);

		const nextVal = (val || "").replace(/\D/g, "");
		if (nextVal && idx < 5) inputsRef.current[idx + 1]?.focus();
	};

	const onKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace") {
			if (digits[idx]) {
				setDigitAt(idx, "");
				return;
			}
			if (idx > 0) inputsRef.current[idx - 1]?.focus();
		}
		if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
		if (e.key === "ArrowRight" && idx < 5) inputsRef.current[idx + 1]?.focus();
	};

	const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pasted = e.clipboardData.getData("text") || "";
		const nums = pasted.replace(/\D/g, "").slice(0, 6).split("");
		if (!nums.length) return;

		e.preventDefault();
		setError("");
		setInfo("");

		setDigits((prev) => {
			const next = [...prev];
			for (let i = 0; i < 6; i++) next[i] = nums[i] || "";
			return next;
		});
		inputsRef.current[Math.min(nums.length, 6) - 1]?.focus();
	};

	const verify = async () => {
		setError("");
		setInfo("");

		const normalizedEmail = email.trim().toLowerCase();

		if (!isEmail(normalizedEmail)) {
			setError("Enter a valid email address.");
			return;
		}
		if (digits.some((d) => !d) || code.length !== 6) {
			setError("Enter the 6-digit code.");
			return;
		}

		setLoading(true);
		try {
			const resp = await fetch(`${API_BASE}/api/auth/verifyEmail`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email: normalizedEmail, code }),
			});

			const data: ApiResponse = await resp.json().catch(() => ({}));

			if (!resp.ok) {
				setError(data?.message || "Verification failed.");
				return;
			}

			setInfo(
				data?.message ||
					"Email verified successfully. Redirecting to sign in..."
			);
			setTimeout(() => navigate("/signin", { replace: true }), 800);
		} catch (e: unknown) {
			setError(getErrorMessage(e));
		} finally {
			setLoading(false);
		}
	};

	const resend = async () => {
		setError("");
		setInfo("");

		const normalizedEmail = email.trim().toLowerCase();
		if (!isEmail(normalizedEmail)) {
			setError("Enter a valid email address.");
			return;
		}
		if (cooldown > 0) return;

		setResending(true);
		try {
			const resp = await fetch(`${API_BASE}/api/auth/sendVerificationCode`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email: normalizedEmail }),
			});

			const data: ApiResponse = await resp.json().catch(() => ({}));

			if (!resp.ok) {
				setError(data?.message || "Could not resend code.");
				return;
			}

			setInfo(data?.message || "Verification code sent.");
			setCooldown(60);
		} catch (e: unknown) {
			setError(getErrorMessage(e));
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="bg-slate-200 min-h-[80vh] flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md bg-white rounded-2xl border shadow-soft overflow-hidden">
				<div className="p-6 border-b text-center">
					<div className="w-12 h-12 mx-auto rounded bg-brand-700 text-white grid place-items-center font-bold">
						T
					</div>
					<div className="mt-3 text-lg font-semibold">Verify your email</div>
					<div className="text-xs text-slate-600">
						Enter the 6-digit code sent to your inbox
					</div>
				</div>

				<form
					className="p-6"
					onSubmit={(e) => {
						e.preventDefault();
						verify();
					}}
				>
					{error && (
						<div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
							{error}
						</div>
					)}

					{info && (
						<div className="mb-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded p-2">
							{info}
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
						Verification Code
					</label>

					<div className="mt-2 flex items-center justify-between gap-2">
						{digits.map((d, idx) => (
							<input
								key={idx}
								ref={(el) => {
									inputsRef.current[idx] = el;
								}}
								className="w-12 h-12 rounded border text-center text-lg font-semibold tracking-widest"
								value={d}
								onChange={(e) => onChange(idx, e.target.value)}
								onKeyDown={(e) => onKeyDown(idx, e)}
								onPaste={idx === 0 ? onPaste : undefined}
								inputMode="numeric"
								autoComplete={idx === 0 ? "one-time-code" : "off"}
								maxLength={1}
								aria-label={`Digit ${idx + 1}`}
							/>
						))}
					</div>

					<button
						type="submit"
						disabled={loading}
						className="mt-5 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60"
					>
						{loading ? "Verifying..." : "Verify Email"}
					</button>

					<button
						type="button"
						onClick={resend}
						disabled={resending || cooldown > 0}
						className="mt-3 w-full rounded border py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
					>
						{resending
							? "Sending..."
							: cooldown > 0
							? `Resend code (${cooldown}s)`
							: "Resend code"}
					</button>

					<div className="mt-4 text-xs text-slate-600 text-center">
						Already verified?{" "}
						<Link
							className="text-brand-800 font-semibold hover:text-brand-900"
							to="/signin"
						>
							Sign in
						</Link>
					</div>

					<div className="mt-2 text-xs text-slate-600 text-center">
						Wrong email?{" "}
						<Link
							className="text-brand-800 font-semibold hover:text-brand-900"
							to="/signup"
						>
							Go back to sign up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
