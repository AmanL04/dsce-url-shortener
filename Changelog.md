v1.0.0 - v 1.1.0

1. Removed sites.js (list of inappropriate sites for which we should not create a shortened URL)
2. Removed max length limit for the short urls
3. No longer checking for uniqueness for the URL to be shortened
4. Removed `/api/update/url` route as it was not being used anywhere
5. Search api has changed, i.e, to get a list of all shortened URLs, there is a new API `/api/search` instead of a earlier hack of using `/api/search/null`. From now `/api/search/:searchstring` will take the search string literally
6. No longer verifying id the URL exists (**I have realised it's not in the scope of this project**)