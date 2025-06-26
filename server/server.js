// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; // ✅ import this
import connectDB from "./configs/mongodb.js";
import useRouter from "./routes/UserRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

const PORT = process.env.PORT || 4000;
const app = express();
await connectDB();

app.use(cors());

// ✅ Use raw body ONLY for webhook route
app.use("/api/user/webhooks", bodyParser.raw({ type: "*/*" }));

// ✅ Use express.json() for everything else
app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", useRouter);
app.use("/api/image", imageRouter);

app.listen(PORT, () => console.log("Server running on port:", PORT));
