// src/controllers/authController.js
import jwt from "jsonwebtoken";
import { signupSchema, signinSchema } from "../middlewares/authValidator.js";
import User from "../models/authModels.js";
import { doHash, doHashValidation } from "../utils/hashing.js";
import { sendGmail } from "../services/gmailApiMailer.js";

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	try {
		const { error } = signupSchema.validate({
			firstName,
			lastName,
			email,
			password,
		});
		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}

		const normalizedEmail = email.trim().toLowerCase();

		const existingUser = await User.findOne({ email: normalizedEmail });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		const hashedPassword = await doHash(password, 12);
		const code = Math.floor(100000 + Math.random() * 900000).toString();

		await User.create({
			firstName,
			lastName,
			email: normalizedEmail,
			password: hashedPassword,
			verificationCode: code,
			verificationExpires: Date.now() + 15 * 60 * 1000,
			verified: false,
		});

		await sendGmail({
			to: normalizedEmail,
			subject: "Verify your email",
			text: `Your verification code is ${code}`,
			html: `
				<p>Hello ${firstName},</p>
				<p>Your verification code is:</p>
				<h2>${code}</h2>
				<p>This code expires in 15 minutes.</p>
			`,
		});

		return res.status(201).json({
			success: true,
			message: "Signup successful. Check your email.",
		});
	} catch (err) {
		console.error("Signup error:", err);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

/* ================= SEND VERIFICATION CODE ================= */
const sendVerificationCode = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({
			success: false,
			message: "Email is required",
		});
	}

	const normalizedEmail = email.trim().toLowerCase();

	const user = await User.findOne({ email: normalizedEmail });
	if (!user || user.verified) {
		return res.status(400).json({
			success: false,
			message: "Invalid user",
		});
	}

	const code = Math.floor(100000 + Math.random() * 900000).toString();
	user.verificationCode = code;
	user.verificationExpires = Date.now() + 15 * 60 * 1000;
	await user.save();

	await sendGmail({
		to: user.email,
		subject: "Verification Code",
		text: `Your verification code is ${code}`,
		html: `
			<p>Your verification code is:</p>
			<h2>${code}</h2>
			<p>This code expires in 15 minutes.</p>
		`,
	});

	return res.json({ success: true });
};

/* ================= VERIFY EMAIL ================= */
const verifyEmail = async (req, res) => {
	const { email, code } = req.body;

	const user = await User.findOne({ email: email.toLowerCase() }).select(
		"+verificationCode +verificationExpires",
	);

	if (
		!user ||
		user.verified ||
		user.verificationCode !== code ||
		user.verificationExpires < Date.now()
	) {
		return res.status(400).json({
			success: false,
			message: "Invalid or expired code",
		});
	}

	user.verified = true;
	user.verificationCode = undefined;
	user.verificationExpires = undefined;
	await user.save();

	return res.json({ success: true });
};

/* ================= SIGNIN ================= */
const signin = async (req, res) => {
	const { email, password } = req.body;

	const { error } = signinSchema.validate({ email, password });
	if (error) {
		return res.status(400).json({
			success: false,
			message: error.details[0].message,
		});
	}

	const user = await User.findOne({ email: email.toLowerCase() }).select(
		"+password",
	);

	if (!user || !(await doHashValidation(password, user.password))) {
		return res.status(401).json({
			success: false,
			message: "Invalid credentials",
		});
	}

	if (!user.verified) {
		return res.status(403).json({
			success: false,
			message: "Email not verified",
		});
	}

	const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
		expiresIn: "1h",
	});

	return res.json({ success: true, token });
};

/* ================= ME ================= */
const me = async (req, res) => {
	return res.json({
		success: true,
		user: req.user,
	});
};

/* ================= CHANGE PASSWORD ================= */
const changePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;

	const user = await User.findById(req.user.id).select("+password");

	if (!(await doHashValidation(currentPassword, user.password))) {
		return res.status(400).json({
			success: false,
			message: "Incorrect password",
		});
	}

	user.password = await doHash(newPassword, 12);
	await user.save();

	return res.json({ success: true });
};

/* ================= SIGNOUT ================= */
const signout = async (req, res) => {
	res.clearCookie("Authorization");
	return res.json({ success: true });
};

/* ================= EXPORTS ================= */
export {
	signup,
	signin,
	verifyEmail,
	sendVerificationCode,
	me,
	changePassword,
	signout,
};
