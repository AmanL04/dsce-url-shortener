const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const urlSchema = new Schema(
	{
		longUrl: { type: String, required: "Long Url is required, i.e, original URL." },
		shortUrl: { type: String, unique: true, required: "Short Url is required, i.e, shortened URL." },
		removable: { type: Boolean, default: false },
		password: { type: String },
		description: { type: String },
		searchedTimes: [{ type: Date }],
		viewedTimes: [{ type: Date }],
	},
	{ collection: "urls", strict: true, versionKey: false }
);

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
