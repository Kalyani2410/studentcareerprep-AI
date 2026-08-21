const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const uploadRoutes = require("./routes/uploadRoutes");

const resumeRoutes = require("./routes/resumeRoutes"); // ADD

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

  res.send("Backend Running Successfully");

});

app.use("/api/auth", authRoutes);

app.use("/api/files", uploadRoutes);

app.use("/api/resume", resumeRoutes); // ADD

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});