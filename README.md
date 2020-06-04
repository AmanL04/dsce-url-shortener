> Link to a live version - https://s.dsce.in/

**Url Shortener** is, as the name suggestes, a project to create shortened URLs.

# Reason

Url shortener was built to address the issue of not being able to know the traction for various events among students in our college, DSCE. With the access to our own database, now we can run various analytics on the patterns of accessing various URLs and map them to the real-world outcomes.

# Features

1. UI to use and/or refer to to build one's personal URL Shortener (**/public directory**)
2. Ability to provide short URL phrases or default to randomly generated shortURL (**domain\.com/:shortURL**)
3. Ability to update the Shortened URLs (by using a passphrase)
4. Ability to search already shortened URLs
5. Ability to view the search count and view count of the shortened URls
6. Last but not the least, the ability to shorten URLs

# Documentation

Will be added soon...

# Environment Variables

| ENV Variable | Usage                                                                     |
| ------------ | ------------------------------------------------------------------------- |
| NODE_ENV     | "production"/"development" to determine the state of the node application |
| DEV_PORT     | Port for development environment                                          |
| PRO_PORT     | Port for production environment                                           |
| MONGO_URI_1  | MongoDB URI for production environment                                    |
| MONGO_URI_2  | MongoDB URI for development environment                                   |
