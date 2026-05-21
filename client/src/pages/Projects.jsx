import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FolderPlus, ListChecks, Users } from "lucide-react";
import api from "../api/axios";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data);
  };

  useEffect(() => {
    loadProjects()
      .catch((err) => setError(err.response?.data?.message || "Unable to load projects."))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const createProject = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSaving(true);
      const { data } = await api.post("/projects", form);
      setProjects((current) => [data, ...current]);
      setForm({ name: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Loading projects" />;

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Browse projects and open a workspace to manage tasks.</p>
        </div>
      </div>
      <Alert>{error}</Alert>
      {isAdmin && (
        <form className="panel form-grid" onSubmit={createProject}>
          <div className="panel-heading">
            <FolderPlus size={20} />
            <h2>Create Project</h2>
          </div>
          <label>
            Name
            <input name="name" value={form.name} onChange={updateField} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={updateField} rows="3" />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create project"}
          </button>
        </form>
      )}
      <div className="project-grid">
        {projects.map((project) => (
          <Link className="project-card" key={project._id} to={`/projects/${project._id}`}>
            <div className="project-card-top">
              <h2>{project.name}</h2>
              <ArrowUpRight size={18} />
            </div>
            <p>{project.description || "No description"}</p>
            <div className="meta-row">
              <span><Users size={15} /> {project.members?.length || 0} members</span>
              <span><ListChecks size={15} /> {project.tasks?.length || 0} tasks</span>
            </div>
          </Link>
        ))}
      </div>
      {!projects.length && <div className="empty-state">No projects available.</div>}
    </section>
  );
}
