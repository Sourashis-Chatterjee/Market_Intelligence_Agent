require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const userRoutes = require("./Routes/userRoutes");
const reportRoutes = require("./Routes/reportRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

// app.use(cors({
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     credentials: true,
// }));

// Dynamic Production CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL 
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS Lockout: Origin not allowed by production policy.'), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => res.json({ status: "MIA Auth Service running" }));

app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
