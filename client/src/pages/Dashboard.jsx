import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, FolderKanban, ListTodo } from "lucide-react";
import api from "../api/axios";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const { data } = await api.get("/projects/analytics");
        setAnalytics(data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard.");
      }
    };

    loadAnalytics();
  }, []);

  if (error) return <Alert>{error}</Alert>;
  if (!analytics) return <Loading label="Loading dashboard" />;

  const totalTasks = analytics.totalTasks || 0;
  const donePercent = totalTasks ? Math.round((analytics.byStatus.done / totalTasks) * 100) : 0;
  const inProgressPercent = totalTasks ? Math.round((analytics.byStatus["in-progress"] / totalTasks) * 100) : 0;
  const todoPercent = totalTasks ? Math.round((analytics.byStatus.todo / totalTasks) * 100) : 0;
  const overduePercent = totalTasks ? Math.round((analytics.overdueTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: "Total tasks", value: analytics.totalTasks, icon: ListTodo, tone: "blue" },
    { label: "Todo", value: analytics.byStatus.todo, icon: Clock3, tone: "slate" },
    { label: "In progress", value: analytics.byStatus["in-progress"], icon: FolderKanban, tone: "amber" },
    { label: "Done", value: analytics.byStatus.done, icon: CheckCircle2, tone: "green" },
    { label: "Overdue", value: analytics.overdueTasks, icon: AlertTriangle, tone: "red" }
  ];

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>{analytics.totalProjects} active project{analytics.totalProjects === 1 ? "" : "s"} across your workspace</p>
        </div>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className={`stat-card stat-${stat.tone}`} key={stat.label}>
              <div className="stat-icon"><Icon size={22} /></div>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          );
        })}
      </div>
      <div className="dashboard-grid">
        <section className="panel progress-panel">
          <div className="panel-heading">
            <CheckCircle2 size={20} />
            <h2>Delivery Progress</h2>
          </div>
          <div className="progress-hero">
            <strong>{donePercent}%</strong>
            <span>tasks completed</span>
          </div>
          <div className="progress-track" aria-label="Task completion progress">
            <span style={{ width: `${donePercent}%` }} />
          </div>
          <div className="status-breakdown">
            <div>
              <span>Todo</span>
              <strong>{todoPercent}%</strong>
            </div>
            <div>
              <span>In progress</span>
              <strong>{inProgressPercent}%</strong>
            </div>
            <div>
              <span>Overdue</span>
              <strong>{overduePercent}%</strong>
            </div>
          </div>
        </section>
        <section className="panel insight-panel">
          <div className="panel-heading">
            <AlertTriangle size={20} />
            <h2>Priority Snapshot</h2>
          </div>
          <div className="insight-list">
            <div>
              <span>Open workload</span>
              <strong>{analytics.byStatus.todo + analytics.byStatus["in-progress"]}</strong>
            </div>
            <div>
              <span>Blocked by deadline</span>
              <strong>{analytics.overdueTasks}</strong>
            </div>
            <div>
              <span>Project coverage</span>
              <strong>{analytics.totalProjects}</strong>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
