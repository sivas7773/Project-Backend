const Course = require("../model/CourseModel");
const User = require("../model/UserModel");
const Lesson = require("../model/LessonModel");

const CreateCourse = async (req, res) => {
  try {
    const instructorId = req.params.id;

    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: "instructor not found" });
    }

    const { title, description, price, lessons } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "Pls Enter All Fields" });
    }

    const NewCourse = new Course({
      title,
      description,
      instructorId: instructorId,
      price,
    });

    const CreatedCourse = await NewCourse.save();

    //save lesson

    const savedLessons = [];
    for (let l of lessons) {
      if (!l.title || !l.contentUrl || !l.description) {
        return res.status(400).json({ message: "Pls enter mandatory fields" });
      }
      const course = await Course.findById(CreatedCourse._id);
      const newLesson = new Lesson({
        title: l.title,
        contentUrl: l.contentUrl,
        description: l.description,
        courseId: CreatedCourse._id,
      });
      const savedLesson = await newLesson.save();
      course.lessons.push(savedLesson._id);
      savedLessons.push(savedLesson);

      await course.save();
      //  res.status(201).json({ message: "Course added", CreatedCourse });
      res.status(201).json({ course: CreatedCourse, lessons: savedLessons });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllCoursesWithLessons = async (req, res) => {
  try {
    const AllCourses = await Course.find()
      .populate("lessons") // populate lessons array
      .exec();
    if (!AllCourses)
      return res.status(404).json({ message: "No Course found" });

    res.status(200).json(AllCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const DeletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!DeletedCourse)
      return res.status(404).json({ message: "Course not found" });

    await Lesson.deleteMany({ courseId: id });
    res.status(202).json({ message: "Course and its Leassons Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourseByInstructorId = async (req, res) => {
  try {
    const MyCourses = await Course.find({
      instructorId: req.params.instructorId,
    })
      .populate("instructorId")   
      .populate("lessons");

    if (!MyCourses)
      return res.status(404).json({ message: "Course not found" });
    res.status(200).json(MyCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourseWithLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course
    const course = await Course.findById(courseId)
      .populate("instructorId", "username email")
      .populate("lessons"); // populate lessons array

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find lessons related to this course
    const lessons = await Lesson.find({ courseId: courseId });

    res.json({
      course,
      lessons,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error fetching course with lessons",
      details: err.message,
    });
  }
};

const updateCourseWithLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, instructorId, lessons } = req.body;

    // 1. Update course
    const course = await Course.findByIdAndUpdate(
      courseId,
      { title, description, instructorId },
      { new: true }
    );

    if (!course) return res.status(404).json({ error: "Course not found" });

    // 2. Manage lessons
    if (Array.isArray(lessons)) {
      // delete old lessons
      await Lesson.deleteMany({ courseId: courseId });

      // insert new lessons
      const lessonsWithCourseId = lessons.map((lesson) => ({
        ...lesson,
        courseId: courseId,
      }));
      await Lesson.insertMany(lessonsWithCourseId);
    }

    const updatedLessons = await Lesson.find({ courseId: courseId });

    res.json({ course, lessons: updatedLessons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CreateCourse,
  getAllCoursesWithLessons,
  updateCourseWithLessons,
  deleteCourse,
  getCourseByInstructorId,
  getCourseWithLessons,
};
