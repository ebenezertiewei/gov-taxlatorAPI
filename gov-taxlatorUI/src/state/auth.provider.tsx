import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AuthCtx } from "./auth.context";
import type { AnyJson, SignInPayload, SignUpPayload } from "../api/types";

const API_BASE =
	import.meta.env.VITE_API_BASE_URL || "https://gov-taxlator-api.onrender.com";

axios.defaults.baseURL = API_BASE;

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authenticated, setAuthenticated] = useState<boolean>(() => {
		return !!localStorage.getItem("token");
	});

	// Keep axios Authorization header in sync with localStorage token
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
		} else {
			delete axios.defaults.headers.common.Authorization;
		}
	}, [authenticated]);

	const signin = useCallback(
		async (payload: SignInPayload): Promise<AnyJson> => {
			const res = await axios.post("/api/auth/signin", payload, {
				headers: { "Content-Type": "application/json" },
			});

			// ✅ ensure token is stored + axios header set
			if (res.data?.token) {
				localStorage.setItem("token", res.data.token);
				axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
				setAuthenticated(true);
			}

			return res.data;
		},
		[]
	);

	const signup = useCallback(
		async (payload: SignUpPayload): Promise<AnyJson> => {
			const res = await axios.post("/api/auth/signup", payload, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		[]
	);

	const verifyEmail = useCallback(
		async (payload: { email: string; code: string }): Promise<AnyJson> => {
			const res = await axios.post("/api/auth/verifyEmail", payload, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		[]
	);

	const sendVerificationCode = useCallback(
		async (payload: { email: string }): Promise<AnyJson> => {
			const res = await axios.post("/api/auth/sendVerificationCode", payload, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		[]
	);

	const signout = useCallback(async () => {
		try {
			// If you have a backend signout endpoint, keep it:
			await axios.post("/api/auth/signout", null);
		} catch {
			// ignore
		} finally {
			localStorage.removeItem("token");
			delete axios.defaults.headers.common.Authorization;
			setAuthenticated(false);
		}
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem("token");
		delete axios.defaults.headers.common.Authorization;
		setAuthenticated(false);
	}, []);

	const value = useMemo(
		() => ({
			authenticated,
			signin,
			signup,
			verifyEmail,
			sendVerificationCode,
			signout,
			logout,
		}),
		[
			authenticated,
			signin,
			signup,
			verifyEmail,
			sendVerificationCode,
			signout,
			logout,
		]
	);

	return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
