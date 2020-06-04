const router = require("express").Router();
const console = require("tracer").colorConsole({
	format: ['\n{{file}}:{{line}}\nData logged: "{{message}}"\n'],
});
const Url = require("../models/url");
const functions = require("./api-functions");
const DEFAULT_ALPHABET_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
const DEFAULT_LENGTH = 8;
const MIN_LENGTH_SHORTURL = 3;

router.post("/new", async (req, res) => {
	const longUrl = req.body.longUrl;
	const shortUrl = req.body.shortUrl;
	const password = req.body.password;
	const length = req.body.default_length || DEFAULT_LENGTH;
	const alphabet_set = req.body.alphabet_set || DEFAULT_ALPHABET_SET;

	try {
		if (!longUrl) return res.json({ error: "No URL sent" });
		const validUrl = functions.isUrlValid(longUrl);
		if (!validUrl.success) return res.json({ error: "The Long URL is invalid" });
		const urlShortened = await functions.shortenUrl(alphabet_set, length, longUrl, shortUrl);
		// prettier-ignore
		if(password) {
      urlShortened.password   = password;
      urlShortened.removable  = true;
    }
		await new Url(urlShortened).save();
		res.send(urlShortened);
	} catch (err) {
		console.error(err.message);
		res.send({ error: err.message });
	}
});

router.post("/modify", async (req, res) => {
	let obj = {};
	const shortUrl = req.body.oldShortUrl;
	const password = req.body.oldPassword;
	let newLongUrl = req.body.newLongUrl;
	let newShortUrl = req.body.newShortUrl;
	let newPassword = req.body.newPassword;
	console.log(req.body);
	try {
		if (newShortUrl && newShortUrl.trim().length != 0) {
			const existsShortUrls = await Url.find({ shortUrl: newShortUrl.trim() }).countDocuments();
			if (existsShortUrls !== 0) {
				return res.json({ error: "The new Short URL mentioned is already being used" });
			}
			if (newShortUrl.trim().length < MIN_LENGTH_SHORTURL) {
				return res.json({
					error: `Minimum length of s.dsce.in/<short-url> should be ${MIN_LENGTH_SHORTURL} characters`,
				});
			}
			obj.shortUrl = newShortUrl;
		}
		if (newLongUrl && newLongUrl.trim().length != 0) {
			const validUrl = functions.isUrlValid(longUrl);
			if (!validUrl.success) return res.json({ error: "The Long URL is invalid" });
			obj.longUrl = newLongUrl;
		}
		if (newPassword) {
			newPassword = newPassword.trim();
			if (newPassword.length >= 8 && newPassword.length <= 20) {
				obj.password = newPassword;
			} else {
				return res.json({ error: "Length of the new password should be between 8-20" });
			}
		}
		if (Object.keys(obj).length == 0) {
			return res.json({ error: "Atleast one of the new fields needs to be filled" });
		}
		let updatedUrlData = await Url.findOneAndUpdate({ password, shortUrl }, obj, {
			new: true,
			projection: "-_id -password -removable",
		});

		if (updatedUrlData) res.send(updatedUrlData);
		else return res.json({ error: "Incorrect short URL and password combination." });
	} catch (err) {
		res.send({ error: err.message });
	}
});

module.exports = router;
