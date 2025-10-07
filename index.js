const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const UserRoutes = require("./routes/UserRoutes");
app.use("/user", UserRoutes);

const StudentRoutes = require("./routes/StudentRoutes");
app.use("/student", StudentRoutes);

const LessonRoutes = require("./routes/LessonRoutes");
app.use("/lesson", LessonRoutes);

const CourseRouter = require("./routes/CourseRoutes");
app.use("/course", CourseRouter);

const EnrolledCourseRouter = require("./routes/EnrolledCourseRoutes");
app.use("/enrolled", EnrolledCourseRouter);

require("dotenv").config();
const port = process.env.port;
app.listen(port, () => {
  console.log(`port running on ${port}`);
});

const dbConnection = require("./config/dbConnection");
dbConnection();
