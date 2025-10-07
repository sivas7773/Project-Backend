const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    contentUrl: String, // video URL / text
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", LessonSchema);
module.exports = Lesson;
