import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  duration: { type: String, default: "8 min" },
  content: { type: String, default: "Lesson notes will be added by the instructor." },
  videoUrl: { type: String, default: "" }
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  subtitle: { type: String, default: "", maxlength: 240 },
  description: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  instructorName: { type: String, default: "Learnora Instructor" },
  category: { type: String, required: true, index: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "All levels"], default: "Beginner" },
  price: { type: Number, default: 0, min: 0 },
  originalPrice: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 4.8, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  duration: { type: String, default: "2 hours" },
  learningObjectives: [{ type: String }],
  requirements: [{ type: String }],
  sections: [sectionSchema],
  published: { type: Boolean, default: true }
}, { timestamps: true });

courseSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Course", courseSchema);
