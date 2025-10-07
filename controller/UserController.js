const AllUser = require("../model/UserModel");
const Course = require("../model/CourseModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // for pwd hashing
const EnrolledCourse = require("../model/EnrolledCourseModel");

const getUsers = async (req, res) => {
  try {
    const AllUsers = await AllUser.find()
      .populate({
        path: "enrolledCourses.courseId", // populate course info
        select: "title description level price instructorId",
        populate: { path: "instructorId", select: "name email" }, // populate instructor inside course
      })
      .populate({
        path: "enrolledCourses.completedLessons", // populate completed lessons
        select: "title ",
      });
    res.status(200).json(AllUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const MyUser = await AllUser.findById(req.params.id);

    if (!MyUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(MyUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await AllUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ message: "User Updated", updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await AllUser.findByIdAndDelete(req.params.id);
    res.status(202).json({ message: "User Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const UpdatecompleteLesson = async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.params;

    const users = await AllUser.findById(userId);
    if (!users) return res.status(404).json({ message: "User not found" });

    // Find the course enrollment inside the user

    const enrolledCourse = users.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );
    if (!enrolledCourse) {
      return res
        .status(400)
        .json({ message: "User not enrolled in this course" });
    }

    // Prevent duplicate lesson completion
    if (enrolledCourse.completedLessons.includes(lessonId)) {
      return res.status(400).json({ message: "Lesson already completed" });
    }

    // Add lesson to completedLessons
    enrolledCourse.completedLessons.push(lessonId);

    // Update progress (%)
    const course = await Course.findById(courseId).populate("lessons");
    const totalLessons = course.lessons.length;
    const completedCount = enrolledCourse.completedLessons.length;
    enrolledCourse.progress = Math.round((completedCount / totalLessons) * 100);
      await users.save();

    const FindEnrolledCourse = await EnrolledCourse.findOne({
      userId: userId,
      courseId: courseId,
    });

    if (FindEnrolledCourse) {
      if (FindEnrolledCourse.completedLessons.includes(lessonId)) {
        return res.status(400).json({ message: res.data.message });
      } else {
        FindEnrolledCourse.completedLessons.push(lessonId);
        await FindEnrolledCourse.save();
      }
    }

    res.status(200).json({
      message: "Lesson marked as completed",
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  UpdatecompleteLesson,
};
