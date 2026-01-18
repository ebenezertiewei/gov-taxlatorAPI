// src/models/taxRecordModel.js
const mongoose = require("mongoose");

const TaxRecordSchema = new mongoose.Schema(
	{
		// Link to signed-up user
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Type of tax: PAYE/PIT, FREELANCER, CIT
		taxType: {
			type: String,
			enum: ["PAYE/PIT", "FREELANCER", "CIT"],
			required: true,
			index: true,
		},

		// ----------------
		// PAYE/PIT & FREELANCER
		// ----------------
		grossIncome: {
			type: Number,
			min: 0,
			required: function () {
				return this.taxType !== "CIT";
			},
		},
		rentRelief: {
			type: Number,
			min: 0,
			default: 0,
		},
		otherDeductions: {
			type: Number,
			min: 0,
			default: 0,
		},
		pension: {
			type: Boolean,
			default: true,
		},
		expenses: {
			type: Number,
			min: 0,
			required: function () {
				return this.taxType === "FREELANCER";
			},
		},
		frequency: {
			type: String,
			enum: ["monthly", "annual"],
			default: "annual",
		},

		// ----------------
		// CIT-specific
		// ----------------
		revenue: {
			type: Number,
			min: 0,
			required: function () {
				return this.taxType === "CIT";
			},
		},
		companySize: {
			type: String,
			enum: ["SMALL", "MEDIUM", "LARGE"],
			required: function () {
				return this.taxType === "CIT";
			},
		},
		profit: {
			type: Number,
			required: function () {
				return this.taxType === "CIT";
			},
		},

		// ----------------
		// Computed / Result fields
		// ----------------
		taxableIncome: {
			type: Number,
			min: 0,
		},
		taxAmount: {
			type: Number,
			min: 0,
		},
		effectiveTaxRate: {
			type: Number,
			min: 0,
			max: 1,
		},

		// Optional notes for record keeping
		notes: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("TaxRecord", TaxRecordSchema);
