// taxlator/src/api/client.ts
import axios from "axios";
import type { AnyJson } from "./types";

const API_BASE =
	import.meta.env.VITE_API_BASE_URL || "https://gov-taxlator-api.onrender.com";

const TOKEN_KEY = "taxlator_token";

export function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
	localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
	localStorage.removeItem(TOKEN_KEY);
}

export function extractToken(data: AnyJson): string | null {
	const token = (data as { token?: string })?.token;
	return typeof token === "string" && token.length > 10 ? token : null;
}

export const api = axios.create({
	baseURL: API_BASE,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

// ✅ automatically attach token to every request
api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers = config.headers ?? {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
