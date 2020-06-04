v1.1.0 -> v1.1.1 

1. A small patch was added to the bug in search api routes. It was not updating the search count.
2. Frontend (public directory) now uses the 2 different search APIs added in the previous version
3. Added documentation on environment variables
4. Changed production env variable from `PRODUCTION` to the conventional `NODE_ENV` for express applications.

v1.0.0 -> v 1.1.0

1. Removed sites.js (list of inappropriate sites for which we should not create a shortened URL)
2. Removed max length limit for the short urls
3. No longer checking for uniqueness for the URL to be shortened
4. Removed `/api/update/url` route as it was not being used anywhere
5. Search api has changed, i.e, to get a list of all shortened URLs, there is a new API `/api/search` instead of a earlier hack of using `/api/search/null`. From now `/api/search/:searchstring` will take the search string literally
6. No longer verifying id the URL exists (**I have realised it's not in the scope of this project**)