// src/controllers/history.controller.js
import History from "../models/History.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";

/* ================= EXPORT CSV ================= */
export const exportCSV = async (req, res) => {
	try {
		const items = await History.find({ userId: req.user._id }).sort({
			createdAt: -1,
		});

		const parser = new Parser();
		const csv = parser.parse(items);

		res.header("Content-Type", "text/csv");
		res.attachment("history.csv");
		return res.send(csv);
	} catch (err) {
		console.error("CSV export error:", err);
		res.status(500).json({ message: "Failed to export CSV" });
	}
};

/* ================= EXPORT PDF ================= */
export const exportPDF = async (req, res) => {
	try {
		const items = await History.find({ userId: req.user._id }).sort({
			createdAt: -1,
		});

		const doc = new PDFDocument();
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", 'attachment; filename="history.pdf"');

		doc.pipe(res);
		doc.fontSize(18).text("History Export", { underline: true });
		doc.moveDown();

		items.forEach((item) => {
			doc
				.fontSize(12)
				.text(
					`${item.type} | ${item.createdAt.toISOString()}\nInput: ${JSON.stringify(
						item.input,
					)}\nResult: ${JSON.stringify(item.result)}\n`,
				);
			doc.moveDown();
		});

		doc.end();
	} catch (err) {
		console.error("PDF export error:", err);
		res.status(500).json({ message: "Failed to export PDF" });
	}
};
