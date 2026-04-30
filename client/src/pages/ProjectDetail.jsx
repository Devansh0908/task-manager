import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [error, setError] = useState("");
  const [memberMessage, setMemberMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const project = useMemo(() => projects.find((item) => item._id === projectId), [projects, projectId]);

  const loadData = async () => {
    const [projectsResponse, tasksResponse] = await Promise.all([
      api.get("/projects"),
      api.get(`/tasks/${projectId}`)
    ]);
    setProjects(projectsResponse.data);
    setTasks(tasksResponse.data);
  };

  useEffect(() => {
    loadData()
      .catch((err) => setError(err.response?.data?.message || "Unable to load project."))
      .finally(() => setLoading(false));
  }, [projectId]);

  const addMember = async (event) => {
    event.preventDefault();
    setError("");
    setMemberMessage("");

    if (!memberEmail.trim()) {
      setError("Member email is required.");
      return;
    }

    try {
      const { data } = await api.post(`/projects/${projectId}/add-member`, { email: memberEmail });
      setProjects((current) => current.map((item) => (item._id === projectId ? data : item)));
      setMemberEmail("");
      setMemberMessage("Member added.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add member.");
    }
  };

  const createTask = async (values) => {
    const { data } = await api.post("/tasks", { ...values, projectId });
    setTasks((current) => [...current, data]);
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status });
      setTasks((current) => current.map((task) => (task._id === taskId ? data : task)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task.");
    }
  };

  if (loading) return <Loading label="Loading project" />;
  if (!project) return <Alert>Project not found.</Alert>;

  return (
    <section className="page-stack">
      <Link className="back-link" to="/projects">
        Back to projects
      </Link>
      <div className="page-header">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description || "No description"}</p>
        </div>
      </div>
      <Alert>{error}</Alert>
      <Alert type="success">{memberMessage}</Alert>
      <div className="detail-layout">
        <div className="page-stack">
          <section className="panel">
            <h2>Tasks</h2>
            <TaskList tasks={tasks} onStatusChange={updateTaskStatus} onDelete={deleteTask} />
          </section>
          {isAdmin && <TaskForm members={project.members || []} onSubmit={createTask} />}
        </div>
        <aside className="panel side-panel">
          <h2>Members</h2>
          <div className="member-list">
            {(project.members || []).map((member) => (
              <div className="member-row" key={member._id}>
                <strong>{member.name}</strong>
                <span>{member.email}</span>
              </div>
            ))}
          </div>
          {isAdmin && (
            <form className="member-form" onSubmit={addMember}>
              <label>
                Add member by email
                <input type="email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} required />
              </label>
              <button type="submit">Add member</button>
            </form>
          )}
        </aside>
      </div>
    </section>
  );
}
