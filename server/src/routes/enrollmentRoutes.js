import { Router } from "express";
import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.post("/", async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!mongoose.isValidObjectId(courseId)) return res.status(400).json({ message: "A valid courseId is required." });
    const course = await Course.findOne({ _id: courseId, published: true });
    if (!course) return res.status(404).json({ message: "Course not found." });
    const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
    if (existing) return res.status(409).json({ message: "You are already enrolled in this course." });
    const enrollment = await Enrollment.create({ user: req.user._id, course: courseId });
    res.status(201).json({ enrollment, message: "Enrollment successful." });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You are already enrolled in this course." });
    next(error);
  }
});

router.get("/my-courses", async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({ path: "course", select: "title subtitle thumbnail category duration price rating instructorName sections" })
      .sort({ enrolledAt: -1 });
    const result = enrollments.filter((item) => item.course).map((item) => {
      const totalLessons = item.course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
      const completed = item.completedLessons.length;
      return {
        id: item._id,
        enrolledAt: item.enrolledAt,
        completedLessons: item.completedLessons,
        progress: totalLessons ? Math.round((completed / totalLessons) * 100) : 0,
        totalLessons,
        course: item.course
      };
    });
    res.json({ enrollments: result });
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid enrollment ID." });
    const enrollment = await Enrollment.findOne({ _id: req.params.id, user: req.user._id }).populate("course");
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found." });
    res.json({ enrollment });
  } catch (error) { next(error); }
});

router.get("/:id/progress", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid enrollment ID." });
    const enrollment = await Enrollment.findOne({ _id: req.params.id, user: req.user._id }).populate("course");
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found." });
    const totalLessons = enrollment.course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
    res.json({ completedLessons: enrollment.completedLessons, totalLessons, progress: totalLessons ? Math.round(enrollment.completedLessons.length / totalLessons * 100) : 0 });
  } catch (error) { next(error); }
});

router.put("/:id/progress", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid enrollment ID." });
    const { lessonId, completed } = req.body;
    if (typeof lessonId !== "string" || typeof completed !== "boolean") {
      return res.status(400).json({ message: "lessonId and boolean completed are required." });
    }
    const enrollment = await Enrollment.findOne({ _id: req.params.id, user: req.user._id }).populate("course");
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found." });
    const validLessonIds = enrollment.course.sections.flatMap(section => section.lessons.map(lesson => String(lesson._id)));
    if (!validLessonIds.includes(lessonId)) return res.status(400).json({ message: "That lesson does not belong to this course." });
    const set = new Set(enrollment.completedLessons.map(String));
    if (completed) set.add(lessonId); else set.delete(lessonId);
    enrollment.completedLessons = [...set];
    await enrollment.save();
    const totalLessons = validLessonIds.length;
    res.json({
      completedLessons: enrollment.completedLessons,
      totalLessons,
      progress: totalLessons ? Math.round(enrollment.completedLessons.length / totalLessons * 100) : 0
    });
  } catch (error) { next(error); }
});

export default router;
