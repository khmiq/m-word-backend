require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Correct CORS Middleware
const corsOptions = {
    origin: ["https://my-word-frontend.vercel.app"], 
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
};

app.use(cors(corsOptions));  // ✅ No need for app.options("*", cors(corsOptions))

app.use(express.json());

// ✅ Debugging Incoming Requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// ✅ MongoDB Connection (with Debugging)
console.log("MongoDB URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB Connected");
}).catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
});

// ✅ Routes
const wordRoutes = require("./routes/WordRoutes");
app.use("/words", wordRoutes);

// ✅ Catch-All Route for Debugging
app.use((req, res) => {
    res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
