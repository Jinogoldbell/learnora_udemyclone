import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api, { getErrorMessage } from "../api.js";
import CourseCard from "../components/CourseCard.jsx";

const categories = ["All", "Web Development", "Programming", "Design", "Business"];

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState("newest");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category !== "All") params.set("category", category);
    params.set("sort", sort);
    setSearchParams(params, { replace: true });
    setLoading(true);
    const timer = setTimeout(() => {
      api.get(`/courses?${params.toString()}`)
        .then(({ data }) => { setCourses(data.courses); setError(""); })
        .catch(err => setError(getErrorMessage(err)))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, sort, setSearchParams]);

  return (
    <main className="page-shell">
      <div className="page-intro"><div className="eyebrow">THE LEARNING LIBRARY</div><h1>Find your next <span>big thing.</span></h1><p>Explore practical courses designed to help you learn by doing.</p></div>
      <div className="catalog-toolbar">
        <label className="catalog-search"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="What do you want to learn?" /></label>
        <label className="sort-select"><SlidersHorizontal size={17} /><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest</option><option value="rating">Top rated</option><option value="priceLow">Price: low to high</option><option value="priceHigh">Price: high to low</option></select></label>
      </div>
      <div className="catalog-layout">
        <aside className="filter-panel"><h3>Categories</h3>{categories.map(item => <button key={item} className={`filter-option ${category === item ? "filter-active" : ""}`} onClick={() => setCategory(item)}>{item}<span>{category === item ? "●" : "○"}</span></button>)}</aside>
        <section className="catalog-results"><div className="results-heading"><h2>{category === "All" ? "All courses" : category}</h2><span>{loading ? "Loading…" : `${courses.length} course${courses.length === 1 ? "" : "s"}`}</span></div>
          {error && <div className="alert alert-error">{error}</div>}
          {loading ? <div className="loading-grid">{[1,2,3,4].map(n => <div className="skeleton-card" key={n}><div></div><span></span><span></span></div>)}</div>
            : courses.length ? <div className="course-grid">{courses.map(course => <CourseCard key={course._id} course={course} />)}</div>
            : <div className="empty-state"><div className="empty-icon"><Search /></div><h3>No courses found</h3><p>Try a different search or choose another category.</p><button className="button button-outline" onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button></div>}
        </section>
      </div>
    </main>
  );
}
