require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const userRoutes = require("./Routes/userRoutes");
const reportRoutes = require("./Routes/reportRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => res.json({ status: "MIA Auth Service running" }));

app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
