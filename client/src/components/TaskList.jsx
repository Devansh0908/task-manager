import { CalendarClock, CheckCircle2, Circle, CircleDot, Trash2, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const statusLabels = {
  todo: "Todo",
  "in-progress": "In progress",
  done: "Done"
};

const statusIcons = {
  todo: Circle,
  "in-progress": CircleDot,
  done: CheckCircle2
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
        const StatusIcon = statusIcons[task.status] || Circle;

        return (
          <article className={`task-card task-${task.status}`} key={task._id}>
            <div>
              <div className="task-title-row">
                <StatusIcon size={18} />
                <h3>{task.title}</h3>
              </div>
              <p>{task.description || "No description"}</p>
              <div className="meta-row">
                <span><UserRound size={15} /> {task.assignedTo?.name || "Unassigned"}</span>
                <span><CalendarClock size={15} /> {new Date(task.dueDate).toLocaleDateString()}</span>
                {isOverdue && <span className="danger-text">Overdue</span>}
              </div>
            </div>
            <div className="task-actions">
              <span className={`status-pill status-${task.status}`}>{statusLabels[task.status]}</span>
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
