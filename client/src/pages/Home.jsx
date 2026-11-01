import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, BookOpenCheck, BriefcaseBusiness, Code2, Palette, PlayCircle, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../api.js";
import CourseCard from "../components/CourseCard.jsx";

const categories = [
  { name: "Web Development", icon: Code2, color: "lavender" },
  { name: "Design", icon: Palette, color: "peach" },
  { name: "Business", icon: BriefcaseBusiness, color: "mint" },
  { name: "Programming", icon: BookOpenCheck, color: "blue" }
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/courses?limit=4&sort=rating")
      .then(({ data }) => setCourses(data.courses))
      .catch(err => setError(getErrorMessage(err)));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow"><Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Learn a little.<br /><span>Go a long way.</span></h1>
          <p>Build practical skills, explore new interests, and move towards the future you imagine — one lesson at a time.</p>
          <div className="hero-actions"><Link className="button button-primary button-large" to="/courses">Explore courses <ArrowRight size={17} /></Link><a className="hero-watch" href="#popular"><span><PlayCircle size={20} /></span> Find your next skill</a></div>
          <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><p><strong>Made for curious people</strong><br />Learn at your own pace, anywhere.</p></div>
        </div>
        <div className="hero-art">
          <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
          <div className="hero-card hero-card-main"><div className="hero-card-top"><span className="hero-card-icon"><BookOpenCheck /></span><span className="live-pill">YOUR LEARNING ERA</span></div><div className="hero-illustration"><div className="illustration-window"><div></div><div></div><div></div><div></div><div></div><div></div></div><div className="illustration-person"><div className="person-head"></div><div className="person-body"></div></div></div><p className="hero-card-label">Your potential, unlocked.</p><div className="hero-card-progress"><span></span></div><div className="hero-card-foot"><span>Keep showing up</span><strong>01 / ∞</strong></div></div>
          <div className="floating-note note-top"><span className="note-icon"><TrendingUp size={18} /></span><div><strong>Progress, not perfection</strong><small>Every lesson counts</small></div></div>
          <div className="floating-note note-bottom"><span className="note-icon note-icon-yellow"><BadgeCheck size={18} /></span><div><strong>New skill unlocked</strong><small>That's worth celebrating!</small></div></div>
          <div className="hero-spark spark-one">✳</div><div className="hero-spark spark-two">✦</div>
        </div>
      </section>

      <section className="trust-strip"><span>Curiosity is your superpower</span><span className="trust-divider"></span><span>Practical, bite-sized learning</span><span className="trust-divider"></span><span>Your pace, your path</span></section>

      <section className="section category-section">
        <div className="section-heading"><div><div className="eyebrow">FIND YOUR DIRECTION</div><h2>What would you like to <span>learn?</span></h2></div><Link className="text-link" to="/courses">All categories <ArrowRight size={16} /></Link></div>
        <div className="category-grid">
          {categories.map(({ name, icon: Icon, color }) => <Link className="category-tile" key={name} to={`/courses?category=${encodeURIComponent(name)}`}><span className={`category-icon ${color}`}><Icon size={23} /></span><span><strong>{name}</strong><small>Explore courses</small></span><ArrowRight className="category-arrow" size={17} /></Link>)}
        </div>
      </section>

      <section className="section popular-section" id="popular">
        <div className="section-heading"><div><div className="eyebrow">HANDPICKED FOR YOU</div><h2>Popular right <span>now.</span></h2><p className="section-subtitle">A few good places to start your learning journey.</p></div><Link className="text-link" to="/courses">Browse all courses <ArrowRight size={16} /></Link></div>
        {error && <div className="alert alert-error">{error} Make sure the backend and database are running.</div>}
        {courses.length ? <div className="course-grid">{courses.slice(0, 4).map(course => <CourseCard key={course._id} course={course} />)}</div> : !error ? <div className="empty-state"><div className="empty-icon"><BookOpenCheck /></div><h3>Your next favourite course is on its way</h3><p>Start the API and seed the sample courses to see the catalogue here.</p><Link className="button button-outline" to="/courses">Browse courses</Link></div> : null}
      </section>

      <section className="feature-band"><div className="feature-copy"><div className="eyebrow">LEARNING THAT FITS REAL LIFE</div><h2>Small steps today.<br /><span>New possibilities tomorrow.</span></h2><p>Make room for growth in your own way. Explore useful skills, return whenever you're ready, and keep track of how far you've come.</p><Link className="button button-light button-large" to="/register">Start learning free <ArrowRight size={17} /></Link></div><div className="feature-visual"><div className="feature-ring"></div><div className="feature-note"><span>✦</span><strong>Curiosity looks<br />good on you.</strong><small>Keep going — you've got this.</small></div><div className="feature-mini-card mini-one"><span>01</span><strong>Learn</strong></div><div className="feature-mini-card mini-two"><span>02</span><strong>Practise</strong></div><div className="feature-mini-card mini-three"><span>03</span><strong>Grow</strong></div></div></section>

      <section className="section bottom-cta"><div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Your next skill is waiting.</h2><p>Take the first step. The rest is built one lesson at a time.</p></div><Link className="button button-primary button-large" to="/courses">Find a course <ArrowRight size={17} /></Link></section>
    </>
  );
}
