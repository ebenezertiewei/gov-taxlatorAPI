// src/pages/History.tsx
import { useEffect, useState } from "react";
import { api } from "../api/client"; // Axios or fetch wrapper
import { type HistoryItem } from "../api/types";

function typeLabel(t: HistoryItem["type"]) {
	switch (t) {
		case "PAYE/PIT":
			return "PAYE / PIT";
		case "VAT":
			return "VAT";
		case "FREELANCER":
			return "Freelancer";
		case "CIT":
			return "Company Income Tax";
		default:
			return t;
	}
}

export default function History() {
	const user = null;
	const [items, setItems] = useState<HistoryItem[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return; // no user → no history

		const fetchHistory = async () => {
			const res = await api.get("/history");
			setItems(res.data);
		};

		fetchHistory();
	}, [user]);

	// Use _id instead of id
	const selected = items.find((x) => x._id === selectedId) ?? null;

	const clearAll = async () => {
		if (!user) return;
		await api.delete("/history");
		setItems([]);
		setSelectedId(null);
	};

	return (
		<div className="bg-slate-100 min-h-[80vh] px-4 py-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-start justify-between gap-3 flex-col sm:flex-row">
					<div>
						<div className="text-xl font-semibold text-slate-900">History</div>
						<div className="text-sm text-slate-600 mt-1">
							{user
								? "Saved calculations for your account."
								: "Sign in to view history."}
						</div>
					</div>

					{user && (
						<button
							onClick={clearAll}
							className="px-3 py-2 rounded border text-sm bg-white hover:bg-slate-50"
						>
							Clear History
						</button>
					)}
				</div>

				{user && (
					<div className="mt-6 grid lg:grid-cols-2 gap-4">
						<div className="bg-white border rounded-2xl shadow-soft overflow-hidden">
							<div className="px-4 py-3 border-b font-semibold text-sm">
								Recent Calculations
							</div>
							{items.length === 0 ? (
								<div className="p-4 text-sm text-slate-600">
									No history yet.
								</div>
							) : (
								<div className="divide-y">
									{items.map((it) =>
										it._id ? ( // guard for optional _id
											<button
												key={it._id}
												onClick={() => setSelectedId(it._id!)} // non-null assertion
												className={`w-full text-left p-4 hover:bg-slate-50 ${
													selectedId === it._id ? "bg-slate-50" : "bg-white"
												}`}
											>
												<div className="flex items-center justify-between gap-3">
													<div className="text-sm font-semibold">
														{typeLabel(it.type)}
													</div>
													<div className="text-xs text-slate-500">
														{new Date(it.createdAt).toLocaleString()}
													</div>
												</div>
											</button>
										) : null,
									)}
								</div>
							)}
						</div>

						<div className="bg-white border rounded-2xl shadow-soft overflow-hidden">
							<div className="px-4 py-3 border-b font-semibold text-sm">
								Details
							</div>
							{!selected ? (
								<div className="p-4 text-sm text-slate-600">
									Select an item to view details.
								</div>
							) : (
								<div className="p-4">
									<div className="text-sm font-semibold">
										{typeLabel(selected.type)}
									</div>
									<div className="text-xs text-slate-500 mt-1">
										{new Date(selected.createdAt).toLocaleString()}
									</div>
									<div className="mt-4">
										<div className="text-xs font-semibold text-slate-700">
											Input
										</div>
										<pre className="mt-1 text-xs bg-slate-50 border rounded p-3 overflow-auto">
											{JSON.stringify(selected.input, null, 2)}
										</pre>
									</div>
									<div className="mt-4">
										<div className="text-xs font-semibold text-slate-700">
											Result
										</div>
										<pre className="mt-1 text-xs bg-slate-50 border rounded p-3 overflow-auto">
											{JSON.stringify(selected.result, null, 2)}
										</pre>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
