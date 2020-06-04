require("dotenv").config();
const mongoose = require("mongoose");
const DB = process.env.NODE_ENV === "production" ? process.env.MONGO_URI_1 : process.env.MONGO_URI_2;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const connectDB = async () => {
	try {
		await mongoose.connect(DB, { useNewUrlParser: true });
		console.log("MongoDB connected." + DB);
	} catch (err) {
		console.log({ message: err.message, err });
		process.exit(1);
	}
};

module.exports = connectDB;
