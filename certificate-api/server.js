const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
const certificateRoutes = require("./routes/certificateRoutes");
app.use("/certificates", certificateRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Certificate API Running 🚀");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});