
import bodyParser  from "body-parser"
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


app.use(bodyParser.json());

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://enchanting-belekoy-f1ee70.netlify.app'
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    res.sendStatus(200);
});

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
}








// MongoDB Connection
mongoose
    .connect("mongodb+srv://kawsar:kawsar@cluster0.qbufs.mongodb.net/", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));


const JWT_SECRET = process.env.JWT_SECRET || "kawsarfiroz"
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
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
   try{
       const { userId, email, displayName } = req.body;
       if (!userId || !email) return res.status(400).json({ message: "Invalid credentials" });
      
       return res.status(201).json("Login succesfuly")
   }catch(err){
    res.status(400).json(err)
    console.log(err)
   }
});



app.post("/tasks", async (req, res) => {
    
    try {
        const task = new Task({ ...req.body,});
       const savetask= await task.save();
        res.status(201).json(savetask);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
});
 
app.get("/tasks", async (req, res) => {
    const email= req.query.email
    try {
        const tasks = await Task.find({email });
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching tasks", error });
    }
}); 

app.put("/tasks/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        res.status(200).json(updatedTask);
        io.emit("refreshTasks");
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
});

app.delete("/tasks/:id", async (req, res) => {
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
