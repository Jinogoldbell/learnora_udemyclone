import { BookOpen, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link className="brand footer-brand" to="/"><span className="brand-icon"><BookOpen size={20} /></span><span>learnora<span className="brand-dot">.</span></span></Link>
          <p>Small steps. Big skills. A better you.</p>
        </div>
        <div className="footer-links"><Link to="/courses">Explore courses</Link><Link to="/register">Join Learnora</Link><Link to="/login">Sign in</Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Learnora. Built for curious minds.</span><span>Made with <Heart size={13} fill="currentColor" /> for lifelong learning.</span></div>
    </footer>
  );
}
