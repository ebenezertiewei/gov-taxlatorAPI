// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth.context";

/* ================= TYPES ================= */
export type UserProfile = {
	firstName: string;
	lastName: string;
	email: string;
	avatarUrl?: string | null;
	language: string;
	theme: "Light" | "Dark";
	notifications: boolean;
};

export default function Profile() {
	const { signout } = useAuth(); // ✅ removed `user`
	const navigate = useNavigate();
	const [profile, setProfile] = useState<UserProfile | null>(null);

	useEffect(() => {
		api.get("/profile").then((res) => setProfile(res.data));
	}, []);

	if (!profile) return null;

	return (
		<div className="bg-slate-200 min-h-[80vh] px-4 py-8">
			<div className="max-w-2xl mx-auto space-y-6">
				{/* Profile Card */}
				<div className="bg-white rounded-2xl border shadow-soft p-6 text-center">
					<img
						src={profile.avatarUrl ?? "/avatar.png"}
						className="w-24 h-24 mx-auto rounded-full object-cover"
						alt="Profile avatar"
					/>
					<h2 className="mt-4 text-2xl font-bold text-brand-800">
						Hi, {profile.firstName}
					</h2>
					<p className="text-slate-500 text-sm">{profile.email}</p>

					<button
						onClick={() => navigate("/edit-profile")}
						className="mt-4 px-6 py-2 border rounded-full text-sm font-semibold"
					>
						Edit Profile
					</button>
				</div>

				{/* Settings */}
				<div>
					<h3 className="text-xl font-bold text-brand-800 mb-3">Settings</h3>

					<div className="space-y-2">
						<SettingRow label="Language" value={profile.language} />
						<SettingRow label="Theme" value={profile.theme} />
						<SettingRow
							label="Notifications"
							value={profile.notifications ? "Enabled" : "Disabled"}
						/>
						<NavRow label="Saved Tax Records" to="/history" />
						<NavRow label="Security & Privacy" to="/privacy-policy" />
						<NavRow label="Terms and conditions" to="/terms" />
					</div>
				</div>

				<button
					onClick={signout}
					className="w-full rounded bg-red-600 text-white py-2 text-sm font-semibold"
				>
					Sign out
				</button>
			</div>
		</div>
	);
}

function SettingRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="bg-white rounded border px-4 py-3 flex justify-between">
			<span>{label}</span>
			<span className="text-slate-400">{value}</span>
		</div>
	);
}

function NavRow({ label, to }: { label: string; to: string }) {
	const navigate = useNavigate();
	return (
		<button
			onClick={() => navigate(to)}
			className="bg-white rounded border px-4 py-3 w-full text-left"
		>
			{label}
		</button>
	);
}
