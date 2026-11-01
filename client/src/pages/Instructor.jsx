import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api, { getErrorMessage } from "../api.js";

const emptyForm = { title: "", subtitle: "", description: "", category: "Web Development", level: "Beginner", price: "0", originalPrice: "0", thumbnail: "", duration: "2 hours" };

export default function Instructor() {
  const [form, setForm] = useState(emptyForm);
  const [lessonsText, setLessonsText] = useState("Welcome to the course|5 min\nGetting started|10 min");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError(""); setMessage(""); setSaving(true);
    const lessons = lessonsText.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
      const [title, duration = "8 min"] = line.split("|");
      return { title: title.trim(), duration: duration.trim(), content: "Lesson notes will be added here by the instructor." };
    });
    try {
      await api.post("/courses", { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice), sections: [{ title: "Course lessons", lessons }] });
      setMessage("Course created successfully. It is now available in the course catalogue.");
      setForm(emptyForm);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setSaving(false); }
  }

  return <main className="page-shell instructor-page"><div className="page-intro"><div className="eyebrow">TEACH ON LEARNORA</div><h1>Share what you <span>know.</span></h1><p>Create a course and help someone take their next step.</p></div>
    <form className="instructor-form" onSubmit={submit}><div className="form-heading"><span className="form-heading-icon"><Plus /></span><div><h2>Course details</h2><p>Fill in the basics to publish your course.</p></div></div>
      {message && <div className="alert alert-success">{message}</div>}{error && <div className="alert alert-error">{error}</div>}
      <div className="form-grid"><label>Course title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required maxLength={160} /></label><label>Short subtitle<input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} maxLength={240} /></label><label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Web Development</option><option>Programming</option><option>Design</option><option>Business</option><option>Data Science</option><option>Personal Development</option></select></label><label>Level<select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All levels</option></select></label><label>Price (NZD)<input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></label><label>Original price (NZD)<input type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} required /></label><label>Duration<input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></label><label>Thumbnail image URL<input type="url" value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://example.com/image.jpg" /></label><label className="form-full">Course description<textarea rows="5" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></label><label className="form-full">Lessons (one per line: title | duration)<textarea rows="5" value={lessonsText} onChange={e => setLessonsText(e.target.value)} required /><small>Example: Introduction | 5 min</small></label></div>
      <div className="instructor-form-footer"><span><Trash2 size={15} /> You can update your course later through the API.</span><button className="button button-primary button-large" disabled={saving}>{saving ? "Publishing…" : "Publish course"} <Plus size={17} /></button></div>
    </form>
  </main>;
}
