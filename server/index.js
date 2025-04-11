const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const studentRouter = require("./routes/studentRoutes");
const facultyRouter = require("./routes/facultyRoutes");
const courseRouter = require("./routes/courseRoutes");
const chatBotRouter = require("./routes/chatBotRoutes");
const assignmentRouter = require("./routes/assignmentRoutes");
const dropRouter = require("./routes/dropRoutes");
const globalErrorHandler = require('./utils/errorHandler');

const AppError = require("./utils/appError"); // Import AppError

dotenv.config({ path: "./.env" });
const app = express();

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend's origin
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

app.use((req, res, next) => {
  console.log("HI i am middleware 😀");
  next();
});

console.log(process.env.FRONTEND_URL);

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/chatBot", chatBotRouter);
app.use("/api/v1/assignments", assignmentRouter);
app.use("/api/v1/dropbox", dropRouter);
app.get("/", (request, response) => {
  response.json({
    message: "server running fine",
  });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handler (must be the last middleware)
app.use(globalErrorHandler);

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

console.log(process.env.MONGO_URL);
const PORT = process.env.PORT || 8001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connection success👌");
  })
  .catch((error) =>
    console.log(`${error} ${process.env.PORT} did not connect`)
  );

app.listen(PORT, () => {
  console.log(`Server Port: ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  app.close(() => {
    process.exit(1);
  });
});
