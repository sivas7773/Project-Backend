const Lesson = require("../model/LessonModel");
const Course = require("../model/CourseModel");
const CreateLesson = async (req, res) => {
  const { title, contentUrl, description } = req.body;
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!title || !contentUrl || !description) {
      return res.status(400).json({ message: "Pls enter mandatory fields" });
    }
 

    const newLesson = new Lesson({
      courseId: req.params.courseId,
      title,
      contentUrl,
      description,
    });
    const lesson = await newLesson.save();
    res.status(201).json({ message: "Lesson added", lesson });

    course.lessons.push(lesson._id);
    await course.save();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

const getLessons = async (req, res) => {
  try {
    const AllLessons = await Lesson.find();
    res.status(200).json(AllLessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const MyLesson = await Lesson.findById(req.params.id).populate(
      "courseId",
      "title description price"
    );

    if (!MyLesson) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json(MyLesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getLessonsByCourseId = async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId });
    if (!lessons) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ error: "Error fetching lessons", details: err.message });
  }
};


const updateLesson = async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Lesson Updated", updatedLesson });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.status(202).json({ message: "Lesson Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  CreateLesson,
  getLessons,
  updateLesson,
  deleteLesson,
  getLessonsByCourseId
};
