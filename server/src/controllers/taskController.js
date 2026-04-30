const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const statuses = ["todo", "in-progress", "done"];

const isProjectAdmin = (project, user) => {
  return project.createdBy.toString() === user._id.toString();
};

const isProjectMember = (project, user) => {
  return project.members.some((member) => member.toString() === user._id.toString());
};

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, projectId, status, dueDate } = req.body;

  if (!title || !assignedTo || !projectId || !dueDate) {
    return res.status(400).json({ message: "Title, assignedTo, projectId, and dueDate are required" });
  }

  if (status && !statuses.includes(status)) {
    return res.status(400).json({ message: "Invalid task status" });
  }

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!isProjectAdmin(project, req.user)) {
    return res.status(403).json({ message: "Only the project admin can assign tasks" });
  }

  const assignee = await User.findById(assignedTo);

  if (!assignee) {
    return res.status(404).json({ message: "Assigned user not found" });
  }

  if (!isProjectMember(project, assignee)) {
    return res.status(400).json({ message: "Assigned user must be a project member" });
  }

  const parsedDueDate = new Date(dueDate);

  if (Number.isNaN(parsedDueDate.getTime())) {
    return res.status(400).json({ message: "Invalid due date" });
  }

  const task = await Task.create({
    title,
    description: description || "",
    assignedTo,
    projectId,
    status: status || "todo",
    dueDate: parsedDueDate
  });

  await Project.findByIdAndUpdate(project._id, { $addToSet: { tasks: task._id } });

  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email role")
    .populate("projectId", "name description");

  res.status(201).json(populatedTask);
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!isProjectMember(project, req.user) && !isProjectAdmin(project, req.user)) {
    return res.status(403).json({ message: "You do not have access to this project" });
  }

  const tasks = await Task.find({ projectId: project._id })
    .populate("assignedTo", "name email role")
    .sort({ dueDate: 1, createdAt: -1 });

  res.json(tasks);
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status, dueDate } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const project = await Project.findById(task.projectId);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const admin = isProjectAdmin(project, req.user);
  const assignedMember = task.assignedTo.toString() === req.user._id.toString();

  if (!admin && !assignedMember) {
    return res.status(403).json({ message: "You cannot update this task" });
  }

  if (!admin) {
    const requestedFields = Object.keys(req.body);
    const canOnlyChangeStatus = requestedFields.every((field) => field === "status");

    if (!canOnlyChangeStatus) {
      return res.status(403).json({ message: "Members can only update task status" });
    }
  }

  if (status) {
    if (!statuses.includes(status)) {
      return res.status(400).json({ message: "Invalid task status" });
    }
    task.status = status;
  }

  if (admin) {
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    if (assignedTo !== undefined) {
      const assignee = await User.findById(assignedTo);

      if (!assignee) {
        return res.status(404).json({ message: "Assigned user not found" });
      }

      if (!isProjectMember(project, assignee)) {
        return res.status(400).json({ message: "Assigned user must be a project member" });
      }

      task.assignedTo = assignedTo;
    }

    if (dueDate !== undefined) {
      const parsedDueDate = new Date(dueDate);

      if (Number.isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ message: "Invalid due date" });
      }

      task.dueDate = parsedDueDate;
    }
  }

  await task.save();

  const populatedTask = await Task.findById(task._id).populate("assignedTo", "name email role");

  res.json(populatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const project = await Project.findById(task.projectId);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!isProjectAdmin(project, req.user)) {
    return res.status(403).json({ message: "Only the project admin can delete tasks" });
  }

  await Task.findByIdAndDelete(task._id);
  await Project.findByIdAndUpdate(project._id, { $pull: { tasks: task._id } });

  res.json({ message: "Task deleted" });
});

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask
};
