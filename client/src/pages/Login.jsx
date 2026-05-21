import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Product summary">
        <span className="eyebrow">Project control center</span>
        <h1>Keep tasks, owners, and deadlines moving together.</h1>
        <div className="auth-points">
          <span><CheckCircle2 size={17} /> Role-based teams</span>
          <span><CheckCircle2 size={17} /> Project task boards</span>
          <span><CheckCircle2 size={17} /> Deadline analytics</span>
        </div>
      </section>
      <form className="auth-panel" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p>Log in to manage team projects, assignments, and deadlines.</p>
        <Alert>{error}</Alert>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={updateField} required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : <>Log in <ArrowRight size={18} /></>}
        </button>
        <span className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </span>
      </form>
    </main>
  );
}
