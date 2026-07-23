const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const questionRoutes = require("./routes/questionRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/questions", questionRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    services: "online",
  });
});

// Not Found Middleware
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SYSTEM RUNNING] -> Port ${PORT}`);
});