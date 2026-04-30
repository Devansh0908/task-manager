const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  const project = await Project.create({
    name,
    description: description || "",
    createdBy: req.user._id,
    members: [req.user._id]
  });

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { projects: project._id } });

  const populatedProject = await Project.findById(project._id)
    .populate("createdBy", "name email role")
    .populate("members", "name email role");

  res.status(201).json(populatedProject);
});

const getProjects = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "admin"
      ? { createdBy: req.user._id }
      : { members: req.user._id };

  const projects = await Project.find(filter)
    .populate("createdBy", "name email role")
    .populate("members", "name email role")
    .populate({
      path: "tasks",
      populate: { path: "assignedTo", select: "name email role" }
    })
    .sort({ createdAt: -1 });

  res.json(projects);
});

const addMember = asyncHandler(async (req, res) => {
  const { userId, email } = req.body;

  if (!userId && !email) {
    return res.status(400).json({ message: "userId or email is required" });
  }

  const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  project.members.addToSet(user._id);
  await project.save();

  await User.findByIdAndUpdate(user._id, { $addToSet: { projects: project._id } });

  const populatedProject = await Project.findById(project._id)
    .populate("createdBy", "name email role")
    .populate("members", "name email role")
    .populate("tasks");

  res.json(populatedProject);
});

const getProjectAnalytics = asyncHandler(async (req, res) => {
  const projectIds = req.user.projects;
  const projectFilter =
    req.user.role === "admin"
      ? { createdBy: req.user._id }
      : { _id: { $in: projectIds } };

  const projects = await Project.find(projectFilter).select("_id");
  const accessibleProjectIds = projects.map((project) => project._id);
  const tasks = await Task.find({ projectId: { $in: accessibleProjectIds } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const byStatus = {
    todo: 0,
    "in-progress": 0,
    done: 0
  };

  let overdue = 0;

  tasks.forEach((task) => {
    byStatus[task.status] += 1;

    if (task.status !== "done" && task.dueDate < today) {
      overdue += 1;
    }
  });

  res.json({
    totalTasks: tasks.length,
    byStatus,
    overdueTasks: overdue,
    totalProjects: projects.length
  });
});

module.exports = {
  createProject,
  getProjects,
  addMember,
  getProjectAnalytics
};
