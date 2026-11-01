import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Learn from "./pages/Learn.jsx";
import Instructor from "./pages/Instructor.jsx";

function NotFound() {
  return <main className="page-shell not-found"><div className="eyebrow">404 / WRONG TURN</div><h1>This page took a little detour.</h1><p>Let's get you back to learning.</p><a className="button button-primary" href="/">Back home</a></main>;
}

export default function App() {
  return <Routes>
    <Route path="/learn/:enrollmentId" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
    <Route path="*" element={<><Navbar /><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/instructor" element={<ProtectedRoute instructorOnly><Instructor /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes><Footer /></>}
  /></Routes>;
}
