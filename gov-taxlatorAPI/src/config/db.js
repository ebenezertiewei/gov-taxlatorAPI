const mongoose = require("mongoose");
const { mongoURI } = require("./env");

const connectDB = async () => {
	try {
		await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ MongoDB connected successfully");
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error.message);
		process.exit(1); // Stop server if DB fails
	}
};

module.exports = connectDB;
