import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Course from "./models/Course.js";

const sampleCourses = [
  {
    title: "The Complete React Developer Course",
    subtitle: "Build modern, responsive web applications",
    description: "Learn React fundamentals, components, hooks, routing, and practical application structure through a project-focused introduction.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
    category: "Web Development", level: "Beginner", price: 59.99, originalPrice: 99.99, rating: 4.8, reviewCount: 1240, duration: "12 hours",
    learningObjectives: ["Build reusable React components", "Manage state with hooks", "Create multi-page interfaces"],
    requirements: ["Basic JavaScript knowledge", "A computer with a modern browser"],
    sections: [
      { title: "Getting started", lessons: [
        { title: "Welcome to the course", duration: "4 min", content: "Welcome! In this lesson, learn what you will build and how the course is organised." },
        { title: "Understanding components", duration: "12 min", content: "Components are reusable pieces of UI. Keep them focused, give them clear names, and pass data through props." }
      ]},
      { title: "React fundamentals", lessons: [
        { title: "Props and state", duration: "14 min", content: "Props pass information into a component. State stores information that can change over time." },
        { title: "Working with hooks", duration: "18 min", content: "Hooks such as useState and useEffect let function components manage state and side effects." }
      ]}
    ]
  },
  {
    title: "JavaScript: From Beginner to Confident",
    subtitle: "Learn the language behind interactive websites",
    description: "A practical introduction to modern JavaScript covering variables, functions, arrays, objects, async code, and DOM concepts.",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=900&q=80",
    category: "Programming", level: "Beginner", price: 44.99, originalPrice: 79.99, rating: 4.7, reviewCount: 875, duration: "9 hours",
    learningObjectives: ["Understand modern JavaScript syntax", "Work with arrays and objects", "Understand promises and async/await"],
    requirements: ["No prior JavaScript experience required"],
    sections: [{ title: "JavaScript essentials", lessons: [
      { title: "Variables and data types", duration: "10 min", content: "Use const by default and let when reassignment is required. JavaScript values include strings, numbers, booleans, objects and more." },
      { title: "Functions and arrays", duration: "16 min", content: "Functions package reusable behaviour. Arrays hold ordered collections and provide methods such as map, filter and find." }
    ]}]
  },
  {
    title: "UI Design Fundamentals",
    subtitle: "Create clear and useful digital experiences",
    description: "Explore visual hierarchy, spacing, typography, colour, layout, and practical principles for designing usable interfaces.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
    category: "Design", level: "All levels", price: 39.99, originalPrice: 69.99, rating: 4.9, reviewCount: 630, duration: "6 hours",
    learningObjectives: ["Use visual hierarchy", "Choose readable typography", "Build consistent spacing systems"],
    requirements: ["Curiosity about digital design"],
    sections: [{ title: "Design foundations", lessons: [
      { title: "Visual hierarchy", duration: "9 min", content: "Visual hierarchy helps people understand what matters first. Use size, contrast, spacing, and position intentionally." },
      { title: "Typography and spacing", duration: "11 min", content: "Use a small type scale and consistent spacing values to create a more coherent interface." }
    ]}]
  },
  {
    title: "Node.js and Express API Basics",
    subtitle: "Create a REST API with JavaScript",
    description: "Learn how a Node.js server works, define Express routes, handle requests, and connect an API to a database.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    category: "Web Development", level: "Intermediate", price: 54.99, originalPrice: 89.99, rating: 4.8, reviewCount: 510, duration: "8 hours",
    learningObjectives: ["Create Express routes", "Handle errors consistently", "Connect an API to MongoDB"],
    requirements: ["Basic JavaScript knowledge"],
    sections: [{ title: "API fundamentals", lessons: [
      { title: "Your first Express server", duration: "12 min", content: "An Express application registers middleware and routes, then listens on a port for incoming HTTP requests." },
      { title: "HTTP methods and status codes", duration: "15 min", content: "Use GET to read, POST to create, PUT or PATCH to update, and DELETE to remove resources." }
    ]}]
  },
  {
    title: "Python for Everyday Problem Solving",
    subtitle: "Build a strong programming foundation",
    description: "Practise core Python syntax, data structures, loops, functions, and small problem-solving exercises.",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
    category: "Programming", level: "Beginner", price: 34.99, originalPrice: 59.99, rating: 4.6, reviewCount: 440, duration: "7 hours",
    learningObjectives: ["Write Python functions", "Use lists and dictionaries", "Break down simple programming problems"],
    requirements: ["No prior programming experience required"],
    sections: [{ title: "Python basics", lessons: [
      { title: "Python syntax", duration: "8 min", content: "Python uses indentation to define blocks. Start with small scripts and build up to reusable functions." },
      { title: "Lists and dictionaries", duration: "13 min", content: "Lists store ordered values. Dictionaries store key-value pairs and are useful for representing structured data." }
    ]}]
  },
  {
    title: "Digital Marketing Essentials",
    subtitle: "Understand channels, audiences, and campaigns",
    description: "Learn the fundamentals of content strategy, search, email marketing, measurement, and campaign planning.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    category: "Business", level: "Beginner", price: 29.99, originalPrice: 49.99, rating: 4.7, reviewCount: 390, duration: "5 hours",
    learningObjectives: ["Define a target audience", "Understand digital channels", "Choose useful campaign metrics"],
    requirements: ["No prior marketing experience required"],
    sections: [{ title: "Marketing foundations", lessons: [
      { title: "Know your audience", duration: "10 min", content: "A useful marketing plan starts with a clear audience, their needs, and the problem your offer solves." },
      { title: "Measure what matters", duration: "12 min", content: "Choose metrics tied to your goal, such as conversion rate, qualified leads, or customer retention." }
    ]}]
  }
];

try {
  if (!process.env.MONGODB_URI) throw new Error("Set MONGODB_URI in server/.env first.");
  await mongoose.connect(process.env.MONGODB_URI);
  let instructor = await User.findOne({ email: "instructor@learnora.local" });
  if (!instructor) {
    instructor = await User.create({
      name: "Learnora Instructor",
      email: "instructor@learnora.local",
      password: await bcrypt.hash("ChangeMe123!", 12),
      role: "instructor"
    });
  }
  await Course.deleteMany({ instructor: instructor._id });
  await Course.insertMany(sampleCourses.map(course => ({ ...course, instructor: instructor._id, instructorName: instructor.name })));
  console.log(`Seeded ${sampleCourses.length} courses.`);
  console.log("Demo instructor: instructor@learnora.local / ChangeMe123!");
  console.log("Change the demo password before using this outside local development.");
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
