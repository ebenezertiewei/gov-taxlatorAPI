// src/models/vatRecordModel.js
const mongoose = require("mongoose");

const VATRecordSchema = new mongoose.Schema(
	{
		// Link to signed-up user
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// Transaction amount before VAT
		transactionAmount: {
			type: Number,
			required: true,
			min: 0,
		},

		// Calculated VAT amount
		vatAmount: {
			type: Number,
			min: 0,
		},

		// Total amount after adding/removing VAT
		totalAmount: {
			type: Number,
			min: 0,
		},

		// Type of calculation: "add" VAT to net, or "remove" VAT from gross
		calculationType: {
			type: String,
			enum: ["add", "remove"],
			required: true,
		},

		// Type of transaction
		transactionType: {
			type: String,
			enum: [
				"Domestic sale/Purchase",
				"Digital Services",
				"Export/International",
				"Exempt",
			],
			required: true,
		},

		// Optional metadata
		invoiceNumber: { type: String },
		customer: { type: String },

		// VAT rate (default 7.5%)
		rate: { type: Number, default: 0.075, min: 0, max: 1 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("VATRecord", VATRecordSchema);
