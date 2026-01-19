// src/controllers/history.controller.js
const History = require("../models/History");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

/* ================= EXPORT HISTORY ================= */
exports.exportHistory = async (req, res) => {
	try {
		const userId = req.user._id;
		const format = req.query.format || "csv";

		const items = await History.find({ userId }).sort({ createdAt: -1 });

		if (format === "csv") {
			const fields = ["type", "createdAt", "input", "result"];

			const parser = new Parser({ fields });
			const csv = parser.parse(
				items.map((i) => ({
					...i.toObject(),
					input: JSON.stringify(i.input),
					result: JSON.stringify(i.result),
				})),
			);

			res.header("Content-Type", "text/csv");
			res.attachment("tax-history.csv");
			return res.send(csv);
		}

		if (format === "pdf") {
			const doc = new PDFDocument({ margin: 40 });
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				"attachment; filename=tax-history.pdf",
			);

			doc.pipe(res);

			doc.fontSize(18).text("Taxlator – History Export", { align: "center" });
			doc.moveDown();

			items.forEach((item, idx) => {
				doc.fontSize(12).text(`${idx + 1}. ${item.type}`, { underline: true });
				doc.fontSize(10).text(`Date: ${item.createdAt}`);
				doc.text(`Input: ${JSON.stringify(item.input, null, 2)}`);
				doc.text(`Result: ${JSON.stringify(item.result, null, 2)}`);
				doc.moveDown();
			});

			doc.end();
			return;
		}

		return res.status(400).json({ message: "Invalid export format" });
	} catch (err) {
		console.error("Export history error:", err);
		res.status(500).json({ message: "Failed to export history" });
	}
};
