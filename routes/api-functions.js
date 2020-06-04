const Url = require("../models/url");

const en = require("nanoid-good/locale/en");
const hi = require("nanoid-good/locale/hi");
const nanoid = require("nanoid-good/generate")(en, hi);

const MIN_LENGTH_SHORTURL = 3;

const functions = {};

functions.isUrlValid = (url) => {
	try {
		new URL(url).host; // Just checking if this does not throw an error, coz if it does then it will produce an error
	} catch (err) {
		return { message: "Invalid URL" };
	}
	return { success: true };
};

functions.shortenUrl = (alphabet_set, length, longUrl, shortUrl) => {
	return new Promise(async (resolve, reject) => {
		if (shortUrl) {
			const exists = await Url.find({ shortUrl }).countDocuments();
			let regex = /^[A-Za-z0-9_-]+$/;
			if (!regex.test(shortUrl)) {
				return reject({ message: "Short URL can only contain: 0-9, A-Z, a-z, underscore, hiphen" });
			} else if (shortUrl.length < MIN_LENGTH_SHORTURL) {
				return reject({
					message: `Minimum length of s.dsce.in/<short-url> should be ${MIN_LENGTH_SHORTURL} characters`,
				});
			} else if (en.includes(shortUrl) || hi.includes(shortUrl) || kn.includes(shortUrl)) {
				return reject({ message: "Inappropriate Short URL" });
			} else if (exists) {
				return reject({ message: "Short URL is reserved" });
			} else {
				return resolve({ longUrl, shortUrl });
			}
		}
		while (true) {
			shortUrl = nanoid(alphabet_set, length);
			const exists = await Url.find({ shortUrl }).countDocuments();
			if (!exists) break;
		}
		resolve({ longUrl, shortUrl });
	});
};

module.exports = functions;
