// taxlator/src/state/auth.tsx
import React, { useMemo, useState } from "react";
import {
	api,
	clearToken,
	extractToken,
	getToken,
	setToken,
} from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { AuthCtx } from "./auth.context";
import type { AuthContextValue } from "./auth.context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authenticated, setAuthenticated] = useState(() => Boolean(getToken()));

	const value = useMemo<AuthContextValue>(
		() => ({
			authenticated,

			async signup(payload) {
				const { data } = await api.post(ENDPOINTS.signup, payload);
				return data;
			},

			async verifyEmail(payload) {
				const { data } = await api.post(ENDPOINTS.verifyEmail, payload);
				return data;
			},

			async sendVerificationCode(payload) {
				const { data } = await api.post(
					ENDPOINTS.sendVerificationCode,
					payload
				);
				return data;
			},

			async signin(payload) {
				const { data } = await api.post(ENDPOINTS.signin, payload);

				const token = extractToken(data);
				if (!token) {
					throw new Error("Signin succeeded but no token returned");
				}

				setToken(token);
				setAuthenticated(true);
				return data;
			},

			async signout() {
				try {
					await api.post(ENDPOINTS.signout);
				} finally {
					clearToken();
					setAuthenticated(false);
				}
			},

			logout() {
				clearToken();
				setAuthenticated(false);
			},
		}),
		[authenticated]
	);

	return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
