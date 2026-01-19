// src/routers/history.routes.js
import express from "express";
import History from "../models/History.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { exportCSV, exportPDF } from "../controllers/history.controller.js";

const router = express.Router();

/* ================= EXPORT ================= */
router.get("/export/csv", authMiddleware, exportCSV);
router.get("/export/pdf", authMiddleware, exportPDF);

/* ================= GET USER HISTORY (PAGINATED) ================= */
router.get("/", authMiddleware, async (req, res) => {
	try {
		const userId = req.user._id;
		const limit = Math.min(Number(req.query.limit) || 10, 50);
		const cursor = req.query.cursor;

		const query = { userId };

		if (cursor) {
			query.createdAt = { $lt: new Date(cursor) };
		}

		const items = await History.find(query)
			.sort({ createdAt: -1 })
			.limit(limit + 1);

		const hasNext = items.length > limit;
		const sliced = hasNext ? items.slice(0, limit) : items;

		const nextCursor = hasNext ? sliced[sliced.length - 1].createdAt : null;

		res.json({
			items: sliced,
			nextCursor,
		});
	} catch (err) {
		console.error("Fetch history error:", err);
		res.status(500).json({ message: "Failed to fetch history" });
	}
});

/* ================= ADD HISTORY ITEM ================= */
router.post("/", authMiddleware, async (req, res) => {
	try {
		const { type, input, result } = req.body;
		const userId = req.user._id;

		const newItem = new History({
			userId,
			type,
			input,
			result,
		});

		await newItem.save();
		res.json(newItem);
	} catch (err) {
		console.error("Add history error:", err);
		res.status(500).json({ message: "Failed to save history" });
	}
});

/* ================= CLEAR HISTORY ================= */
router.delete("/", authMiddleware, async (req, res) => {
	try {
		const userId = req.user._id;
		await History.deleteMany({ userId });
		res.json({ message: "History cleared" });
	} catch (err) {
		console.error("Clear history error:", err);
		res.status(500).json({ message: "Failed to clear history" });
	}
});

export default router;
