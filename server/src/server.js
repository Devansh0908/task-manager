require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const mongoEnvName = ["MONGO_URI", "MONGODB_URI", "MONGO_URL", "DATABASE_URL"].find(
  (name) => Boolean(process.env[name])
);

console.log(`Starting Team Task Manager API in ${process.env.NODE_ENV || "development"} mode`);
console.log(`MongoDB variable: ${mongoEnvName || "missing"}`);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
