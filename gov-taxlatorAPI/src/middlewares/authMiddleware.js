// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/authModels");

const getBearerToken = (req) => {
	const header = req.headers.authorization;
	if (header && header.startsWith("Bearer ")) {
		return header.split(" ")[1];
	}

	const cookieVal = req.cookies?.Authorization;
	if (
		cookieVal &&
		typeof cookieVal === "string" &&
		cookieVal.startsWith("Bearer ")
	) {
		return cookieVal.split(" ")[1];
	}

	return null;
};

const protect = async (req, res, next) => {
	const token = getBearerToken(req);

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Not authorized",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

		const user = await User.findById(decoded.id).select("-password");
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}

		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({
			success: false,
			message: "Token invalid or expired",
		});
	}
};

module.exports = { protect };
