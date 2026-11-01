import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, BookOpen, CheckCircle2, Clock3, GraduationCap, PlayCircle, Star, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(({ data }) => setCourse(data.course))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function enroll() {
    if (!user) return navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
    setEnrolling(true);
    setError("");
    try {
      await api.post("/enrollments", { courseId: id });
      navigate("/dashboard", { state: { notice: "You're enrolled! Your course is ready." } });
    } catch (err) {
      const message = getErrorMessage(err);
      if (message.toLowerCase().includes("already enrolled")) navigate("/dashboard");
      else setError(message);
    } finally { setEnrolling(false); }
  }

  if (loading) return <div className="page-loading">Loading course…</div>;
  if (error && !course) return <main className="page-shell"><div className="alert alert-error">{error}</div><Link className="text-link" to="/courses"><ArrowLeft size={16} /> Back to courses</Link></main>;
  if (!course) return null;

  const lessons = course.sections?.reduce((sum, section) => sum + section.lessons.length, 0) || 0;
  return (
    <main className="course-detail-page">
      <div className="detail-dark"><div className="detail-dark-inner">
        <Link className="back-link" to="/courses"><ArrowLeft size={16} /> All courses</Link>
        <div className="detail-heading"><div className="detail-copy"><div className="eyebrow eyebrow-light">{course.category} / {course.level}</div><h1>{course.title}</h1><p className="detail-subtitle">{course.subtitle}</p><div className="detail-rating"><strong>{Number(course.rating || 0).toFixed(1)}</strong><Star size={16} fill="currentColor" /><span>({course.reviewCount || 0} learner reviews)</span></div><p className="detail-instructor">Created by <strong>{course.instructorName}</strong></p><div className="detail-facts"><span><Clock3 size={16} /> {course.duration}</span><span><PlayCircle size={16} /> {lessons} lessons</span><span><BadgeCheck size={16} /> Self-paced learning</span></div></div>
          <aside className="enroll-card"><img src={course.thumbnail} alt="" /><div className="enroll-card-content"><div className="detail-price">${Number(course.price || 0).toFixed(2)} <del>{course.originalPrice > course.price ? `$${Number(course.originalPrice).toFixed(2)}` : ""}</del></div><button className="button button-primary button-full button-large" onClick={enroll} disabled={enrolling}>{enrolling ? "Enrolling…" : "Enrol now"}</button><p className="enroll-note">Demo project — no payment is collected.</p><div className="enroll-includes"><strong>This course includes:</strong><span><PlayCircle size={16} /> On-demand lessons</span><span><BookOpen size={16} /> Full course curriculum</span><span><GraduationCap size={16} /> Progress tracking</span><span><Users size={16} /> Learn at your own pace</span></div></div></aside>
        </div>
      </div></div>
      <div className="detail-body"><section className="detail-main"><div className="detail-panel"><h2>What you'll learn</h2><div className="objectives-grid">{(course.learningObjectives?.length ? course.learningObjectives : ["Build practical knowledge", "Practise core concepts"]).map(item => <p key={item}><CheckCircle2 size={17} />{item}</p>)}</div></div><div className="detail-panel"><h2>About this course</h2><p className="detail-description">{course.description}</p>{course.requirements?.length > 0 && <><h3>Requirements</h3><ul>{course.requirements.map(item => <li key={item}>{item}</li>)}</ul></>}</div><div className="detail-panel"><h2>Course content</h2><p className="curriculum-summary">{course.sections?.length || 0} sections · {lessons} lessons · {course.duration}</p>{course.sections?.map((section, index) => <details className="curriculum-section" key={section._id || section.title} open={index === 0}><summary><span>{section.title}</span><small>{section.lessons.length} lessons</small></summary><div className="lesson-list">{section.lessons.map(lesson => <div className="lesson-row" key={lesson._id || lesson.title}><PlayCircle size={16} /><span>{lesson.title}</span><small>{lesson.duration}</small></div>)}</div></details>)}</div></section></div>
      {error && <div className="detail-error alert alert-error">{error}</div>}
    </main>
  );
}
