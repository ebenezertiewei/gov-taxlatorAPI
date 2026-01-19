// src/services/history.service.js
const History = require("../models/History");

async function saveHistory({ userId, type, input, result }) {
	if (!userId) return; // guest users → no history

	try {
		await History.create({
			userId,
			type,
			input,
			result,
		});
	} catch (err) {
		console.error("History save failed:", err);
		// Do NOT throw — history failure should not break calculation
	}
}

module.exports = { saveHistory };
