const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    enrolledCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        progress: { type: Number, default: 0 },
        completedLessons: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
        ],
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);
module.exports = User;
