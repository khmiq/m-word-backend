require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Correct CORS Middleware
const corsOptions = {
    origin: ["https://my-word-frontend.vercel.app"], // ✅ No trailing slash
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // ✅ If using cookies
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle Preflight Requests
app.use(express.json());

// ✅ Log CORS Headers for Debugging
app.use((req, res, next) => {
    console.log("CORS headers applied:", res.getHeaders());
    next();
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ✅ Routes
const wordRoutes = require("./routes/WordRoutes");
app.use("/words", wordRoutes);

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
