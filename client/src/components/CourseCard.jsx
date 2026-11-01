import { ArrowUpRight, Clock3, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <article className="course-card">
      <Link className="course-image-wrap" to={`/courses/${course._id}`}>
        {course.thumbnail ? <img className="course-image" src={course.thumbnail} alt="" loading="lazy" /> : <div className="course-image-placeholder">Learnora</div>}
        <span className="course-image-arrow"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="course-card-body">
        <div className="course-meta"><span>{course.category}</span><span>{course.level}</span></div>
        <h3><Link to={`/courses/${course._id}`}>{course.title}</Link></h3>
        <p className="course-instructor">{course.instructorName || "Learnora Instructor"}</p>
        <div className="course-rating"><strong>{Number(course.rating || 0).toFixed(1)}</strong><Star size={15} fill="currentColor" /><span>({course.reviewCount || 0})</span></div>
        <div className="course-card-bottom"><span className="course-price">${Number(course.price || 0).toFixed(2)}</span><span className="course-duration"><Clock3 size={14} />{course.duration || "Self-paced"}</span></div>
      </div>
    </article>
  );
}
