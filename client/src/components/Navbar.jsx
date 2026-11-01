import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Menu, Search, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/courses${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`);
    setMobileOpen(false);
  }

  function handleLogout() {
    logout();
    navigate("/");
    setMobileOpen(false);
  }

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link className="brand" to="/" aria-label="Learnora home">
          <span className="brand-icon"><BookOpen size={21} /></span>
          <span>learnora<span className="brand-dot">.</span></span>
        </Link>
        <Link className="nav-explore" to="/courses">Explore</Link>
        <form className="nav-search" onSubmit={submitSearch}>
          <Search size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for anything" aria-label="Search courses" />
          <button aria-label="Submit search" type="submit">Search</button>
        </form>
        <nav className={`nav-links ${mobileOpen ? "nav-links-open" : ""}`}>
          <Link to="/courses" onClick={() => setMobileOpen(false)}>Courses</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>My learning</Link>
              {user.role === "instructor" && <Link to="/instructor" onClick={() => setMobileOpen(false)}>Instructor</Link>}
              <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
              <button className="button button-outline button-small" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link className="button button-outline button-small" to="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link className="button button-primary button-small" to="/register" onClick={() => setMobileOpen(false)}>Sign up</Link>
            </>
          )}
        </nav>
        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
