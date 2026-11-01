import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Circle, Menu, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../api.js";

export default function Learn() {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [activeLessonId, setActiveLessonId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.get(`/enrollments/${enrollmentId}`)
      .then(({ data }) => {
        setEnrollment(data.enrollment);
        setCompleted(data.enrollment.completedLessons.map(String));
        const firstLesson = data.enrollment.course.sections?.[0]?.lessons?.[0];
        if (firstLesson) setActiveLessonId(String(firstLesson._id));
      })
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [enrollmentId]);

  const lessons = useMemo(() => enrollment?.course?.sections?.flatMap(section => section.lessons.map(lesson => ({ ...lesson, sectionTitle: section.title }))) || [], [enrollment]);
  const activeIndex = lessons.findIndex(lesson => String(lesson._id) === activeLessonId);
  const activeLesson = lessons[activeIndex];

  async function toggleComplete() {
    if (!activeLesson || saving) return;
    const isComplete = completed.includes(String(activeLesson._id));
    const next = isComplete ? completed.filter(id => id !== String(activeLesson._id)) : [...completed, String(activeLesson._id)];
    setCompleted(next);
    setSaving(true);
    setError("");
    try {
      const { data } = await api.put(`/enrollments/${enrollmentId}/progress`, { lessonId: String(activeLesson._id), completed: !isComplete });
      setCompleted(data.completedLessons.map(String));
    } catch (err) {
      setCompleted(completed);
      setError(getErrorMessage(err));
    } finally { setSaving(false); }
  }

  if (loading) return <div className="page-loading">Opening your classroom…</div>;
  if (error && !enrollment) return <main className="page-shell"><div className="alert alert-error">{error}</div><Link to="/dashboard" className="text-link">Back to dashboard</Link></main>;
  if (!enrollment) return null;

  const progress = lessons.length ? Math.round(completed.length / lessons.length * 100) : 0;
  return (
    <main className="learn-page">
      <header className="learn-header"><Link to="/dashboard" className="learn-back"><ArrowLeft size={17} /><span>My learning</span></Link><div className="learn-header-title">{enrollment.course.title}</div><div className="learn-progress-top"><span>{progress}% complete</span><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div><button className="learn-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle lessons">{sidebarOpen ? <X /> : <Menu />}</button></header>
      <div className="learn-layout"><aside className={`lesson-sidebar ${sidebarOpen ? "lesson-sidebar-open" : ""}`}><div className="lesson-sidebar-title"><span>COURSE CONTENT</span><strong>{completed.length} / {lessons.length} complete</strong></div>{enrollment.course.sections.map(section => <div className="learn-section" key={section._id}><h3>{section.title}</h3>{section.lessons.map(lesson => { const isDone = completed.includes(String(lesson._id)); return <button key={lesson._id} className={`learn-lesson ${String(lesson._id) === activeLessonId ? "learn-lesson-active" : ""}`} onClick={() => { setActiveLessonId(String(lesson._id)); setSidebarOpen(false); }}><span className="lesson-status">{isDone ? <CheckCircle2 size={17} /> : <Circle size={17} />}</span><span className="learn-lesson-text">{lesson.title}<small>{lesson.duration}</small></span></button>; })}</div>)}</aside>
        <section className="lesson-main">{activeLesson ? <><div className="lesson-video-area"><div className="lesson-video-placeholder"><div className="lesson-video-symbol"><CheckCircle2 size={30} /></div><span>LEARNORA CLASSROOM</span><p>Take your time. Make it yours.</p></div></div><div className="lesson-main-content"><div className="eyebrow">{activeLesson.sectionTitle}</div><h1>{activeLesson.title}</h1><p className="lesson-content-text">{activeLesson.content || "Your instructor will add lesson notes here."}</p><div className="lesson-navigation"><button className="button button-outline" disabled={activeIndex <= 0} onClick={() => setActiveLessonId(String(lessons[activeIndex - 1]._id))}><ChevronLeft size={17} /> Previous lesson</button><button className={`button ${completed.includes(String(activeLesson._id)) ? "button-success" : "button-primary"}`} onClick={toggleComplete} disabled={saving}>{completed.includes(String(activeLesson._id)) ? <CheckCircle2 size={17} /> : <CheckCircle2 size={17} />}{saving ? "Saving…" : completed.includes(String(activeLesson._id)) ? "Completed" : "Mark as complete"}</button><button className="button button-outline" disabled={activeIndex >= lessons.length - 1} onClick={() => setActiveLessonId(String(lessons[activeIndex + 1]._id))}>Next lesson <ChevronRight size={17} /></button></div>{error && <div className="alert alert-error">{error}</div>}</div></> : <div className="empty-state"><h3>No lessons have been added yet.</h3></div>}</section>
      </div>
    </main>
  );
}
