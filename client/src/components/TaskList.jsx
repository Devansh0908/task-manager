import { CheckCircle2, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const statusLabels = {
  todo: "Todo",
  "in-progress": "In progress",
  done: "Done"
};

export default function TaskList({ tasks, onStatusChange, onDelete }) {
  const { isAdmin } = useAuth();

  if (!tasks.length) {
    return <div className="empty-state">No tasks yet.</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const isOverdue = task.status !== "done" && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

        return (
          <article className="task-card" key={task._id}>
            <div>
              <div className="task-title-row">
                <CheckCircle2 size={18} />
                <h3>{task.title}</h3>
              </div>
              <p>{task.description || "No description"}</p>
              <div className="meta-row">
                <span>{task.assignedTo?.name || "Unassigned"}</span>
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                {isOverdue && <span className="danger-text">Overdue</span>}
              </div>
            </div>
            <div className="task-actions">
              <select value={task.status} onChange={(event) => onStatusChange(task._id, event.target.value)}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {isAdmin && (
                <button className="icon-button danger-button" type="button" onClick={() => onDelete(task._id)} aria-label="Delete task">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
