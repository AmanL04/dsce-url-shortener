window.onload = function () {
	const protocol = window.location.protocol,
		domain = window.location.host,
		shortUrl = document.querySelector("#shortUrl"),
		longUrl = document.querySelector("#longUrl"),
		passwordUrl = document.querySelector("#passwordUrl"),
		submitUrl = document.querySelector("#submitUrl"),
		passwordUrlUpdate = document.querySelector("#passwordUrlUpdate"),
		shortUrlUpdate = document.querySelector("#shortUrlUpdate"),
		// descriptionUrl = document.querySelector('#descriptionUrl'),
		newUpdateSearchUrl = document.querySelector("#new-update-search-url"),
		// aboutUrl = document.querySelector('#about-url'),
		footer = document.querySelector("footer"),
		hamburgerInput = document.querySelector("#hamburger input"),
		formHorizontalDivider = document.querySelector("#new-update-search-url .horizontal-divider h3"),
		currentOptionHeader = document.querySelector("#current-option span"),
		result = document.querySelector("#result"),
		searchResult = document.querySelector("#search-result"),
		newAndUpdateResult = document.querySelector("#new-update-result"),
		newUpdateUrlResponse = document.querySelector("#new-update-result input"),
		copyButtonIcon = document.querySelector("div.copy"),
		newUpdateUrlResponseTag = document.querySelector("#shortenedResult"),
		MAX_LENGTH_SHORTURL = 16,
		MIN_LENGTH_SHORTURL = 3;

	document.querySelector("#hamburger input").addEventListener("click", function (e) {
		let ul = document.querySelector("#hamburger-menu ul");
		result.classList.remove("show");
		if (e.target.checked == true) {
			ul.classList.add("checked");
		} else {
			ul.classList.remove("checked");
		}
	});
	document.querySelectorAll("#hamburger-menu li").forEach((li) => {
		li.addEventListener("click", function (e) {
			let option = e.target.innerText.toLowerCase();
			e.target.parentElement.classList.remove("checked");
			newUpdateSearchUrl.className = option;
			newAndUpdateResult.className = option;
			newUpdateUrlResponseTag.value = "";
			hamburgerInput.checked = false;
			newUpdateSearchUrl.childNodes.forEach((el) => {
				if (el.nodeName == "INPUT") el.value = "";
			});
			switch (option) {
				case "new":
					newUrlFn();
					break;
				case "update":
					updateUrlFn();
					break;
				case "search":
					searchUrlFn();
					break;
				// case "about": display(aboutUrlFn);break;
			}
			checkFooterFixed();
		});
	});
	submitUrl.addEventListener("click", function (e) {
		if (!e.target.classList.contains("disabled")) {
			let currentOption = currentOptionHeader.innerText.toLowerCase();
			submitUrl.classList.add("disabled");
			copyButtonIcon.classList.remove("copied");
			result.classList.add("show");
			if (currentOption.includes("new")) submitNew();
			else if (currentOption.includes("update")) submitUpdate();
			else if (currentOption.includes("search")) submitSearch();
		}
	});
	copyButtonIcon.addEventListener("click", copy);
	newUpdateSearchUrl.addEventListener("mouseover", function (e) {
		let el = e.target;
		switch (el.id) {
			case "passwordUrl":
				el.placeholder = newUpdateSearchUrl.classList.contains("new")
					? "To update URL in the future"
					: "Enter password set during creation";
				break;
			case "longUrl":
				el.placeholder = newUpdateSearchUrl.classList.contains("new")
					? "Example: https://www.google.com"
					: newUpdateSearchUrl.classList.contains("update")
					? "Optional: (Example) https://www.google.com"
					: "Examples: gcloud,a,new...";
				break;
			case "shortUrl":
				el.placeholder = "s.dsce.in/<desired short url>";
				break;
			case "passwordUrlUpdate":
				el.placeholder = "Optional: To update URL in the future";
				break;
			case "shortUrlUpdate":
				el.placeholder = "Optional: s.dsce.in/<desired short url>";
				break;
		}
	});
	newUpdateSearchUrl.addEventListener("mouseout", function (e) {
		let el = e.target;
		switch (el.id) {
			case "passwordUrl":
				el.placeholder = newUpdateSearchUrl.classList.contains("new")
					? "Enter Password"
					: "Enter Old Password";
				break;
			case "longUrl":
				el.placeholder = newUpdateSearchUrl.classList.contains("new")
					? "Enter Long URL"
					: newUpdateSearchUrl.classList.contains("update")
					? "Enter New Long URL"
					: "Key to Search";
				break;
			case "shortUrl":
				el.placeholder = "Enter Desired Short URL";
				break;
			case "passwordUrlUpdate":
				el.placeholder = "Enter New Password";
				break;
			case "shortUrlUpdate":
				el.placeholder = "Enter New Desired Short URL";
				break;
		}
	});
	window.addEventListener("resize", checkFooterFixed);

	function newUrlFn() {
		passwordUrl.placeholder = "Enter Password ";
		shortUrl.placeholder = "Enter Desired Short URL";
		submitUrl.innerText = "Shorten URL";
		longUrl.placeholder = "Enter Long URL";
		formHorizontalDivider.innerText = "Optional Fields";
		currentOptionHeader.innerText = " Shorten New URL";
	}
	function updateUrlFn() {
		passwordUrl.placeholder = "Enter Old Password";
		shortUrl.placeholder = "Enter Old Short URL";
		submitUrl.innerText = "Update URL";
		longUrl.placeholder = "Enter New Long URL";
		formHorizontalDivider.innerText = "Credentials";
		currentOptionHeader.innerText = " Update Existing Short URL";
	}
	function searchUrlFn() {
		submitUrl.innerText = "Search";
		longUrl.placeholder = "Key to Search";
		currentOptionHeader.innerText = " Search from Existing URLs";
	}
	// function aboutUrlFn(){}

	function submitNew() {
		let entered_password = passwordUrl.value.trim();
		let entered_shortUrl = shortUrl.value.trim();
		let entered_longUrl = longUrl.value.trim();
		let obj = {};
		if ((entered_password.length != 0 && entered_password.length < 8) || entered_password.length > 20) {
			newOrUpdateMessage(true, "The password should be atleast 8 characters long", "new");
			return;
		} else {
			obj.password = entered_password;
		}
		if (
			entered_shortUrl.length != 0 &&
			(entered_shortUrl.length < MIN_LENGTH_SHORTURL || entered_shortUrl.length > MAX_LENGTH_SHORTURL)
		) {
			newOrUpdateMessage(
				true,
				`The desired short url should be ${MIN_LENGTH_SHORTURL}-${MAX_LENGTH_SHORTURL} characters long`,
				"new"
			);
			return;
		} else {
			obj.shortUrl = entered_shortUrl;
		}
		if (entered_longUrl.length == 0) {
			newOrUpdateMessage(true, "Long Url field cannot be empty", "new");
			return;
		}
		try {
			// console.log(entered_longUrl);
			new URL(entered_longUrl);
		} catch (e) {
			// console.log(e);
			newOrUpdateMessage(true, "The Long URL entered is invalid", "new");
			return;
		}
		obj.longUrl = entered_longUrl;
		axios
			.post(`${protocol + "//" + domain}/api/update/new`, obj)
			.then((res) => {
				if (res.data) {
					if (res.data.error) {
						newOrUpdateMessage(true, res.data.error, "new");
						return;
					}
					newOrUpdateMessage(false, `${protocol + "//" + domain}/${res.data.shortUrl}`, "new");
				} else {
					newOrUpdateMessage(true, "Something went wrong", "new");
				}
			})
			.catch((err) => {
				newOrUpdateMessage(true, err, "new");
			});
	}
	function submitUpdate() {
		let entered_old_password = passwordUrl.value.trim();
		let entered_old_shortUrl = shortUrl.value.trim();
		let entered_new_password = passwordUrlUpdate.value.trim();
		let entered_new_shortUrl = shortUrlUpdate.value.trim();
		let entered_new_longUrl = longUrl.value.trim();
		let obj = {};

		if (entered_old_password.length == 0 || entered_old_shortUrl.length == 0) {
			newOrUpdateMessage(true, "Password and Short URL credentials fields cannot be empty", "update");
			return;
		}
		obj.oldPassword = entered_old_password;
		obj.oldShortUrl = entered_old_shortUrl;
		try {
			if (entered_new_longUrl.length != 0) {
				new URL(entered_new_longUrl);
				obj.newLongUrl = entered_new_longUrl;
			}
		} catch (e) {
			newOrUpdateMessage(true, "The new Long URL entered is invalid", "update");
			return;
		}
		if (entered_new_password.length != 0) {
			if (entered_new_password.length >= 8 && entered_new_password.length <= 20) {
				obj.newPassword = entered_new_password;
			} else {
				newOrUpdateMessage(true, "Length of the new password should be between 8-20", "update");
				return;
			}
		}
		if (entered_new_shortUrl.length != 0) obj.newShortUrl = entered_new_shortUrl;
		if (Object.keys(obj).length == 0) {
			newOrUpdateMessage(true, "Atleast one of the new fields needs to be filled", "update");
			return;
		}
		axios
			.post(`${protocol + "//" + domain}/api/update/modify`, obj)
			.then((res) => {
				if (res.data) {
					if (res.data.error) {
						newOrUpdateMessage(true, res.data.error, "update");
						return;
					}
					newOrUpdateMessage(false, "Successfully updated", "update");
				} else {
					newOrUpdateMessage(true, "Something went wrong!", "update");
				}
			})
			.catch((err) => {
				newOrUpdateMessage(true, err, "update");
			});
	}
	function submitSearch() {
		let searchString = longUrl.value.trim();
		let searchResultsListBody = document.querySelector("#search-results-list tbody");
		if (searchString == "") searchString = null;
		axios
			.get(`${protocol + "//" + domain}/api/search/${encodeURIComponent(searchString)}`)
			.then((res) => {
				if (res.data) {
					if (res.data.error) {
						searchResultsListBody.innerHTML = `<tr><td style="color: red;" colspan="4">${res.data.error}</td></tr>`;
					} else if (res.data.length == 0) {
						searchResultsListBody.innerHTML = `<tr><td style="color: red;" colspan="4">No such URL records exists</td></tr>`;
					} else {
						// res.data.sort((a, b)=>(a.longUrl.length > b.longUrl.length) ? 1: -1);
						let exact = res.data.filter((a) => a.exact).concat(res.data.filter((a) => !a.exact));
						let html = exact
							.map((url) => {
								let longUrl = url.longUrl.split(new URL(url.longUrl).protocol + "//")[1];
								let row =
									`<tr ${url.exact ? `style="background-color: #F1F1F1"` : ``}>` +
									`<td><a href="${protocol + "//" + domain}/${url.shortUrl}">s.dsce.in/${
										url.shortUrl
									}</a></td>` +
									`<td><a href="${url.longUrl}">${
										longUrl.length > 64 ? longUrl.substring(0, 61) + "..." : longUrl
									}</a></td>` +
									`<td>${url.viewedTimes ? url.viewedTimes.length : 0}</td>` +
									`<td>${url.searchedTimes ? url.searchedTimes.length : 0}</td>` +
									`</tr>`;
								return row;
							})
							.join("");
						searchResultsListBody.innerHTML = html;
					}
				} else {
					searchResultsListBody.innerHTML = `<tr><td style="color: red;" colspan="4">Something Went Wrong!</td></tr>`;
				}
				submitUrl.classList.remove("disabled");
				checkFooterFixed();
			})
			.catch((err) => {
				console.log(err);
				searchResultsListBody.innerHTML = `<tr><td style="color: red;" colspan="4">${err}</td></tr>`;
				submitUrl.classList.remove("disabled");
				checkFooterFixed();
			});
	}

	function newOrUpdateMessage(error, message, option) {
		newUpdateUrlResponse.value = message;
		newUpdateUrlResponse.style.color = error ? "red" : "green";
		newUpdateUrlResponse.style.textAlign = error ? "center" : "left";
		result.classList.add("show");
		if (error) result.classList.add("error");
		else result.classList.remove("error");
		submitUrl.classList.remove("disabled");
		if (error) {
			submitUrl.classList.add("animated", "shake");
			submitUrl.addEventListener("animationend", function () {
				submitUrl.classList.remove("animated", "shake");
			});
		} else {
			submitUrl.classList.add("animated", "pulse");
			submitUrl.addEventListener("animationend", function () {
				submitUrl.classList.remove("animated", "pulse");
			});
		}
	}

	function copy() {
		var textArea = document.createElement("textarea");
		textArea.value = newUpdateUrlResponseTag.value;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			document.execCommand("copy");
			copyButtonIcon.classList.add("copied");
			setTimeout(function () {
				copyButtonIcon.classList.remove("copied");
			}, 3000);
		} catch (err) {
			newOrUpdateMessage(true, err, "new");
		}

		document.body.removeChild(textArea);
	}

	function checkFooterFixed() {
		footer.classList.add("invisible");
		footer.classList.remove("fixed");
		let bounding = footer.getBoundingClientRect();
		let scrollY = window.scrollY || window.pageYOffset;
		if (bounding.bottom + scrollY <= (window.innerHeight || document.documentElement.clientHeight)) {
			footer.classList.add("fixed");
		} else {
			footer.classList.remove("fixed");
		}
		footer.classList.remove("invisible");
	}
	checkFooterFixed();
};
