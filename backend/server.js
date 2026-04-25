import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT"],
    },
});

app.set("io", io);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({ message: "Smart CAPD API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/vendor", vendorRoutes);

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));