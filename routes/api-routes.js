const router = require("express").Router();
const Url = require("../models/url");
const charactersToBeEscapedInRegex = ["\\", "[", "]", "(", ")", "{", "}", "*", "+", "?", "|", "^", "$", "."];
//Order of this array matters as the first character (escaped backlash should be escaped first)
function regexifyString(string) {
	console.log(string);
	for (var char of charactersToBeEscapedInRegex) {
		string = string.replace(new RegExp(`\\${char}`, "g"), `\\${char}`);
	}
	return new RegExp(`${string}`, "ig");
}

async function findUrlsAndUpdateTheirSearches(filters, searchString) {
	const currentTime = new Date(Date.now());
	let urls = await Url.find(filters, "-_id -password -removable").lean();
	for (var url of urls) {
		url.exact =
			searchString === url.longUrl || searchString === url.shortUrl || searchString === url.description;
		if (!url.searchedTimes) url.searchedTimes = [];
		url.searchedTimes.push(currentTime);
	}
	Url.updateMany({ longUrl: { $in: urls.map((x) => x.longUrl) } }, { $push: { searchedTimes: currentTime } });
	return urls;
}

router.get("/search/:searchString", async (req, res) => {
	let searchString = req.params.searchString;
	console.log(typeof searchString);
	if (searchString) searchString = regexifyString(searchString);
	// searchString = searchString == "null" ? "" : new RegExp(`${searchString}`, "ig");
	const filters = {
		$or: [{ longUrl: searchString }, { shortUrl: searchString }, { description: searchString }],
	};
	try {
		let urls = await findUrlsAndUpdateTheirSearches(filters, req.params.searchString);
		res.send(urls);
	} catch (err) {
		console.log(err);
		res.send({ error: err.message });
	}
});

router.get("/search", async (req, res) => {
	try {
		let urls = await findUrlsAndUpdateTheirSearches({});
		res.send(urls);
	} catch (err) {
		console.log(err);
		res.send({ error: err.message });
	}
});

module.exports = router;
