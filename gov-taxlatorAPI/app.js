// src/app.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

/* ================= ROUTES ================= */
const authRoutes = require("./src/routers/auth.routes");
const historyRoutes = require("./src/routers/history.routes");
const taxRoutes = require("./src/routers/tax.routes");
const vatRoutes = require("./src/routers/vat.routes");

const app = express();

/**
 * CORS
 * - In production: allow CLIENT_URL
 * - Optionally allow localhost in production when ALLOW_LOCALHOST_CORS=true
 * - In development: allow localhost origins
 */
const isProd = process.env.NODE_ENV === "production";
const allowLocalhostInProd = process.env.ALLOW_LOCALHOST_CORS === "true";

const localOrigins = [
	"http://localhost:5173",
	"http://localhost:3000",
	"http://localhost:8000",
	"http://192.168.0.3:5173",
];

const allowedOrigins = [
	...(isProd ? [process.env.CLIENT_URL].filter(Boolean) : localOrigins),
	...(isProd && allowLocalhostInProd ? localOrigins : []),
];

app.use(
	cors({
		origin: (origin, cb) => {
			if (!origin) return cb(null, true); // Postman / curl

			if (allowedOrigins.includes(origin)) {
				return cb(null, true);
			}

			return cb(null, false);
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

/* ================= MIDDLEWARES ================= */
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* ================= DOCS ================= */
app.use("/docs", express.static(path.join(__dirname, "/public/docs")));

/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/vat", vatRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

/* ================= OAUTH CALLBACK ================= */
app.get("/oauth2callback", (req, res) => {
	const { code, error } = req.query;

	if (error) {
		return res.status(400).send(`OAuth error: ${error}`);
	}

	if (!code) {
		return res.status(400).send("Missing ?code= in callback URL.");
	}

	return res
		.status(200)
		.send(
			"Authorization received. Copy the code from the URL and paste it into your terminal.",
		);
});

/* ================= ROOT ================= */
app.get("/", (req, res) => {
	res.send(
		"✅ Gov-Taxlator API running. Routes: /api/auth, /api/history, /api/tax, /api/vat, /health",
	);
});

/* ================= ERROR HANDLING ================= */
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
});

module.exports = app;
