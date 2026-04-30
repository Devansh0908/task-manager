import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, ListTodo } from "lucide-react";
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

  const stats = [
    { label: "Total tasks", value: analytics.totalTasks, icon: ListTodo },
    { label: "Todo", value: analytics.byStatus.todo, icon: Clock3 },
    { label: "In progress", value: analytics.byStatus["in-progress"], icon: Clock3 },
    { label: "Done", value: analytics.byStatus.done, icon: CheckCircle2 },
    { label: "Overdue", value: analytics.overdueTasks, icon: AlertTriangle }
  ];

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>{analytics.totalProjects} active project{analytics.totalProjects === 1 ? "" : "s"}</p>
        </div>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="stat-card" key={stat.label}>
              <Icon size={22} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          );
        })}
      </div>
    </section>
  );
}
