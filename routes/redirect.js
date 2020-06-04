const Url = require("../models/url");

module.exports = async (req, res) => {
	const shortUrl = req.params.shortUrl;
	let currentTime = new Date(Date.now());
	try {
		let urlDoc = await Url.findOneAndUpdate({ shortUrl }, { $push: { viewedTimes: currentTime } });
		res.redirect(urlDoc.longUrl);
	} catch {
		res.redirect(`/404.html?url=${shortUrl}`);
	}
};
