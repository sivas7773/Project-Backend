const AllUser = require("../model/UserModel");
const Course = require("../model/CourseModel");
const EnrolledCourse = require("../model/EnrolledCourseModel");

const getAllStudents = async (req, res) => {
  try {
    const AllStudents = await AllUser.find({
      role: "student",
    }).populate({
      path: "enrolledCourses.courseId",
      select: "title",
    });

    if (!AllStudents.length) {
      return res.status(404).json({ message: "No Students found" });
    }
    res.status(200).json({ AllStudents });
  } catch (err) {
    console.log({ message: err.message });
  }
};

const getStudentsByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // 1. Find courses created by this instructor
    const instructorCourses = await Course.find({
      instructorId: instructorId,
    }).select("_id title lessons");

    if (!instructorCourses.length) {
      return res
        .status(404)
        .json({ message: "No courses found for this instructor" });
    }

    const courseIds = instructorCourses.map((c) => c._id);

    // 2. Find all students enrolled in these courses
    const students = await AllUser.find({
      role: "student",
      "enrolledCourses.courseId": { $in: courseIds },
    }).populate({
      path: "enrolledCourses.courseId",
      select: "title",
    });

    // 3. Filter enrolledCourses only for this instructor’s courses
    const filteredStudents = students.map((student) => {
      const filteredCourses = student.enrolledCourses.filter((enrolled) =>
        courseIds.some((id) => id.equals(enrolled.courseId?._id))
      );

      return {
        _id: student._id,
        username: student.username,
        email: student.email,
        courses: filteredCourses.map((ec) => ({
          courseId: ec.courseId._id,
          title: ec.courseId.title,
          progress: ec.progress,
          completedLessons: ec.completedLessons,
        })),
      };
    });

    res.status(200).json({
      instructorId,
      students: filteredStudents,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await AllUser.findById(req.params.studentId)
      .populate({
        path: "enrolledCourses.courseId", // populate course info
        select: "title description level price instructorId",
        populate: { path: "instructorId", select: "name email" }, // populate instructor inside course
      })
      .populate({
        path: "enrolledCourses.completedLessons", // populate completed lessons
        select: "title description contentUrl courseId",
      });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Flatten completed lessons for easy access
    const completedLessons = student.enrolledCourses
      .flatMap((ec) => ec.completedLessons)
      .filter(Boolean);

    res.json({
      username: student.username,
      email: student.email,
      enrolledCourses: student.enrolledCourses.map((ec) => ({
        courseId: ec.courseId,
        progress: ec.progress,
      })),
      completedLessons,
      // lastLesson,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    const student = await AllUser.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already enrolled
    const alreadyEnrolled = student.enrolledCourses.some(
      (c) => c.courseId.toString() === courseId
    );
    if (alreadyEnrolled)
      return res.status(400).json({ message: "Already enrolled" });

    // Create enrollment
    const enrollment = new EnrolledCourse({
      userId: studentId,
      courseId,
      completedLessons: [],
    });

    await enrollment.save();

    // Add to enrolledCourses
    student.enrolledCourses.push({
      courseId,
      progress: 0,
      completedLessons: [],
    });

    await student.save();

    res.json({
      message: `Successfully enrolled in ${course.title}`,
      enrolledCourses: student.enrolledCourses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getStudentCourseStats = async (req, res) => {
  try {
    console.log("hi");
    const AllCourses = await Course.find()
      .populate("lessons") // populate lessons array
      .exec();
    console.log(AllCourses);
    const stats = await Promise.all(
      AllCourses.map(async (course) => {
        const studentCount = await EnrolledCourse.countDocuments({
          courseId: course._id,
        });
        console.log(studentCount);
        return { course: course.title, students: studentCount };
      })
    );

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllStudents,
  getStudentsByInstructor,
  getStudentById,
  enrollCourse,
  getStudentCourseStats,
};
