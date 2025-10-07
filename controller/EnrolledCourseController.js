const EnrolledCourse = require("../model/EnrolledCourseModel");
const Course = require("../model/CourseModel");
const User = require("../model/UserModel");

const CreateEnrolledCourse = async (req, res) => {
  try {
    //1. check for User and course
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
  
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //2. Save EnrolledCourse
    const NewEnrolledCourse = new EnrolledCourse({
      userId: userId,
      courseId: courseId,
    });
    NewEnrolledCourse.save();

    // 3. Prevent duplicate enrollment
    if (user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "User already enrolled in this course" });
    }

    // 4. Add enrolledCourses to users
    user.enrolledCourses.push({
      courseId,
      progress: 0,
      completedLessons: [],
    });

    await user.save();

    return res.status(201).json({ message: "EnrolledCourse added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getEnrolledCourse = async (req, res) => {
  try {
    const AllEnrolledCourses = await EnrolledCourse.find();
    res.status(200).json(AllEnrolledCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEnrolledCourseByStudentId = async (req, res) => {
  try {
    const StudentId = req.params.StudentId;
   
    const MyEnrolledCourses = await EnrolledCourse.find({
      userId: StudentId,
    });
   
    res.status(200).json(MyEnrolledCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEnrolledCourse = async (req, res) => {
  try {
    const updatedEnrolledCourse = await EnrolledCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "EnrolledCourse Updated", updatedEnrolledCourse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEnrolledCourse = async (req, res) => {
  try {
    await EnrolledCourse.findByIdAndDelete(req.params.id);
    res.status(202).json({ message: "EnrolledCourse Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  CreateEnrolledCourse,
  getEnrolledCourse,
  getEnrolledCourseByStudentId,
  updateEnrolledCourse,
  deleteEnrolledCourse,
};
