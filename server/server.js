// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import useRouter from "./routes/UserRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

const PORT = process.env.PORT || 4000;
const app = express();

// Connect to MongoDB
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // For JSON routes (everything except Clerk webhooks)

// Routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", useRouter); // Webhook is handled inside useRouter
app.use("/api/image", imageRouter);

// Start server
app.listen(PORT, () => console.log("Server running on port:", PORT));
