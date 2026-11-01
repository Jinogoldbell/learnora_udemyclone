import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, GraduationCap, PlayCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import api, { getErrorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/enrollments/my-courses")
      .then(({ data }) => setEnrollments(data.enrollments))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const completed = enrollments.filter(item => item.progress === 100).length;
  return (
    <main className="dashboard-page page-shell">
      {location.state?.notice && <div className="alert alert-success">{location.state.notice}</div>}
      <section className="dashboard-welcome"><div><div className="eyebrow">YOUR LEARNING SPACE</div><h1>Keep growing, {user?.name?.split(" ")[0] || "learner"}<span>.</span></h1><p>Every lesson is a step towards the person you're becoming.</p></div><div className="dashboard-avatar">{user?.name?.charAt(0).toUpperCase()}</div></section>
      <div className="dashboard-stats"><div className="stat-card"><span className="stat-icon stat-purple"><BookOpen /></span><div><strong>{enrollments.length}</strong><span>Courses enrolled</span></div></div><div className="stat-card"><span className="stat-icon stat-green"><CheckCircle2 /></span><div><strong>{completed}</strong><span>Courses completed</span></div></div><div className="stat-card"><span className="stat-icon stat-orange"><Clock3 /></span><div><strong>{enrollments.reduce((sum, item) => sum + (item.completedLessons?.length || 0), 0)}</strong><span>Lessons completed</span></div></div></div>
      <div className="dashboard-section-heading"><div><h2>My learning</h2><p>Pick up right where you left off.</p></div><Link className="text-link" to="/courses">Explore courses <ArrowRight size={16} /></Link></div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <div className="page-loading">Loading your courses…</div> : enrollments.length ? <div className="learning-list">{enrollments.map(item => <article className="learning-card" key={item.id}><img src={item.course.thumbnail} alt="" /><div className="learning-card-info"><span className="course-category-label">{item.course.category}</span><h3>{item.course.title}</h3><p>{item.course.instructorName}</p><div className="progress-label"><span>{item.progress}% complete</span><span>{item.completedLessons.length} / {item.totalLessons} lessons</span></div><div className="progress-track"><span style={{ width: `${item.progress}%` }}></span></div></div><Link className="button button-primary continue-button" to={`/learn/${item.id}`}><PlayCircle size={16} /> {item.progress === 100 ? "Review course" : "Continue"}</Link></article>)}</div>
        : <div className="empty-state dashboard-empty"><div className="empty-icon"><GraduationCap /></div><h3>Your learning journey starts here</h3><p>You haven't enrolled in any courses yet. Find something that sparks your curiosity.</p><Link className="button button-primary" to="/courses">Explore courses <ArrowRight size={17} /></Link></div>}
    </main>
  );
}
