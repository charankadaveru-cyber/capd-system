import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "*",
    },
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

// TEST ROUTE (VERY IMPORTANT)
app.get("/", (req, res) => {
    res.send("Smart CAPD Backend Running");
});

app.get("/api", (req, res) => {
    res.json({ message: "API is running" });
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/vendor", vendorRoutes);

// ERROR HANDLER
app.use((req, res) => {
    res.status(404).json({
        message: `Not Found - ${req.originalUrl}`,
    });
});

// DB CONNECTION
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("DB Error:", err.message));

// START SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});