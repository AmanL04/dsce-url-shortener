require("dotenv").config();
require("./controllers/db")();

const express = require("express");
const redirect = require("./routes/redirect");
const apiRoutes = require("./routes/api-routes");
const apiUpdateRoutes = require("./routes/api-update-routes");
const PORT = Number(process.env.PRODUCTION === "true" ? process.env.PRO_PORT : process.env.DEV_PORT);

const app = express();

app.use(express.json({ extended: false }));
app.use(express.static("public"));

app.use("/api", apiRoutes);
app.use("/api/update", apiUpdateRoutes);

app.get("/", (req, res) => {
	res.sendFile("/index.html");
});

app.get("/:shortUrl", redirect);

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});
