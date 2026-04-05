const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const { connectRedis } = require("./config/redis");

try {
  connectRedis();
} catch (error) {
  console.error("Redis connection error:", error);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)),
  )
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/teams", require("./routes/teams"));
app.use("/api/expenses", require("./routes/expenses"));

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({ message });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");  // for render
});


process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  process.exit(1);
});
