const express = require("express");
const bodyParser = require("body-parser");
const fileRoutes = require("./routes/fileRoutes");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

// Ensure uploads directory exists to avoid ENOENT when serving or writing files
const uploadsDir = path.join(__dirname, "uploads");
try {
	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
		console.log(`Created uploads directory at ${uploadsDir}`);
	}
} catch (err) {
	console.error("Failed to create uploads directory:", err);
}

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/", fileRoutes);

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
