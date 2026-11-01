import { useState } from "react";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../api.js";

export default function AuthPage({ mode = "login" }) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (isRegister && password !== confirmPassword) return setError("Passwords do not match.");
    setSubmitting(true);
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setSubmitting(false); }
  }

  return (
    <main className="auth-page">
      <div className="auth-side"><Link className="brand auth-brand" to="/"><span className="brand-icon"><BookOpen /></span><span>learnora<span className="brand-dot">.</span></span></Link><div className="auth-side-copy"><div className="eyebrow eyebrow-light"><Sparkles size={15} /> MAKE ROOM TO GROW</div><h1>{isRegister ? "Your next chapter starts here." : "Good to have you back."}</h1><p>{isRegister ? "Create a space for your curiosity. Your next skill is closer than you think." : "Pick up where you left off and keep moving towards what matters to you."}</p><div className="auth-quote">“A little progress each day adds up to big results.”<span>— Your reminder to keep going</span></div></div><div className="auth-side-footer">Learn something that moves you forward.</div></div>
      <div className="auth-form-side"><div className="auth-form-wrap"><div className="auth-mobile-brand"><span className="brand-icon"><BookOpen /></span> learnora<span className="brand-dot">.</span></div><div className="eyebrow">{isRegister ? "JOIN THE COMMUNITY" : "WELCOME BACK"}</div><h2>{isRegister ? "Create your account" : "Log in to Learnora"}</h2><p className="auth-subtitle">{isRegister ? "Start learning at your own pace." : "Your learning journey is waiting."}</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form className="auth-form" onSubmit={submit}>
          {isRegister && <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" required maxLength={80} /></label>}
          <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={isRegister ? "At least 8 characters" : "Enter your password"} autoComplete={isRegister ? "new-password" : "current-password"} minLength={8} required /></label>
          {isRegister && <label>Confirm password<input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Enter your password again" autoComplete="new-password" minLength={8} required /></label>}
          <button className="button button-primary button-full button-large" disabled={submitting}>{submitting ? "Please wait…" : isRegister ? "Create account" : "Log in"} <ArrowRight size={17} /></button>
        </form>
        <p className="auth-switch">{isRegister ? "Already have an account?" : "New to Learnora?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></p>
        <p className="auth-terms">By continuing, you agree to use this demo platform responsibly.</p>
      </div></div>
    </main>
  );
}
