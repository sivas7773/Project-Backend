const express = require("express");
const router = express.Router();

const {
  CreateEnrolledCourse,
  getEnrolledCourse,
  getEnrolledCourseByStudentId,
  updateEnrolledCourse,
  deleteEnrolledCourse,
} = require("../controller/EnrolledCourseController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/:userId/:courseId",
  authMiddleware(["student","instructor"]),
  CreateEnrolledCourse
);

router.get("/", getEnrolledCourse);
router.get("/:StudentId", getEnrolledCourseByStudentId); // StudendId
router.put("/:id", authMiddleware(["instructor"]), updateEnrolledCourse);
router.delete("/:id", authMiddleware(["instructor"]), deleteEnrolledCourse);
module.exports = router;
