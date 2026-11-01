import { Router } from "express";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import { protect, instructorOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search = "", category = "", sort = "newest", page = "1", limit = "12" } = req.query;
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(30, Math.max(1, Number.parseInt(limit, 10) || 12));
    const filter = { published: true };
    if (category && category !== "All") filter.category = category;
    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
        { instructorName: { $regex: search.trim(), $options: "i" } }
      ];
    }
    const sortOptions = {
      newest: { createdAt: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      rating: { rating: -1 }
    };
    const [courses, total] = await Promise.all([
      Course.find(filter).select("-sections").sort(sortOptions[sort] || sortOptions.newest)
        .skip((pageNumber - 1) * pageSize).limit(pageSize),
      Course.countDocuments(filter)
    ]);
    res.json({ courses, pagination: { total, page: pageNumber, pages: Math.ceil(total / pageSize) } });
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid course ID." });
    const course = await Course.findOne({ _id: req.params.id, published: true });
    if (!course) return res.status(404).json({ message: "Course not found." });
    res.json({ course });
  } catch (error) { next(error); }
});

router.post("/", protect, instructorOnly, async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    if (!title?.trim() || !description?.trim() || !category?.trim()) {
      return res.status(400).json({ message: "Title, description and category are required." });
    }
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id,
      instructorName: req.user.name
    });
    res.status(201).json({ course });
  } catch (error) { next(error); }
});

router.put("/:id", protect, instructorOnly, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid course ID." });
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    if (String(course.instructor) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own courses." });
    }
    const allowed = ["title", "subtitle", "description", "thumbnail", "category", "level", "price", "originalPrice", "duration", "learningObjectives", "requirements", "sections", "published"];
    for (const key of allowed) if (req.body[key] !== undefined) course[key] = req.body[key];
    await course.save();
    res.json({ course });
  } catch (error) { next(error); }
});

router.delete("/:id", protect, instructorOnly, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid course ID." });
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    if (String(course.instructor) !== String(req.user._id)) return res.status(403).json({ message: "You can only delete your own courses." });
    await course.deleteOne();
    res.json({ message: "Course deleted." });
  } catch (error) { next(error); }
});

export default router;
