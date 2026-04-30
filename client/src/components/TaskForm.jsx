import { useState } from "react";
import Alert from "./Alert";

const initialState = {
  title: "",
  description: "",
  assignedTo: "",
  status: "todo",
  dueDate: ""
};

export default function TaskForm({ members, onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.assignedTo || !form.dueDate) {
      setError("Title, assignee, and due date are required.");
      return;
    }

    try {
      setSaving(true);
      await onSubmit(form);
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create task.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <h2>Create Task</h2>
      <Alert>{error}</Alert>
      <label>
        Title
        <input name="title" value={form.title} onChange={updateField} required />
      </label>
      <label>
        Description
        <textarea name="description" value={form.description} onChange={updateField} rows="3" />
      </label>
      <div className="two-column">
        <label>
          Assignee
          <select name="assignedTo" value={form.assignedTo} onChange={updateField} required>
            <option value="">Select member</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={updateField}>
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>
      <label>
        Due date
        <input name="dueDate" type="date" value={form.dueDate} onChange={updateField} required />
      </label>
      <button type="submit" disabled={saving}>
        {saving ? "Creating..." : "Create task"}
      </button>
    </form>
  );
}
