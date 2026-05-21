import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email || form.password.length < 6) {
      setError("Name, valid email, and a 6 character password are required.");
      return;
    }

    try {
      setLoading(true);
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Product summary">
        <span className="eyebrow">Start organized</span>
        <h1>Create projects, assign work, and track every deadline.</h1>
        <div className="auth-points">
          <span><CheckCircle2 size={17} /> Admin and member roles</span>
          <span><CheckCircle2 size={17} /> Live task status</span>
          <span><CheckCircle2 size={17} /> Overdue tracking</span>
        </div>
      </section>
      <form className="auth-panel" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p>Choose admin to create projects and assign tasks, or member to collaborate.</p>
        <Alert>{error}</Alert>
        <label>
          Name
          <input name="name" value={form.name} onChange={updateField} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={updateField} minLength="6" required />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={updateField}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : <>Sign up <ArrowRight size={18} /></>}
        </button>
        <span className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </span>
      </form>
    </main>
  );
}
