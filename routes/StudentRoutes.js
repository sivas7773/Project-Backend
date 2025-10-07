const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudentsByInstructor,
  getStudentById,enrollCourse,
  getStudentCourseStats
} = require("../controller/StudentController");


const authMiddleware = require("../middleware/authMiddleware");

router.get("/:instructorId", getStudentsByInstructor);
router.get("/", getAllStudents);
router.get("/me/:studentId",getStudentById)
router.post("/enroll",enrollCourse)
router.get("/course/stats",getStudentCourseStats)
module.exports = router;
