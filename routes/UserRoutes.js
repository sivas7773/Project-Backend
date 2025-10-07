const express = require("express");
const router = express.Router();

const {
   getUsers,
  getUserById,
  updateUser,
  deleteUser,
  UpdatecompleteLesson,
} = require("../controller/UserController");

const authMiddleware = require("../middleware/authMiddleware");


router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware(["admin"]), updateUser);
router.delete("/:id", authMiddleware(["admin"]), deleteUser);

router.post("/:userId/course/:courseId/lesson/:lessonId", UpdatecompleteLesson);


module.exports = router;
