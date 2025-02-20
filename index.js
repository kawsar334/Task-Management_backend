
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";
import Task from "./models/Task.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
   
}));

app.options('*', cors());

// MongoDB Connection
mongoose
    .connect("mongodb+srv://kawsar:kawsar@cluster0.qbufs.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));


const JWT_SECRET = process.env.JWT_SECRET || "kawsarfiroz"
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    console.log(req.cookies)
    if (!token) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 

        next(); 
    } catch (err) {
        return res.status(400).json({ message: "Invalid Token" });
    }
};

 
// User Authentication Routes
app.get("/", (req, res) => {
    res.send("helo")
})
app.post("/login", (req, res) => {

//     const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
// }
    const { userId, email, displayName } = req.body;
    if (!userId || !email) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: userId, email, displayName }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie('token', token, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    res.json({ token });
});



app.post("/tasks", verifyToken, async (req, res) => {
    
    try {
        const task = new Task({ ...req.body, email:req.user.email, userId: req.user.id });
        await task.save();
        res.status(201).json(task);
        io.emit("refreshTasks");
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
});
 
app.get("/tasks", verifyToken, async (req, res) => {
    try {
        console.log(req.user.email)
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
});

app.put("/tasks/:id", verifyToken, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
        io.emit("refreshTasks");
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
});

app.delete("/tasks/:id", verifyToken, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
        io.emit("refreshTasks");
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error });
    }
});

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("taskUpdated", () => {
        io.emit("refreshTasks");
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
