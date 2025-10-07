const express = require("express");
const router = express.Router();

const { CreateLesson, getLessons,getLessonsByCourseId, updateLesson, deleteLesson } = require("../controller/LessonController");
const authMiddleware = require("../../Module5-Backend/middleware/authMiddleware");

router.post("/:courseId",authMiddleware(["admin","instructor"]), CreateLesson);

router.get("/", getLessons);
//router.get("/:id", getLessonById); //lessonId
router.get("/:CourseId",getLessonsByCourseId)

router.put("/:id",authMiddleware(["admin","instructor"]), updateLesson);
router.delete("/:id",authMiddleware(["admin","instructor"]), deleteLesson);

module.exports = router;
