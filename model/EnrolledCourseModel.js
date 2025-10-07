const mongoose = require("mongoose");
const EnrolledCourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  score: { type: Number, default: 0 },
  certificateIssued: { type: Boolean, default: false },
 
});
const EnrolledCourse = mongoose.model("EnrolledCourse", EnrolledCourseSchema);
module.exports = EnrolledCourse;
