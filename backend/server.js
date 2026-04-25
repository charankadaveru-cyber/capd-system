import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// SOCKET
const io = new Server(server, {
    cors: { origin: "*" },
});

app.set("io", io);

// MIDDLEWARE
app.use(express.json());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
    })
);

// TEST ROUTES
app.get("/", (req, res) => {
    res.send("Backend Running");
});

app.get("/api", (req, res) => {
    res.json({ message: "API is running" });
});

// MAIN ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);

// ERROR HANDLER
app.use((req, res) => {
    res.status(404).json({
        message: `Not Found - ${req.originalUrl}`,
    });
});

// DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("DB Error:", err.message));

// START
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});