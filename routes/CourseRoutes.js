const express = require("express");
const router = express.Router();

const {
  CreateCourse,
  getAllCoursesWithLessons,
  deleteCourse,
  getCourseByInstructorId,
  getCourseWithLessons,
  updateCourseWithLessons,
} = require("../controller/CourseController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:id", CreateCourse);
router.get("/", getAllCoursesWithLessons);

router.get("/instructor/:instructorId", getCourseByInstructorId);
router.put("/:courseId", authMiddleware(["instructor"]), updateCourseWithLessons);
router.delete("/:id", authMiddleware(["instructor"]), deleteCourse);
router.get("/withlessons/:courseId", getCourseWithLessons);
module.exports = router;
