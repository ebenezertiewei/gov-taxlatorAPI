const dotenv = require("dotenv");

dotenv.config();

module.exports = {
	port: process.env.PORT || 8000,
	mongoURI: process.env.MONGO_URI,
	nodeEnv: process.env.NODE_ENV || "development",
};
