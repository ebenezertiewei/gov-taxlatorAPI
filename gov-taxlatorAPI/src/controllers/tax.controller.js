// src/controllers/tax.controller.js
const Joi = require("joi");
const payeService = require("../services/payePit.service");
const freelancerService = require("../services/freelancer.service");
const citService = require("../services/cit.service");
const { saveHistory } = require("../services/history.service");

// Validation
const taxRequestSchema = Joi.object({
	taxType: Joi.string().valid("PAYE/PIT", "FREELANCER", "CIT").required(),
	grossIncome: Joi.number().positive().optional(),
	rentRelief: Joi.number().min(0).precision(2).optional(),
	otherDeductions: Joi.number().min(0).precision(2).optional(),
	frequency: Joi.string().valid("monthly", "annual").default("annual"),
	pension: Joi.number().min(0).optional(),
	expenses: Joi.number().min(0).optional(),
	businessExpenses: Joi.number().min(0).optional(),
	companySize: Joi.string().valid("SMALL", "MEDIUM", "LARGE").optional(),
	revenue: Joi.number().positive().optional(),
})
	.unknown(false)
	.custom((value, helpers) => {
		if (value.taxType === "CIT") {
			if (!value.revenue)
				return helpers.error("any.custom", "revenue is required for CIT");
			if (!value.companySize)
				return helpers.error("any.custom", "companySize is required for CIT");
			if (value.expenses && value.expenses > value.revenue)
				return helpers.error("any.custom", "expenses cannot exceed revenue");
		}
		return value;
	});

// Controller
exports.calculateTax = async (req, res, next) => {
	try {
		const { value, error } = taxRequestSchema.validate(req.body);

		if (error) {
			return res
				.status(400)
				.json({ success: false, error: error.details[0].message });
		}

		// Normalize field for CIT expenses
		if (
			value.taxType === "CIT" &&
			value.expenses == null &&
			value.businessExpenses != null
		) {
			value.expenses = value.businessExpenses;
			delete value.businessExpenses;
		}

		let result;
		switch (value.taxType) {
			case "PAYE/PIT":
				result = await payeService.calculatePAYE(value);
				break;
			case "FREELANCER":
				result = await freelancerService.calculateFreelancerTax(value);
				break;
			case "CIT":
				result = await citService.calculateCIT(value);
				break;
			default:
				return res
					.status(400)
					.json({ success: false, error: "Unsupported tax type" });
		}

		// Save history for authenticated users
		if (req.user) {
			await saveHistory({
				userId: req.user._id,
				type: value.taxType,
				input: value,
				result,
			});
		}

		res.status(200).json({ success: true, data: result });
	} catch (err) {
		next(err);
	}
};
