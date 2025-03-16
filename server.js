require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Correct CORS Middleware
const corsOptions = {
    origin: ["https://my-word-frontend.vercel.app"], 
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true, 
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 
app.use(express.json());


app.use((req, res, next) => {
    console.log("CORS headers applied:", res.getHeaders());
    next();
});


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


const wordRoutes = require("./routes/WordRoutes");
app.use("/words", wordRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
